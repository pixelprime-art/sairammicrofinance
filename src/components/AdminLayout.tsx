import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, FileText, Users, LogOut, Home, 
  Menu, X, ShieldAlert, ArrowRight, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Quick credentials login for testing the Admin page
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAdminError(null);
    const success = await login(adminEmail, adminPassword);
    setLoading(false);
    if (!success) {
      setAdminError('Invalid credentials. Hint: use admin@nayaksairam.com / admin123');
    }
  };

  // Guard: If not admin, show login gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white">Admin Access Restricted</h2>
            <p className="text-slate-400 text-sm mt-2">
              Please authenticate as an administrator to access the back-office dashboard.
            </p>
          </div>

          {adminError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 text-center font-medium">
              {adminError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                placeholder="admin@nayaksairam.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-secondary text-white rounded-xl py-3 px-4 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-secondary text-white rounded-xl py-3 px-4 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-gold-hover text-primary font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate Admin <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1">
              <Home className="w-3.5 h-3.5" /> Return to Main Website
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const sidebarLinks = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Loan Requests', path: '/admin/applications', icon: FileText },
    { label: 'KYC & Customers', path: '/admin/customers', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#001F42] text-white border-r border-slate-800 flex-shrink-0">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg p-1 flex items-center justify-center">
            <img src="/logo.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-sm leading-none text-white tracking-wide">
              SAIRAM MICROFINANCE
            </h4>
            <span className="text-[9px] text-secondary tracking-widest font-bold uppercase mt-1 block">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-grow p-4 space-y-1.5">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active 
                    ? 'bg-secondary text-primary shadow-md' 
                    : 'text-slate-300 hover:bg-navy-light/40 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-navy-light/40 hover:text-white transition-all"
          >
            <Home className="w-4 h-4" />
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:bg-red-950/30 hover:text-red-200 transition-all text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer Body */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="relative w-64 bg-[#001F42] text-white h-full flex flex-col p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white rounded p-0.5">
                    <img src="/logo.png" alt="" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-display font-extrabold text-sm">NSMF ADMIN</span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg bg-navy-light/50 text-slate-300 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-grow space-y-2">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const active = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        active 
                          ? 'bg-secondary text-primary' 
                          : 'text-slate-300 hover:bg-navy-light/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-navy-light/40"
                >
                  <Home className="w-4 h-4" />
                  View Website
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:bg-red-950/20 text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTENT AREA */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-700 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-display font-bold text-lg text-slate-800">
              {location.pathname === '/admin' ? 'Dashboard Overview' :
               location.pathname === '/admin/applications' ? 'Loan Application Registry' :
               location.pathname === '/admin/customers' ? 'Customer Profile Verification' :
               'Admin Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Stats Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">
              <UserCheck className="w-3.5 h-3.5" /> Systems Live
            </div>
            
            {/* Active Admin Profile */}
            <div className="flex items-center gap-2 border-l pl-4 border-slate-200">
              <div className="w-8 h-8 bg-primary text-secondary font-bold text-xs rounded-full flex items-center justify-center shadow-sm">
                AD
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800">NSMF Administrator</span>
                <span className="text-[10px] text-slate-400 leading-none">admin@nayaksairam.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
