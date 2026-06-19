import React, { useState, useEffect } from 'react';
import { mockDb } from '../../services/mockDb';
import type { LoanApplication } from '../../services/mockDb';
import { 
  FileText, ShieldCheck, CheckCircle2, XCircle, 
  ChevronRight, ArrowLeft, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Applications: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  
  // Workflow form state
  const [adminComment, setAdminComment] = useState('');
  const [workflowMessage, setWorkflowMessage] = useState<string | null>(null);

  useEffect(() => {
    setApplications(mockDb.getApplications());
  }, []);

  const handleAction = (status: LoanApplication['status']) => {
    if (!selectedApp) return;
    
    const updated = mockDb.updateApplicationStatus(selectedApp.id, status, adminComment);
    if (updated) {
      setApplications(mockDb.getApplications());
      setSelectedApp(updated);
      setAdminComment('');
      setWorkflowMessage(`Application ${selectedApp.id} status successfully updated to ${status.replace('_', ' ')}.`);
      setTimeout(() => setWorkflowMessage(null), 3000);
    }
  };

  const filteredApps = filterStatus === 'All' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  return (
    <div className="space-y-6 font-sans text-left relative">
      
      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex gap-2 flex-wrap">
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
        <span className="text-xs text-slate-400 font-bold uppercase mr-1">
          {filteredApps.length} Records Found
        </span>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
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
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                    No applications match the current filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-primary">{app.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{app.fullName}</td>
                    <td className="py-3.5 px-4 capitalize text-slate-500">{app.loanType}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">₹{app.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-semibold text-secondary">₹{app.monthlyEMI.toLocaleString('en-IN')}/mo</td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{app.appliedDate}</td>
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
                        onClick={() => setSelectedApp(app)}
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
                      <span className="text-xs font-semibold text-slate-800">{selectedApp.dob} ({selectedApp.gender})</span>
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

                {/* section: uploaded KYC files */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">
                    KYC Upload Previews
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Aadhaar Card', file: selectedApp.documents.aadhaarName, data: selectedApp.documents.aadhaarData },
                      { label: 'PAN Card', file: selectedApp.documents.panName, data: selectedApp.documents.panData },
                      { label: 'Passport Photo', file: selectedApp.documents.photoName, data: selectedApp.documents.photoData },
                      { label: 'Income Proof Sheet', file: selectedApp.documents.incomeProofName, data: selectedApp.documents.incomeProofData }
                    ].map((doc, idx) => (
                      <div key={idx} className="bg-slate-50 border p-3.5 rounded-xl space-y-3 text-left">
                        <div className="flex justify-between items-start">
                          <strong className="text-[11px] text-slate-800">{doc.label}</strong>
                          <span className="text-[9px] text-slate-400 truncate max-w-[100px]" title={doc.file}>
                            {doc.file}
                          </span>
                        </div>
                        {/* File base64 preview container */}
                        <div className="h-28 bg-white border rounded-lg overflow-hidden flex items-center justify-center relative group">
                          {doc.data ? (
                            <img src={doc.data} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-8 h-8 text-slate-300" />
                          )}
                          <a 
                            href={doc.data} 
                            download={doc.file}
                            className="absolute inset-0 bg-primary/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-300 font-bold text-[10px] gap-1 cursor-pointer"
                          >
                            <Download className="w-4.5 h-4.5" /> Download
                          </a>
                        </div>
                      </div>
                    ))}
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
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Audit Remarks / Refusal reasons
                    </label>
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
                      onClick={() => handleAction('KYC_Verified')}
                      disabled={selectedApp.status === 'KYC_Verified' || selectedApp.status === 'Approved'}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <ShieldCheck className="w-4 h-4" /> Mark KYC Verified
                    </button>
                    <button
                      onClick={() => handleAction('Approved')}
                      disabled={selectedApp.status === 'Approved'}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Issue Funds
                    </button>
                    <button
                      onClick={() => handleAction('Rejected')}
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

    </div>
  );
};
