import React, { useState, useEffect, useRef } from 'react';
import { mockDb } from '../../services/mockDb';
import type { LoanApplication } from '../../services/mockDb';
import { 
  FileText, ShieldCheck, CheckCircle2, XCircle, 
  ChevronRight, ArrowLeft, Download, Search, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatDateForUI = (dateStr: string) => {
  if (!dateStr) return '-';
  
  // If it's an ISO timestamp like '2026-06-30T18:30:00.000Z'
  if (dateStr.includes('T')) {
    const cleanDate = dateStr.split('T')[0]; // '2026-06-30'
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // '30-06-2026'
    }
  }
  
  // If it's 'yyyy-mm-dd'
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  
  return dateStr;
};

export const Applications: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Workflow form state
  const [adminComment, setAdminComment] = useState('');
  const [workflowMessage, setWorkflowMessage] = useState<string | null>(null);
  const [confirmStatusAction, setConfirmStatusAction] = useState<LoanApplication['status'] | null>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApplications(mockDb.getApplications());
    const handleUpdate = () => {
      setApplications(mockDb.getApplications());
    };
    window.addEventListener('nsmf_db_updated', handleUpdate);
    return () => window.removeEventListener('nsmf_db_updated', handleUpdate);
  }, []);

  // Reset table scroll position to top when filters or search query changes
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [searchQuery, filterStatus]);

  const selectApplication = (app: LoanApplication) => {
    setSelectedApp(app);
    setAdminComment(app.comments || '');
  };

  const handleAction = (status: LoanApplication['status']) => {
    if (!selectedApp) return;
    
    const updated = mockDb.updateApplicationStatus(selectedApp.id, status, adminComment);
    if (updated) {
      setApplications(mockDb.getApplications());
      setSelectedApp(updated);
      setAdminComment(updated.comments || '');
      setWorkflowMessage(`Application ${selectedApp.id} status successfully updated to ${status.replace('_', ' ')}.`);
      setTimeout(() => setWorkflowMessage(null), 3000);
    }
  };

  const handleUpdateComment = () => {
    if (!selectedApp) return;
    
    const updated = mockDb.updateApplicationStatus(selectedApp.id, selectedApp.status, adminComment);
    if (updated) {
      setApplications(mockDb.getApplications());
      setSelectedApp(updated);
      setAdminComment(updated.comments || '');
      setWorkflowMessage(`Remarks successfully updated for application ${selectedApp.id}.`);
      setTimeout(() => setWorkflowMessage(null), 3000);
    }
  };

  const exportToExcel = () => {
    if (filteredApps.length === 0) return;

    const headers = [
      { name: "S.No", width: 50 },
      { name: "Application ID", width: 110 },
      { name: "Applicant Name", width: 150 },
      { name: "DOB", width: 90 },
      { name: "Gender", width: 70 },
      { name: "Mobile", width: 110 },
      { name: "Email", width: 200 },
      { name: "Loan Scheme", width: 140 },
      { name: "Amount (₹)", width: 100 },
      { name: "Tenure Months", width: 100 },
      { name: "Interest Rate", width: 90 },
      { name: "Monthly EMI (₹)", width: 100 },
      { name: "Occupation", width: 140 },
      { name: "Employer Name", width: 140 },
      { name: "Work Experience (Years)", width: 140 },
      { name: "Monthly Income (₹)", width: 110 },
      { name: "Other Income (₹)", width: 100 },
      { name: "Applied Date", width: 90 },
      { name: "Comments", width: 180 },
      { name: "Status", width: 100 }
    ];

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Apply Loans</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; }
          th { background-color: #1e3a8a; color: #ffffff; font-weight: bold; text-align: center; vertical-align: middle; height: 35px; border: 1px solid #cbd5e1; }
          td { text-align: center; vertical-align: middle; height: 28px; border: 1px solid #e2e8f0; }
          .mso-number-text { mso-number-format: "\\@"; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
    `;

    headers.forEach(h => {
      html += `            <th style="width: ${h.width}px;">${h.name}</th>\n`;
    });

    html += `            </tr>
          </thead>
          <tbody>
    `;

    filteredApps.forEach(app => {
      html += `            <tr>
              <td>${app["S.No"] || ''}</td>
              <td class="mso-number-text">${app.id}</td>
              <td>${app.fullName}</td>
              <td class="mso-number-text">${formatDateForUI(app.dob)}</td>
              <td>${app.gender}</td>
              <td class="mso-number-text">${app.mobile}</td>
              <td>${app.email}</td>
              <td>${app.loanType}</td>
              <td>${app.amount}</td>
              <td>${app.tenureMonths}</td>
              <td>${app.interestRate}%</td>
              <td>${app.monthlyEMI}</td>
              <td>${app.occupation}</td>
              <td>${app.employerName}</td>
              <td>${app.experienceYears}</td>
              <td>${app.monthlyIncome}</td>
              <td>${app.otherIncome}</td>
              <td class="mso-number-text">${formatDateForUI(app.appliedDate)}</td>
              <td>${app.comments || ''}</td>
              <td style="font-weight: bold; color: ${
                app.status === 'Approved' ? '#00875a' :
                app.status === 'Rejected' ? '#dc2626' :
                app.status === 'KYC_Verified' ? '#2563eb' : '#b45309'
              };">${app.status.replace('_', ' ')}</td>
            </tr>\n`;
    });

    html += `          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Sairam_Loan_Applications_${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      app.id.toLowerCase().includes(query) || 
      app.fullName.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans text-left relative">
      
      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div className="flex gap-2 flex-wrap items-center">
          {['All', 'Pending', 'KYC_Verified', 'Approved', 'Rejected'].map((status) => (
            <button
               key={status}
               onClick={() => setFilterStatus(status)}
               className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                 filterStatus === status
                   ? 'bg-primary text-white border-primary shadow-sm'
                   : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
               }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl py-2 pl-9 pr-8 focus:outline-none focus:bg-white focus:border-primary/50 transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer border-0 bg-transparent flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>

          <span className="text-[10px] text-slate-400 font-extrabold uppercase shrink-0">
            {filteredApps.length} Found
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div ref={tableContainerRef} className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="py-3.5 px-4">S.No</th>
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Loan Scheme</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">EMI</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                    No applications match the current filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app, index) => (
                  <tr key={`${app.id}-${app["S.No"] || index}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-400">{app["S.No"] || '-'}</td>
                    <td className="py-3.5 px-4 font-bold text-primary">{app.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{app.fullName}</td>
                    <td className="py-3.5 px-4 capitalize text-slate-500">{app.loanType}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">₹{app.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-semibold text-secondary">₹{app.monthlyEMI.toLocaleString('en-IN')}/mo</td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{formatDateForUI(app.appliedDate)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                        app.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                        app.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                        app.status === 'KYC_Verified' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => selectApplication(app)}
                        className="text-primary hover:text-secondary font-bold inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        Review <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILS DRAWER */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setSelectedApp(null)}
            />

            {/* Drawer Content */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl z-50 flex flex-col p-6 sm:p-8 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 mr-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className="font-display font-extrabold text-base text-primary">Application Details</h3>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{selectedApp.id}</span>
                  </div>
                </div>
                
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  selectedApp.status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                  selectedApp.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                  selectedApp.status === 'KYC_Verified' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {selectedApp.status.replace('_', ' ')}
                </span>
              </div>

              {workflowMessage && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold mb-4">
                  {workflowMessage}
                </div>
              )}

              {/* Body Columns */}
              <div className="space-y-6 flex-grow pb-12">
                
                {/* section: personal info */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">
                    Applicant Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Full Name</span>
                      <span className="text-xs font-bold text-slate-800">{selectedApp.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">DOB / Gender</span>
                      <span className="text-xs font-semibold text-slate-800">{formatDateForUI(selectedApp.dob)} ({selectedApp.gender})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Mobile Number</span>
                      <span className="text-xs font-bold text-slate-800">{selectedApp.mobile}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Email Address</span>
                      <span className="text-xs font-semibold text-slate-800">{selectedApp.email}</span>
                    </div>
                  </div>
                </div>

                {/* section: financial info */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">
                    Income & Request Details
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Request Amt</span>
                      <span className="text-xs font-bold text-primary">₹{selectedApp.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Tenure months</span>
                      <span className="text-xs font-bold text-slate-800">{selectedApp.tenureMonths} mos</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Monthly EMI</span>
                      <span className="text-xs font-bold text-secondary">₹{selectedApp.monthlyEMI.toLocaleString('en-IN')}/mo</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Monthly Income</span>
                      <span className="text-xs font-bold text-slate-800">₹{selectedApp.monthlyIncome.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* section: employment */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">
                    Employment Parameters
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Occupation Category:</span>
                      <span className="font-bold text-slate-700">{selectedApp.occupation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Employer Name / Collective:</span>
                      <span className="font-bold text-slate-700">{selectedApp.employerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Work Experience:</span>
                      <span className="font-bold text-slate-700">{selectedApp.experienceYears} Years</span>
                    </div>
                  </div>
                </div>



                {/* section: comments history */}
                {selectedApp.comments && (
                  <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl space-y-1">
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block">Audit Comment Log</span>
                    <p className="text-xs text-amber-800">"{selectedApp.comments}"</p>
                  </div>
                )}

                {/* section: workflow actions */}
                <div className="space-y-4 pt-6 border-t">
                  <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">
                    Workflow Auditing Actions
                  </h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Audit Remarks / Refusal reasons
                      </label>
                      <button
                        onClick={handleUpdateComment}
                        disabled={adminComment === (selectedApp?.comments || '')}
                        className="bg-slate-700 hover:bg-slate-800 text-white font-bold text-[9px] py-1 px-2.5 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Save / Update Remarks
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Input remarks before changing loan status..."
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white text-xs rounded-xl p-3 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setConfirmStatusAction('KYC_Verified')}
                      disabled={selectedApp.status === 'KYC_Verified' || selectedApp.status === 'Approved'}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <ShieldCheck className="w-4 h-4" /> Mark KYC Verified
                    </button>
                    <button
                      onClick={() => setConfirmStatusAction('Approved')}
                      disabled={selectedApp.status === 'Approved'}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Issue Funds
                    </button>
                    <button
                      onClick={() => setConfirmStatusAction('Rejected')}
                      disabled={selectedApp.status === 'Rejected' || selectedApp.status === 'Approved'}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <XCircle className="w-4 h-4" /> Reject Loan File
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Action Confirmation Modal */}
      <AnimatePresence>
        {confirmStatusAction !== null && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmStatusAction(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 flex flex-col items-center text-center space-y-5"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setConfirmStatusAction(null)}
                className="absolute top-5 right-5 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all cursor-pointer border border-slate-200 hover:border-slate-300 bg-slate-50 shadow-sm"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Indicator Circle */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${
                confirmStatusAction === 'KYC_Verified' ? 'bg-blue-50 text-blue-600' :
                confirmStatusAction === 'Approved' ? 'bg-green-50 text-green-600' :
                'bg-red-50 text-red-600'
              }`}>
                {confirmStatusAction === 'KYC_Verified' && <ShieldCheck className="w-7 h-7" />}
                {confirmStatusAction === 'Approved' && <CheckCircle2 className="w-7 h-7" />}
                {confirmStatusAction === 'Rejected' && <XCircle className="w-7 h-7" />}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-display font-extrabold text-lg text-slate-800">
                  {confirmStatusAction === 'KYC_Verified' && "Verify KYC Documents?"}
                  {confirmStatusAction === 'Approved' && "Approve Loan Application?"}
                  {confirmStatusAction === 'Rejected' && "Reject Loan Application?"}
                </h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {confirmStatusAction === 'KYC_Verified' && `Are you sure you want to mark request ${selectedApp.id} as KYC Verified? This updates the file status and syncs immediately with Google Sheets.`}
                  {confirmStatusAction === 'Approved' && `Are you sure you want to approve request ${selectedApp.id} and authorize fund disbursement? This action is permanent and syncs with Google Sheets.`}
                  {confirmStatusAction === 'Rejected' && `Are you sure you want to decline and reject request ${selectedApp.id}? This will close the file and sync status to Google Sheets.`}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmStatusAction(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer border-0"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAction(confirmStatusAction);
                    setConfirmStatusAction(null);
                  }}
                  className={`w-full text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer border-0 shadow-lg ${
                    confirmStatusAction === 'KYC_Verified' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' :
                    confirmStatusAction === 'Approved' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' :
                    'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                  }`}
                >
                  {confirmStatusAction === 'KYC_Verified' && "Verify KYC"}
                  {confirmStatusAction === 'Approved' && "Approve Loan"}
                  {confirmStatusAction === 'Rejected' && "Reject Loan"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
