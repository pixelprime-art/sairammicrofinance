import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockDb } from '../../services/mockDb';
import type { LoanApplication, ContactMessage } from '../../services/mockDb';
import { 
  Users, Landmark, IndianRupee, RotateCcw, 
  ArrowUpRight, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<LoanApplication[]>([]);
  const [recentMsgs, setRecentMsgs] = useState<ContactMessage[]>([]);
  const [allApplications, setAllApplications] = useState<LoanApplication[]>([]);

  useEffect(() => {
    // Force db check
    mockDb.init();
    const loadData = () => {
      setStats(mockDb.getAdminStats());
      setRecentApps(mockDb.getApplications().slice(0, 4));
      setRecentMsgs(mockDb.getContactMessages().slice(0, 3));
      setAllApplications(mockDb.getApplications());
    };
    loadData();
    window.addEventListener('nsmf_db_updated', loadData);
    return () => window.removeEventListener('nsmf_db_updated', loadData);
  }, []);

  if (!stats) return <div className="text-slate-500">Loading admin metrics...</div>;

  // Get last 6 months dynamically (Jan, Feb, etc.)
  const getLast6Months = () => {
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date();
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
      months.push({
        year: targetDate.getFullYear(),
        monthIndex: targetDate.getMonth(),
        name: monthNames[targetDate.getMonth()]
      });
    }
    return months;
  };

  const parsedMonths = getLast6Months();

  // Helper to parse dates like "02-07-2026", "2026-07-02" or ISO strings
  const parseAppDate = (dateStr: string) => {
    if (!dateStr) return null;
    let cleanStr = dateStr.toString().trim();
    if (cleanStr.includes('T')) {
      cleanStr = cleanStr.split('T')[0];
    }
    // Replace slashes with hyphens to handle both 02/07/2026 and 02-07-2026
    cleanStr = cleanStr.replace(/\//g, '-');
    
    const parts = cleanStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) { // yyyy-mm-dd
        return {
          year: parseInt(parts[0]),
          month: parseInt(parts[1]) - 1
        };
      } else { // dd-mm-yyyy (standard text-formatted spreadsheet dates)
        return {
          year: parseInt(parts[2]),
          month: parseInt(parts[1]) - 1
        };
      }
    }
    return null;
  };

  // 1. Group ALL applied loan amounts by month in real time (Strictly database-driven)
  const disbursalsData = parsedMonths.map(m => {
    const monthlyApps = allApplications.filter(app => {
      const parsed = parseAppDate(app.appliedDate);
      return parsed ? (parsed.year === m.year && parsed.month === m.monthIndex) : false;
    });
    const totalAmount = monthlyApps.reduce((sum, app) => sum + app.amount, 0);
    
    // Format display string: e.g. "₹2.5L" or "₹50K" or "₹0"
    let display = '₹0';
    if (totalAmount >= 100000) {
      display = `₹${(totalAmount / 100000).toFixed(1)}L`;
    } else if (totalAmount > 0) {
      display = `₹${(totalAmount / 1000).toFixed(0)}K`;
    }

    return {
      month: m.name,
      amount: totalAmount,
      display
    };
  });

  const maxDisbursal = Math.max(...disbursalsData.map(d => d.amount), 1);

  // 2. Group onboarded customers by month (Strictly database-driven)
  const customerTrendData = parsedMonths.map(m => {
    const monthlyApps = allApplications.filter(app => {
      const parsed = parseAppDate(app.appliedDate);
      return parsed ? (parsed.year === m.year && parsed.month === m.monthIndex) : false;
    });
    const uniqueEmails = new Set(monthlyApps.map(app => app.email));
    const liveCount = uniqueEmails.size;

    return {
      month: m.name,
      count: liveCount
    };
  });

  // Calculate cumulative trend count
  let cumulativeCount = 0;
  const cumulativeTrend = customerTrendData.map(d => {
    cumulativeCount += d.count;
    return {
      month: d.month,
      cumulative: cumulativeCount
    };
  });

  const maxOnboarded = Math.max(...cumulativeTrend.map(t => t.cumulative), 1);

  // Generate SVG points for 300x100 viewport
  const getLinePoints = () => {
    return cumulativeTrend.map((p, idx) => {
      const x = idx * 60;
      // Map Y from 90 (if 0) to 10 (if maxOnboarded)
      const ratio = p.cumulative / maxOnboarded;
      const y = 90 - (ratio * 80);
      return `${x},${y}`;
    }).join(' ');
  };

  const linePoints = getLinePoints();

  return (
    <div className="space-y-8 font-sans">
      
      {/* 4 STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Total Customers */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
          <div className="space-y-1 relative z-10 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Total Customers</span>
            <h3 className="font-display font-black text-3xl text-slate-800 tracking-tight block mt-1">
              {stats.totalCustomers}
            </h3>
            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-0.5 mt-2 ${
              stats.totalCustomers > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {stats.totalCustomers > 0 ? 'Registered active profiles' : 'No customer files'}
            </span>
          </div>
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner relative z-10 shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Active Loans */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-500 to-teal-600"></div>
          <div className="space-y-1 relative z-10 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Active Loans</span>
            <h3 className="font-display font-black text-3xl text-slate-800 tracking-tight block mt-1">
              {stats.activeLoans}
            </h3>
            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-0.5 mt-2 ${
              stats.activeLoans > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {stats.activeLoans > 0 ? 'Approved loan files' : 'No approved active loans'}
            </span>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner relative z-10 shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Total Disbursed */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 to-orange-600"></div>
          <div className="space-y-1 relative z-10 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Total Disbursed</span>
            <h3 className="font-display font-black text-2xl text-slate-800 tracking-tight block mt-1 truncate max-w-[130px]" title={`₹${stats.loanAmountIssued.toLocaleString('en-IN')}`}>
              ₹{stats.loanAmountIssued.toLocaleString('en-IN')}
            </h3>
            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-0.5 mt-2 ${
              stats.loanAmountIssued > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {stats.loanAmountIssued > 0 ? 'Disbursed capital funds' : 'No capital disbursed'}
            </span>
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner relative z-10 shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Repayment Rate */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sky-500 to-blue-600"></div>
          <div className="space-y-1 relative z-10 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Repayment Rate</span>
            <h3 className="font-display font-black text-3xl text-slate-800 tracking-tight block mt-1">
              {stats.repaymentRate}%
            </h3>
            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-0.5 mt-2 ${
              stats.repaymentRate > 0 ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {stats.repaymentRate > 0 ? 'On-schedule returns' : 'No active repayment cycles'}
            </span>
          </div>
          <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner relative z-10 shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* CHARTS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Bar chart representing Monthly Loan Issuances */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6 text-left">
          <div>
            <h4 className="font-display font-extrabold text-base text-slate-800">Monthly Applications Overview</h4>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total loan value applied (₹)</span>
          </div>
          
          <div className="h-48 flex items-end justify-between pt-6 border-b border-slate-100 pb-2 relative" style={{ height: '192px' }}>
            {/* Guide grid lines */}
            <div className="absolute inset-x-0 bottom-12 border-b border-dashed border-slate-100 w-full" />
            <div className="absolute inset-x-0 bottom-24 border-b border-dashed border-slate-100 w-full" />
            <div className="absolute inset-x-0 bottom-36 border-b border-dashed border-slate-100 w-full" />

            {disbursalsData.map((bar, idx) => {
              const heightPct = (bar.amount / maxDisbursal) * 100;
              // Render bar only if amount > 0, otherwise keep height at 0 (empty)
              const displayHeight = bar.amount > 0 ? Math.max(heightPct, 6) : 0;
              return (
                <div key={idx} className="flex flex-col items-center w-12 h-full justify-end group relative z-10">
                  {/* Tooltip */}
                  <div className="absolute -top-8 scale-0 group-hover:scale-100 bg-slate-800 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg transition-transform pointer-events-none whitespace-nowrap shadow-md z-20">
                    {bar.display}
                  </div>
                  {/* Premium gradient using the same navy blue `#003366` */}
                  <div 
                    style={{ height: `${displayHeight}%` }}
                    className="w-7 bg-gradient-to-t from-[#003366]/85 to-[#003366] rounded-t-lg hover:from-[#003366] hover:to-[#002244] transition-all duration-300 shadow-sm cursor-pointer" 
                  />
                  <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase">{bar.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Customer Growth Line Chart */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6 text-left">
          <div>
            <h4 className="font-display font-extrabold text-base text-slate-800">Customer Onboarding Trend</h4>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Registration growth curve</span>
          </div>

          <div className="h-48 flex flex-col justify-end pt-6 relative border-b border-slate-100 pb-2" style={{ height: '192px' }}>
            <svg className="w-full h-32" viewBox="0 0 300 100" preserveAspectRatio="none">
              {/* Fill under line */}
              <path
                d={`M 0,100 L ${linePoints} L 300,100 Z`}
                fill="url(#gradient-fill)"
                opacity="0.1"
              />
              {/* Line */}
              <path
                d={`M ${linePoints}`}
                fill="none"
                stroke="#003366"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              
              {/* Gradient Def */}
              <defs>
                <linearGradient id="gradient-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#003366" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-2">
              {parsedMonths.map((m, idx) => (
                <span key={idx}>{m.name}</span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* RECENT APPLICATIONS & INQUIRIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Applications Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4 text-left">
          <div className="flex justify-between items-center border-b pb-4">
            <h4 className="font-display font-extrabold text-base text-slate-800">Recent Loan Requests</h4>
            <Link to="/admin/applications" className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
              Manage All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-100">
                  <th className="py-2.5 px-3">Application ID</th>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">Loan Product</th>
                  <th className="py-2.5 px-3">Request Amt</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No recent applications logged.
                    </td>
                  </tr>
                ) : (
                  recentApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-primary">{app.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{app.fullName}</td>
                      <td className="py-3 px-3 capitalize text-slate-500">{app.loanType}</td>
                      <td className="py-3 px-3 font-bold text-slate-700">₹{app.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                          app.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                          app.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                          app.status === 'KYC_Verified' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Enquiry Messages */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4 text-left">
          <div className="flex justify-between items-center border-b pb-4">
            <h4 className="font-display font-extrabold text-base text-slate-800">Support Inquiries</h4>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Messages Received</span>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            {recentMsgs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                No support queries logged.
              </div>
            ) : (
              recentMsgs.map((msg) => (
                <div key={msg.id} className={`pt-4 first:pt-0 ${msg.status === 'Unread' ? 'bg-slate-50/50 p-2.5 rounded-xl border border-slate-150' : ''}`}>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <strong className="text-xs font-bold text-slate-800">{msg.name}</strong>
                    <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                      {new Date(msg.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block mb-1">{msg.subject}</span>
                  <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                    "{msg.message}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
