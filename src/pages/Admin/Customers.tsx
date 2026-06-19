import React, { useState, useEffect } from 'react';
import { mockDb } from '../../services/mockDb';
import type { User, LoanApplication } from '../../services/mockDb';
import { 
  Users, Mail, Phone, Search, ChevronRight 
} from 'lucide-react';

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [selectedCust, setSelectedCust] = useState<User | null>(null);
  const [custApps, setCustApps] = useState<LoanApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Filter only customer roles (admins managed separately)
    const list = mockDb.getUsers().filter(u => u.role === 'customer');
    setCustomers(list);
  }, []);

  useEffect(() => {
    if (selectedCust) {
      const apps = mockDb.getApplications().filter(a => a.userId === selectedCust.id || a.email === selectedCust.email);
      setCustApps(apps);
    } else {
      setCustApps([]);
    }
  }, [selectedCust]);

  const handleToggleKYC = (email: string) => {
    // Toggle all apps for this customer to KYC_Verified mock
    const apps = mockDb.getApplications();
    const updated = apps.map(app => {
      if (app.email === email && app.status === 'Pending') {
        return { ...app, status: 'KYC_Verified' as const };
      }
      return app;
    });
    localStorage.setItem('nsmf_loan_applications', JSON.stringify(updated));
    
    // Refresh
    if (selectedCust) {
      const filterApps = updated.filter(a => a.email === selectedCust.email);
      setCustApps(filterApps);
    }
    
    // Trigger desktop alert
    mockDb.addNotification(
      'KYC Verified by Admin',
      `All pending files for email ${email} have been KYC verified.`,
      'success'
    );
  };

  const filteredCust = customers.filter(c => 
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.mobile && c.mobile.includes(searchQuery))
  );

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer profile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-250 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold uppercase mr-1">
          {filteredCust.length} Customers Enrolled
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4">Full Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Enrolled Date</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCust.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      No matching customer files found.
                    </td>
                  </tr>
                ) : (
                  filteredCust.map((cust) => (
                    <tr key={cust.id} className={`hover:bg-slate-50/50 transition-colors ${selectedCust?.id === cust.id ? 'bg-primary/5' : ''}`}>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{cust.fullName}</td>
                      <td className="py-3.5 px-4 space-y-0.5 text-slate-500">
                        <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {cust.email}</div>
                        {cust.mobile && <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {cust.mobile}</div>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-medium">
                        {new Date(cust.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedCust(cust)}
                          className="text-primary hover:text-secondary font-bold inline-flex items-center gap-0.5 cursor-pointer"
                        >
                          View Profile <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-5">
          {selectedCust ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b pb-4">
                <h3 className="font-display font-extrabold text-base text-primary">Customer Ledger Profile</h3>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{selectedCust.id}</span>
              </div>

              {/* Contact info card */}
              <div className="bg-slate-50 border p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Borrower Name:</span>
                  <span className="font-bold text-slate-700">{selectedCust.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Email Details:</span>
                  <span className="font-semibold text-slate-700">{selectedCust.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Mobile Number:</span>
                  <span className="font-bold text-slate-700">{selectedCust.mobile || 'Not provided'}</span>
                </div>
              </div>

              {/* Active loan files */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">
                  Associated Loan Files
                </h4>
                {custApps.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs py-8 bg-slate-50 border rounded-xl">
                    No active loan registrations.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {custApps.map((app) => (
                      <div key={app.id} className="bg-slate-50 border p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <strong className="text-xs text-primary block font-bold">{app.id}</strong>
                          <span className="text-[10px] capitalize text-slate-500 font-semibold mt-0.5 block">
                            {app.loanType} • ₹{app.amount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="text-right space-y-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-extrabold ${
                            app.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                            app.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                            app.status === 'KYC_Verified' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {app.status.replace('_', ' ')}
                          </span>
                          
                          {app.status === 'Pending' && (
                            <button
                              onClick={() => handleToggleKYC(selectedCust.email)}
                              className="text-[9px] text-primary hover:underline font-bold block mt-1 cursor-pointer"
                            >
                              Verify KYC Now
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-xs shadow-sm">
              <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              Select a borrower from the ledger to view active files, profiles, and verify KYC records.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
