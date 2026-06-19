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

  useEffect(() => {
    // Force db check
    mockDb.init();
    setStats(mockDb.getAdminStats());
    setRecentApps(mockDb.getApplications().slice(0, 4));
    setRecentMsgs(mockDb.getContactMessages().slice(0, 3));
  }, []);

  if (!stats) return <div className="text-slate-500">Loading admin metrics...</div>;

  // Custom Chart Coordinates for SVG line graph (Customer growth)
  const linePoints = "0,80 50,75 100,55 150,60 200,30 250,15 300,5";

  return (
    <div className="space-y-8 font-sans">
      
      {/* 4 STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Customers</span>
            <h3 className="font-display font-extrabold text-2xl text-slate-800">
              {stats.totalCustomers}
            </h3>
            <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
              +12% <ArrowUpRight className="w-3 h-3" /> this month
            </span>
          </div>
          <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Loans</span>
            <h3 className="font-display font-extrabold text-2xl text-slate-800">
              {stats.activeLoans + 24} {/* Baseline + current app count */}
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              Verified & approved schemes
            </span>
          </div>
          <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Disbursed</span>
            <h3 className="font-display font-extrabold text-xl text-slate-800 truncate max-w-[140px]">
              ₹{(stats.loanAmountIssued + 4500000).toLocaleString('en-IN')}
            </h3>
            <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
              +₹3.2L <ArrowUpRight className="w-3 h-3" /> this week
            </span>
          </div>
          <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Repayment rate</span>
            <h3 className="font-display font-extrabold text-2xl text-slate-800">
              {stats.repaymentRate}%
            </h3>
            <span className="text-[10px] text-green-500 font-bold">
              Collections on-schedule
            </span>
          </div>
          <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* CHARTS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Bar chart representing Monthly Loan Issuances */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6 text-left">
          <div>
            <h4 className="font-display font-extrabold text-base text-slate-800">Monthly Disbursals Overview</h4>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Amount issued in Lakhs (₹)</span>
          </div>
          
          <div className="h-48 flex items-end justify-between pt-6 border-b border-slate-100 pb-2 relative">
            {/* Guide grid lines */}
            <div className="absolute inset-x-0 bottom-12 border-b border-dashed border-slate-100 w-full" />
            <div className="absolute inset-x-0 bottom-24 border-b border-dashed border-slate-100 w-full" />
            <div className="absolute inset-x-0 bottom-36 border-b border-dashed border-slate-100 w-full" />

            {[
              { month: 'Jan', val: 'h-1/4', display: '₹2.5L' },
              { month: 'Feb', val: 'h-2/5', display: '₹4.0L' },
              { month: 'Mar', val: 'h-1/3', display: '₹3.2L' },
              { month: 'Apr', val: 'h-3/5', display: '₹6.0L' },
              { month: 'May', val: 'h-4/5', display: '₹8.5L' },
              { month: 'Jun', val: 'h-full', display: '₹10L' }
            ].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center w-12 group relative z-10">
                {/* Tooltip */}
                <div className="absolute -top-7 scale-0 group-hover:scale-100 bg-slate-800 text-white text-[9px] font-bold py-1 px-2 rounded transition-transform pointer-events-none whitespace-nowrap shadow">
                  {bar.display}
                </div>
                <div className={`w-6 bg-primary rounded-t-md hover:bg-secondary transition-all duration-300 ${bar.val}`} />
                <span className="text-[10px] text-slate-400 font-bold mt-2 uppercase">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Customer Growth Line Chart */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6 text-left">
          <div>
            <h4 className="font-display font-extrabold text-base text-slate-800">Customer Onboarding Trend</h4>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Registration growth curve</span>
          </div>

          <div className="h-48 flex flex-col justify-end pt-6 relative border-b border-slate-100 pb-2">
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
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
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
