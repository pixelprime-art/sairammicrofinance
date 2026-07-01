import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDb';
import type { Notification } from '../services/mockDb';
import {
  Search, Bell, ChevronDown, Menu, X, User, Lock, Mail,
  HelpCircle, LogOut, Check, ArrowRight, Shield, PhoneCall,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, login, logout, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // Dropdowns
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
  const [discoverDropdownOpen, setDiscoverDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Modals & Search
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ label: string; path: string; desc: string }[]>([]);

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for fixed navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications
  useEffect(() => {
    setNotifications(mockDb.getNotifications());
    // Polling mock notifications for interactivity
    const interval = setInterval(() => {
      setNotifications(mockDb.getNotifications());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle outside clicks to close notifications / search / more menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle live search queries
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const searchItems = [
      { label: 'Apply for Personal Loan', path: '/apply?type=personal', desc: 'Get personal loan up to 5 Lakhs' },
      { label: 'Apply for Business Loan', path: '/apply?type=business', desc: 'MSME support and working capital' },
      { label: 'Apply for Gold Loan', path: '/apply?type=gold', desc: 'Instant valuation & vault safety' },
      { label: 'Apply for Agri Loan', path: '/apply?type=agricultural', desc: 'Seeds, crop cycle & tractors' },
      { label: 'EMI Calculator', path: '/calculator', desc: 'Calculate monthly EMIs online' },
      { label: 'Privacy Policy', path: '/privacy-policy', desc: 'Information handling procedures' },
      { label: 'Terms & Conditions', path: '/terms', desc: 'Rules & usage terms' },
      { label: 'Disclaimer', path: '/disclaimer', desc: 'Licensing and financial warnings' },
      { label: 'Client Testimonials', path: '/testimonials', desc: 'What our clients say about us' },
      { label: 'FAQ', path: '/contact#faq', desc: 'General queries answered' },
      { label: 'Contact Us', path: '/contact', desc: 'Office phone, email and WhatsApp' },
      { label: 'About Sairam Micro Finance', path: '/about', desc: 'Company vision, mission and values' }
    ];

    const filtered = searchItems.filter(
      item => item.label.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setAuthLoading(true);
    const success = await login(
      email,
      password,
      isRegistering ? fullName : undefined,
      isRegistering ? mobile : undefined
    );
    setAuthLoading(false);
    if (success) {
      setLoginModalOpen(false);
      setEmail('');
      setPassword('');
      setFullName('');
      setMobile('');
      // Route admin to dashboard automatically
      if (email.toLowerCase() === 'admin@nayaksairam.com') {
        navigate('/admin');
      }
    }
  };

  const handleMarkNotifRead = () => {
    mockDb.markNotificationsAsRead();
    setNotifications(mockDb.getNotifications());
  };

  const toggleNotifDropdown = () => {
    if (!notifDropdownOpen) {
      handleMarkNotifRead();
    }
    setNotifDropdownOpen(!notifDropdownOpen);
  };

  const handleSearchResultClick = (path: string) => {
    setSearchQuery('');
    setSearchOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="w-full z-50 font-sans sticky top-0 shadow-sm">
        {/* TOP NAVBAR */}
        <div className="bg-primary text-white py-3 px-4 sm:px-8 flex justify-between items-center border-b border-navy-light text-sm">
          {/* Left: Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center shadow-md border border-secondary/40 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/logo.png"
                alt="SAIRAM MICROFINANCE Logo"
                className="w-full h-full object-contain"
                fetchPriority="high"
                decoding="async"
                onError={(e) => {
                  // Fallback if logo fails to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-[0.28em] text-[20px] leading-none text-white block">
                SAIRAM
              </span>
              <span className="text-[15px] tracking-[0.06em] text-secondary font-medium leading-none mt-1 block">
                Microfinance
              </span>
            </div>
          </Link>

          {/* Right: About Us, Notifications */}
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-secondary font-medium tracking-wide transition-colors">
              About Us
            </Link>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={toggleNotifDropdown}
                className="relative p-1.5 rounded-lg bg-navy-dark hover:bg-navy-light transition-all flex items-center justify-center cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-secondary text-primary font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
                  >
                    <div className="bg-primary text-white p-4 flex justify-between items-center">
                      <h4 className="font-display font-semibold text-base flex items-center gap-2">
                        <Bell className="w-4 h-4 text-secondary" /> Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <span className="bg-secondary text-primary font-bold text-xs px-2 py-0.5 rounded-full">
                          {unreadCount} New
                        </span>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <Check className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          <p className="text-sm">You are all caught up!</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 transition-colors hover:bg-slate-50 ${!notif.isRead ? 'bg-slate-50/70 border-l-4 border-secondary' : ''}`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h5 className="font-semibold text-sm text-slate-900 leading-tight">
                                {notif.title}
                              </h5>
                              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                                {notif.date}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* MAIN NAVBAR */}
        <div className={`transition-all duration-300 flex justify-between items-center z-40 w-full ${isSticky
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100 py-3 px-4 sm:px-8'
          : 'bg-white border-b border-slate-200 py-4 px-4 sm:px-8'
          }`}>
          {/* Main Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`font-semibold text-sm tracking-wide transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
            >
              Home
            </Link>

            {/* Need Help Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHelpDropdownOpen(true)}
              onMouseLeave={() => setHelpDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 font-semibold text-sm text-slate-600 hover:text-primary transition-colors cursor-pointer py-1.5">
                Need Help <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {helpDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                  >
                    <Link to="/loans" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary">Loan Services</Link>
                    <Link to="/about#investment" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary">Investment Services</Link>
                    <Link to="/privacy-policy" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary">Privacy Policy</Link>
                    <Link to="/terms" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary">Terms & Conditions</Link>
                    <Link to="/disclaimer" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary">Disclaimer</Link>
                    <Link to="/contact#faq" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary">FAQ</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* EMI Calculator */}
            <Link
              to="/calculator"
              className={`font-semibold text-sm tracking-wide transition-colors ${location.pathname === '/calculator' ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
            >
              EMI Calculator
            </Link>

            {/* Discover Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDiscoverDropdownOpen(true)}
              onMouseLeave={() => setDiscoverDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 font-semibold text-sm text-slate-600 hover:text-primary transition-colors cursor-pointer py-1.5">
                Discover Services <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {discoverDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                  >
                    <Link to="/apply" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary">Apply for Loan</Link>
                    <Link to="/about#investment-form" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary">Investment Form</Link>
                    <Link to="/loans" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary">Loan Types</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/contact"
              className={`font-semibold text-sm tracking-wide transition-colors ${location.pathname === '/contact' ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Area: Search, Auth buttons, Apply Button */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative" ref={searchRef}>
                <div className="relative flex items-center bg-slate-100 border border-slate-200 rounded-lg py-1.5 px-3 w-40 sm:w-56 focus-within:w-64 focus-within:bg-white transition-all duration-300">

                  {/* Animated blue stroke ring */}
                  <svg
                    className="pointer-events-none absolute inset-0 w-full h-full"
                    style={{ overflow: 'visible', borderRadius: '8px' }}
                  >
                    <defs>
                      <linearGradient id="search-blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="objectBoundingBox">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#bfdbfe" />
                        <animateTransform
                          attributeName="gradientTransform"
                          type="rotate"
                          from="0 0.5 0.5"
                          to="360 0.5 0.5"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </linearGradient>
                    </defs>
                    <rect
                      x="0" y="0"
                      width="100%" height="100%"
                      rx="8" ry="8"
                      fill="none"
                      stroke="url(#search-blue-gradient)"
                      strokeWidth="2"
                    />
                  </svg>

                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                    onBlur={() => { }}
                    className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder-slate-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {searchOpen && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 max-h-72 overflow-y-auto"
                    >
                      {searchResults.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSearchResultClick(item.path)}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 cursor-pointer"
                        >
                          <div className="font-semibold text-xs text-primary">{item.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Apply Loan CTA Button */}
              <Link
                to="/apply"
                className="hidden sm:inline-flex bg-secondary hover:bg-gold-hover text-primary font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md items-center gap-1.5 pulse-gold font-display"
              >
                Apply Loan
              </Link>

              {/* Three-dot Contextual Menu */}
              <div className="relative hidden sm:block" ref={moreMenuRef}>
                <button
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center w-8 h-8"
                  title="More Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {moreMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-left"
                    >
                      {isAuthenticated ? (
                        <div className="flex flex-col">
                          {isAdmin ? (
                            <Link
                              to="/admin"
                              onClick={() => setMoreMenuOpen(false)}
                              className="px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-primary font-semibold text-xs flex items-center gap-2 transition-colors"
                            >
                              <Shield className="w-4 h-4 text-primary" /> Admin Panel
                            </Link>
                          ) : (
                            <div className="px-4 py-2 border-b border-slate-100 font-semibold text-xs text-primary bg-primary/5 mb-1">
                              Hello, {user?.fullName.split(' ')[0]}
                            </div>
                          )}
                          <button
                            onClick={() => {
                              logout();
                              setMoreMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-slate-700 hover:text-red-600 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" /> Logout
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setLoginModalOpen(true);
                            setMoreMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-primary font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Lock className="w-4 h-4 text-slate-400 group-hover:text-primary" /> Login
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer Body */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg p-1 flex items-center justify-center">
                    <img src="/logo.png" alt="" className="w-full h-full object-contain" decoding="async" />
                  </div>
                  <span className="font-display font-extrabold text-sm tracking-wide text-primary">SAIRAM MICROFINANCE</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex flex-col gap-6 text-sm">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-slate-800 hover:text-primary">Home</Link>

                {/* Expandable Need Help */}
                <div>
                  <div className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-2">Need Help</div>
                  <div className="flex flex-col gap-3 pl-3 border-l border-slate-200">
                    <Link to="/loans" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-primary">Loan Services</Link>
                    <Link to="/about#investment" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-primary">Investment Services</Link>
                    <Link to="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-primary">Privacy Policy</Link>
                    <Link to="/terms" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-primary">Terms & Conditions</Link>
                    <Link to="/disclaimer" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-primary">Disclaimer</Link>
                    <Link to="/contact#faq" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-primary">FAQ</Link>
                  </div>
                </div>

                <Link to="/calculator" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-slate-800 hover:text-primary">EMI Calculator</Link>

                {/* Expandable Discover */}
                <div>
                  <div className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-2">Discover Services</div>
                  <div className="flex flex-col gap-3 pl-3 border-l border-slate-200">
                    <Link to="/apply" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-primary">Apply for Loan</Link>
                    <Link to="/about#investment-form" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-primary">Investment Form</Link>
                    <Link to="/loans" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-primary">Loan Types</Link>
                  </div>
                </div>

                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="font-semibold text-slate-800 hover:text-primary">Contact Us</Link>
              </div>

              {/* Mobile CTA */}
              <div className="mt-auto pt-8 flex flex-col gap-3">
                <Link
                  to="/apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-secondary hover:bg-gold-hover text-primary font-bold text-sm py-3 rounded-xl text-center shadow-md flex justify-center items-center gap-1.5"
                >
                  Apply Loan <ArrowRight className="w-4 h-4" />
                </Link>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full border border-red-200 hover:bg-red-50 text-red-500 font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="w-full border border-primary/30 text-primary hover:bg-primary hover:text-white font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" /> Login
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AUTHENTICATION MODAL */}
      <AnimatePresence>
        {loginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-dark"
              onClick={() => setLoginModalOpen(false)}
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative z-50 p-6 sm:p-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setLoginModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <img src="/logo.png" alt="" className="w-8 h-8 object-contain" decoding="async" />
                </div>
                <h3 className="font-display font-bold text-xl text-primary">
                  {isRegistering ? 'Create Customer Account' : 'Welcome to SAIRAM MICROFINANCE'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isRegistering
                    ? 'Register to track loans and uploads'
                    : 'Log in to apply and manage applications'}
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
                  {authError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Password only needed for admin check or mock security demonstration */}
                {(!isRegistering || email.toLowerCase() === 'admin@nayaksairam.com') && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Password {email.toLowerCase() !== 'admin@nayaksairam.com' && <span className="text-[10px] text-slate-400 lowercase">(Optional for mock customer)</span>}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        required={email.toLowerCase() === 'admin@nayaksairam.com'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}

                {isRegistering && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Kumar"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mobile Number</label>
                      <div className="relative">
                        <PhoneCall className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9840XXXXXX"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-primary hover:bg-navy-dark text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {authLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {isRegistering ? 'Register & Log In' : 'Log In'}
                      <ArrowRight className="w-4 h-4 text-secondary" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  {isRegistering ? 'Already have an account? Log In' : 'Create Customer Account'}
                </button>

                {/* Admin Quick Credentials Tip */}
                {!isRegistering && (
                  <div className="text-[10px] text-slate-400 bg-slate-50 p-1.5 rounded border border-slate-200 max-w-[150px] text-left leading-normal">
                    <span className="font-bold text-slate-500">Admin Login:</span><br />
                    admin@nayaksairam.com<br />
                    pw: admin123
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
