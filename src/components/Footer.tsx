import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, ArrowRight, ShieldCheck 
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-dark text-white border-t border-navy-light pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center border border-secondary/40 shadow-md">
              <img src="/logo.png" alt="" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-display font-extrabold tracking-wide text-lg text-white leading-none">
                NAYAK SAIRAM
              </h3>
              <span className="text-[10px] tracking-[0.15em] text-secondary font-bold uppercase leading-none mt-1 block">
                Micro Finance
              </span>
            </div>
          </Link>
          <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
            Empowering entrepreneurs, farmers, women, and families through accessible, inclusive, and transparent financial solutions. Transforming communities since 2015.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-lg bg-navy hover:bg-secondary hover:text-primary transition-all flex items-center justify-center text-slate-300 shadow-sm"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-lg bg-navy hover:bg-secondary hover:text-primary transition-all flex items-center justify-center text-slate-300 shadow-sm"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-lg bg-navy hover:bg-secondary hover:text-primary transition-all flex items-center justify-center text-slate-300 shadow-sm"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-lg bg-navy hover:bg-secondary hover:text-primary transition-all flex items-center justify-center text-slate-300 shadow-sm"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163c-.272-1.022-1.074-1.824-2.096-2.097C19.558 3.5 12 3.5 12 3.5s-7.558 0-9.402.566C1.576 4.34 1.024 5.14 1.024 6.163 1 8.01 1 12 1 12s0 3.99.024 5.837c.272 1.022 1.074 1.824 2.096 2.097C4.442 20.5 12 20.5 12 20.5s7.558 0 9.402-.566c1.022-.273 1.824-1.075 2.096-2.097C24 15.99 24 12 24 12s0-3.99-.024-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
          <div className="bg-navy/60 border border-navy-light p-3.5 rounded-xl inline-flex items-center gap-2 max-w-xs text-xs text-secondary font-semibold">
            <ShieldCheck className="w-4 h-4" /> Licenced & Governed by RBI Guidelines
          </div>
        </div>

        {/* Company Links Column */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-sm tracking-widest text-slate-200 uppercase border-b border-navy-light pb-2">
            Company
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/about" className="text-slate-300 hover:text-secondary flex items-center gap-1.5 transition-colors group">
                <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                About Us
              </Link>
            </li>
            <li>
              <Link to="/about#careers" className="text-slate-300 hover:text-secondary flex items-center gap-1.5 transition-colors group">
                <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                Careers
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-slate-300 hover:text-secondary flex items-center gap-1.5 transition-colors group">
                <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Loans Column */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-sm tracking-widest text-slate-200 uppercase border-b border-navy-light pb-2">
            Loans
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/apply?type=personal" className="text-slate-300 hover:text-secondary flex items-center gap-1.5 transition-colors group">
                <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                Personal Loan
              </Link>
            </li>
            <li>
              <Link to="/apply?type=business" className="text-slate-300 hover:text-secondary flex items-center gap-1.5 transition-colors group">
                <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                Business Loan
              </Link>
            </li>
            <li>
              <Link to="/apply?type=gold" className="text-slate-300 hover:text-secondary flex items-center gap-1.5 transition-colors group">
                <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                Gold Loan
              </Link>
            </li>
            <li>
              <Link to="/apply?type=education" className="text-slate-300 hover:text-secondary flex items-center gap-1.5 transition-colors group">
                <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                Education Loan
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="space-y-4">
          <h4 className="font-display font-bold text-sm tracking-widest text-slate-200 uppercase border-b border-navy-light pb-2">
            Support & Info
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/contact#faq" className="text-slate-300 hover:text-secondary flex items-center gap-1.5 transition-colors group">
                <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="text-slate-300 hover:text-secondary flex items-center gap-1.5 transition-colors group">
                <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-slate-300 hover:text-secondary flex items-center gap-1.5 transition-colors group">
                <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/disclaimer" className="text-slate-300 hover:text-secondary flex items-center gap-1.5 transition-colors group">
                <ArrowRight className="w-3 h-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                Disclaimer
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Corporate Info Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 border-t border-navy-light/50 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-slate-200 mb-0.5">Corporate Headquarters</h5>
            <p className="text-xs leading-relaxed text-slate-400">
              Nayak Sairam Towers, 4th Floor, Anna Salai, Chennai, Tamil Nadu 600002
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-slate-200 mb-0.5">Helpline Support</h5>
            <p className="text-xs text-slate-400">
              +91 44 2855 9000 (Mon - Sat, 9 AM - 6 PM)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-slate-200 mb-0.5">Email Support</h5>
            <p className="text-xs text-slate-400">
              corp.chennai@nayaksairam.com
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 pt-6 border-t border-navy-light/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
        <p>© 2026 Nayak Sairam Micro Finance. All Rights Reserved.</p>
        <p className="text-slate-500">
          Designed with trust and security. Certified RBI Category-B Microfinance Institution.
        </p>
      </div>
    </footer>
  );
};
