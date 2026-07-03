import React, { useState, useEffect, useRef } from 'react';
import { mockDb } from '../../services/mockDb';
import type { ContactMessage } from '../../services/mockDb';
import { 
  Mail, Phone, Search, ChevronRight, ArrowLeft, Download, CheckCircle2, MessageSquare, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatDateForUI = (dateStr: string) => {
  if (!dateStr) return '-';
  
  // If it's an ISO timestamp
  if (dateStr.includes('T')) {
    const cleanDate = dateStr.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  
  return dateStr;
};

export const Customers: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [workflowMessage, setWorkflowMessage] = useState<string | null>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(mockDb.getContactMessages());
    const handleUpdate = () => {
      setMessages(mockDb.getContactMessages());
    };
    window.addEventListener('nsmf_db_updated', handleUpdate);
    return () => window.removeEventListener('nsmf_db_updated', handleUpdate);
  }, []);

  // Reset scroll to top on search or filter change
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [searchQuery, filterStatus]);

  const selectMessage = (msg: ContactMessage) => {
    setSelectedMsg(msg);
  };

  const handleMarkAsRead = () => {
    if (!selectedMsg) return;
    mockDb.markContactMessageRead(selectedMsg.id);
    
    // Update local selected state
    setSelectedMsg({ ...selectedMsg, status: 'Read' });
    setWorkflowMessage(`Message from ${selectedMsg.name} has been marked as read.`);
    setTimeout(() => setWorkflowMessage(null), 3000);
  };

  const filteredMessages = messages.filter(msg => {
    const matchesStatus = filterStatus === 'All' || msg.status === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      msg.id.toLowerCase().includes(query) ||
      msg.name.toLowerCase().includes(query) ||
      msg.phone.toLowerCase().includes(query) ||
      msg.subject.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const exportToExcel = () => {
    if (filteredMessages.length === 0) return;

    const headers = [
      { name: "S.No", width: 50 },
      { name: "Inquiry ID", width: 110 },
      { name: "Applicant Name", width: 160 },
      { name: "Mobile Number", width: 120 },
      { name: "Inquiry Subject", width: 180 },
      { name: "Message Body", width: 320 },
      { name: "Submitted Date", width: 110 },
      { name: "Status", width: 90 }
    ];

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Contact Messages</x:Name>
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

    filteredMessages.forEach(msg => {
      html += `            <tr>
              <td>${msg["S.No"] || ''}</td>
              <td class="mso-number-text">${msg.id}</td>
              <td>${msg.name}</td>
              <td class="mso-number-text">${msg.phone}</td>
              <td>${msg.subject}</td>
              <td style="text-align: left;">${msg.message}</td>
              <td class="mso-number-text">${formatDateForUI(msg.submittedAt)}</td>
              <td style="font-weight: bold; color: ${
                msg.status === 'Read' ? '#475569' : '#b45309'
              };">${msg.status}</td>
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
    link.setAttribute("download", `Sairam_Contact_Inquiries_${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans text-left relative">
      
      {/* Filters & Search Row */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div className="flex gap-2 flex-wrap items-center">
          {['All', 'Unread', 'Read'].map((status) => (
            <button
               key={status}
               onClick={() => setFilterStatus(status)}
               className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                 filterStatus === status
                   ? 'bg-primary text-white border-primary shadow-sm'
                   : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
               }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone or subject..."
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

          <span className="text-[10px] text-slate-400 font-extrabold uppercase shrink-0">
            {filteredMessages.length} Found
          </span>
        </div>
      </div>

      {/* Messages Table Container */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div ref={tableContainerRef} className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="py-3.5 px-4">S.No</th>
                <th className="py-3.5 px-4">Inquiry ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Message Preview</th>
                <th className="py-3.5 px-4">Submitted Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                    No contact messages match the current filter.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg, index) => (
                  <tr key={`${msg.id}-${msg["S.No"] || index}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-400">{msg["S.No"] || '-'}</td>
                    <td className="py-3.5 px-4 font-bold text-primary">{msg.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{msg.name}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{msg.phone}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{msg.subject}</td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-[200px] truncate">{msg.message}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{formatDateForUI(msg.submittedAt)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                        msg.status === 'Read'
                          ? 'bg-slate-100 text-slate-600 border border-slate-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => selectMessage(msg)}
                        className="inline-flex items-center gap-1 bg-slate-50 hover:bg-primary hover:text-white border border-slate-200 hover:border-primary px-3 py-1.5 rounded-xl font-bold text-primary transition-all cursor-pointer shadow-sm"
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

      {/* Side Details Drawer */}
      <AnimatePresence>
        {selectedMsg && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setSelectedMsg(null)}
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
                    onClick={() => setSelectedMsg(null)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 mr-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className="font-display font-extrabold text-base text-primary">Inquiry Details</h3>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{selectedMsg.id}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                  selectedMsg.status === 'Read'
                    ? 'bg-slate-100 text-slate-600 border border-slate-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {selectedMsg.status}
                </span>
              </div>

              {workflowMessage && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold mb-4">
                  {workflowMessage}
                </div>
              )}

              {/* Inquiry Details Body */}
              <div className="space-y-6 flex-grow pb-12">
                {/* Applicant Profile */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">
                    Contact Profile
                  </h4>
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Sender Name</span>
                      <span className="text-xs font-bold text-slate-800">{selectedMsg.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Phone Number</span>
                      <span className="text-xs font-bold text-slate-800">{selectedMsg.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Submitted Date</span>
                      <span className="text-xs font-semibold text-slate-800">{formatDateForUI(selectedMsg.submittedAt)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Inquiry Type</span>
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-secondary" /> {selectedMsg.subject}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-3">
                  <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">
                    Inquiry Message
                  </h4>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                    <div className="border-b border-slate-200 pb-3">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Subject</span>
                      <h4 className="text-xs font-extrabold text-slate-800 mt-0.5">{selectedMsg.subject}</h4>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Message Description</span>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1.5 whitespace-pre-wrap font-semibold">
                        "{selectedMsg.message}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              {selectedMsg.status === 'Unread' && (
                <div className="border-t pt-6 bg-white space-y-3">
                  <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">
                    Administrative Actions
                  </h4>
                  <button
                    onClick={handleMarkAsRead}
                    className="w-full bg-primary hover:bg-primary-hover text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-secondary" /> Mark as Read & Acknowledge
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
