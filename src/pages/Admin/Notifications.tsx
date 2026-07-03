import React, { useState, useEffect, useRef } from 'react';
import { mockDb } from '../../services/mockDb';
import type { Notification } from '../../services/mockDb';
import { 
  Bell, Trash2, Plus, Search, AlertCircle, CheckCircle2, Info, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatDateForUI = (dateStr: string) => {
  if (!dateStr) return '-';
  
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

const NOTIFICATION_TEMPLATES = [
  {
    id: 'custom',
    name: 'Write Custom Notification...',
    title: '',
    message: ''
  },
  {
    id: 'welcome',
    name: 'Welcome to Sairam Micro Finance',
    title: 'Welcome to Sairam Micro Finance',
    message: 'Explore our loan products, check your eligible EMI, and start applying today!'
  },
  {
    id: 'loan_scheme',
    name: 'New Loan Scheme Active',
    title: 'New Loan Scheme Active',
    message: 'Agricultural loans now start at an all-time low of 7.99% per annum.'
  },
  {
    id: 'jlg_loans',
    name: 'Women Joint Liability Group (JLG) Loans Active',
    title: 'Women Joint Liability Group (JLG) Loans Active',
    message: 'Get access to collateral-free startup microfinance loan options at discounted interest rates. Apply today!'
  },
  {
    id: 'emi_calc',
    name: 'Check Your Monthly EMI Instantly',
    title: 'Check Your Monthly EMI Instantly',
    message: 'Use our interactive EMI Calculator tool in the navigation menu to select your loan tenure and calculate payouts instantly.'
  },
  {
    id: 'fast_credit',
    name: 'Fast 2-Hour Loan Credit Processing',
    title: 'Fast 2-Hour Loan Credit Processing',
    message: 'Submit your basic loan applications online and get credit assessments processed within 2 hours. Funds disbursed within 24-48 hours!'
  }
];

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form states
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [formMsg, setFormMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(mockDb.getNotifications());
    const handleUpdate = () => {
      setNotifications(mockDb.getNotifications());
    };
    window.addEventListener('nsmf_db_updated', handleUpdate);
    return () => window.removeEventListener('nsmf_db_updated', handleUpdate);
  }, []);

  // Reset scroll to top on search
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [searchQuery]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = NOTIFICATION_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setTitle(template.title);
      setMessage(template.message);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSelectedTemplate('custom');
  };

  const handleMessageChange = (val: string) => {
    setMessage(val);
    setSelectedTemplate('custom');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setFormMsg({ text: 'Please fill in all notification fields.', success: false });
      return;
    }

    mockDb.addNotification(title.trim(), message.trim());
    setTitle('');
    setMessage('');
    setSelectedTemplate('custom');
    
    setFormMsg({ text: 'Notification published successfully to the website and Google Sheets!', success: true });
    setTimeout(() => setFormMsg(null), 3000);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const filteredNotifs = notifications.filter(n => {
    const query = searchQuery.toLowerCase().trim();
    return !query || 
      n.id.toLowerCase().includes(query) ||
      n.title.toLowerCase().includes(query) ||
      n.message.toLowerCase().includes(query) ||
      n.type.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-8 font-sans text-left">
      
      {/* Top Split View: Form and Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Create Notification */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-primary">Publish New Notification</h3>
              <p className="text-[10px] text-slate-400 font-bold block mt-0.5">Broadcast an update to all active users on the website header.</p>
            </div>
          </div>

          {formMsg && (
            <div className={`p-4 rounded-xl text-xs font-semibold mb-6 border ${
              formMsg.success 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {formMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Notification Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 text-xs rounded-xl py-3 px-4 focus:outline-none transition-all text-slate-800 font-bold"
                >
                  {NOTIFICATION_TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Notification Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Maintenance Scheduled"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 text-xs rounded-xl py-3 px-4 focus:outline-none transition-all text-slate-800 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Detailed Message
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Sairam Microfinance portal will undergo scheduled backend updates on Sunday from 2:00 AM to 4:00 AM IST..."
                value={message}
                onChange={(e) => handleMessageChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary/50 text-xs rounded-xl py-3 px-4 focus:outline-none transition-all text-slate-800 placeholder-slate-400 font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-secondary" /> Broadcast Notification
            </button>
          </form>
        </div>

        {/* Right Info Box: How it Works */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#001F42] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col justify-between border border-slate-800">
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-base text-secondary flex items-center gap-2">
              <Bell className="w-5 h-5" /> Notification Center
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed font-medium">
              Broadcasted notifications appear in real-time under the notifications dropdown bell in the website header. Announce holidays, new loan schemes, system updates, or emergency office declarations to all active website users immediately.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[10px] text-slate-400 font-bold leading-normal">
            * All changes are synced instantaneously with Google Sheets Sheet 3 "Notification".
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="space-y-4">
        {/* Search bar row */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
          <h4 className="font-display font-extrabold text-sm text-primary">Broadcast History</h4>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search history..."
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
              {filteredNotifs.length} Total
            </span>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div ref={tableContainerRef} className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="py-3.5 px-4">S.No</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Message</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNotifs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                      No broadcast notifications match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredNotifs.map((notif, index) => (
                    <tr key={`${notif.id}-${notif["S.No"] || index}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-400">{notif["S.No"] || '-'}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{notif.title}</td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-sm truncate" title={notif.message}>{notif.message}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-medium">{formatDateForUI(notif.date)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteClick(notif.id)}
                          className="inline-flex items-center justify-center p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer border-0 bg-transparent"
                          title="Delete Broadcast Notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTargetId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTargetId(null)}
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
                onClick={() => setDeleteTargetId(null)}
                className="absolute top-5 right-5 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all cursor-pointer border border-slate-200 hover:border-slate-300 bg-slate-50 shadow-sm"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-inner">
                <AlertCircle className="w-7 h-7" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-display font-extrabold text-lg text-slate-800">
                  Delete Announcement?
                </h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Are you sure you want to permanently delete this broadcast notification? This action will remove it from the website header and synchronize immediately with Google Sheets.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-full pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer border-0"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (deleteTargetId) {
                      mockDb.deleteNotification(deleteTargetId);
                      setDeleteTargetId(null);
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer border-0 shadow-lg shadow-red-500/20"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
