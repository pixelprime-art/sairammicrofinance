import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDb } from '../services/mockDb';
import type { LoanType, Testimonial } from '../services/mockDb';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Coins, Users2, 
  ChevronRight, MessageSquare, Phone, Mail, Award, 
  ChevronLeft, Calculator, Clock, Star, Landmark, ChevronDown, Check, Send
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  // Testimonial Carousel State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Blog / Info Tabs
  const [activeInfoTab, setActiveInfoTab] = useState<'apply' | 'docs' | 'rates' | 'time'>('apply');
  
  // FAQ State
  const [activeFaqCategory, setActiveFaqCategory] = useState<'loans' | 'investments' | 'emi' | 'repayment'>('loans');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(300000); // INR
  const [interestRate, setInterestRate] = useState(10.99); // Yearly %
  const [loanTenure, setLoanTenure] = useState(36); // Months
  const [emiOutputs, setEmiOutputs] = useState({ emi: 0, totalInterest: 0, totalPayable: 0 });

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('General Enquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setLoanTypes(mockDb.getLoanTypes());
    setTestimonials(mockDb.getTestimonials());
  }, []);

  // Recalculate EMI whenever variables change
  useEffect(() => {
    const monthlyRate = interestRate / 12 / 100;
    const n = loanTenure;
    
    let emi = 0;
    if (monthlyRate === 0) {
      emi = loanAmount / n;
    } else {
      emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    }
    
    const totalPayable = emi * n;
    const totalInterest = totalPayable - loanAmount;

    setEmiOutputs({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable)
    });
  }, [loanAmount, interestRate, loanTenure]);

  // Testimonials Auto-scroll
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactMessage) return;
    mockDb.createContactMessage(contactName, contactPhone, contactSubject, contactMessage);
    setFormSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactPhone('');
      setContactMessage('');
      setFormSubmitted(false);
    }, 3000);
  };

  // SVG Chart values
  const totalVal = emiOutputs.totalPayable || 1;
  const principalPercent = (loanAmount / totalVal) * 100;
  const interestPercent = (emiOutputs.totalInterest / totalVal) * 100;

  // Custom strokeDasharray variables for Pie Chart rendering
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const principalOffset = circumference - (principalPercent / 100) * circumference;
  const interestOffset = circumference - (interestPercent / 100) * circumference;

  const faqData = {
    loans: [
      { id: 1, q: "What is the maximum loan amount I can apply for?", a: "For personal loans, you can apply for up to ₹5 Lakhs. For MSME business loans, the maximum limit is ₹25 Lakhs, subject to eligibility check and verification." },
      { id: 2, q: "Does Nayak Sairam Micro Finance require collateral for all loans?", a: "No. Our Personal Loans, Women's Empowerment Loans, and Emergency Loans are completely collateral-free. Only MSME Business Loans and Gold Loans require security/collateral." }
    ],
    investments: [
      { id: 3, q: "What micro-investment options are available?", a: "We offer fixed deposits and recurring micro-investment schemes starting at just ₹1,000 per month with competitive interest yields. Fill out our Investment Enquiry Form to learn more." },
      { id: 4, q: "Are my investments secure with Nayak Sairam?", a: "Yes. Our operations follow rigid regulatory guidelines, and our security models maintain institutional vault and backup architectures." }
    ],
    emi: [
      { id: 5, q: "How is the monthly EMI calculated?", a: "EMI is calculated using a standard formula: [P x R x (1+R)^N]/[(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is tenure in months. You can use our sliders to experiment with variables." },
      { id: 6, q: "Can I pre-close my loan early?", a: "Yes, you can pre-close your loan after 6 successful EMI repayments. Standard prepayment terms apply depending on the loan category." }
    ],
    repayment: [
      { id: 7, q: "What happens if I miss an EMI payment date?", a: "A minor late payment fee may apply. We encourage clients to enable Auto-Debit (NACH) to avoid manual repayment delays and keep credit scores healthy." },
      { id: 8, q: "Can I choose my EMI repayment date?", a: "Yes, during document verification, you can align your EMI repayment dates with your salary credit or crop harvest schedule (for agricultural loans)." }
    ]
  };

  return (
    <div className="w-full flex flex-col">
      {/* 2. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center hero-gradient text-white overflow-hidden py-16 px-4 sm:px-8">
        <div className="absolute inset-0 bg-slate-950/20 z-0" />
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text details */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/30 text-secondary text-xs font-bold px-3.5 py-1.5 rounded-full"
            >
              <Award className="w-4 h-4" /> Trusted Banking Partner Since 2015
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-white"
            >
              Empowering Dreams <br/>
              Through <span className="text-secondary">Smart Financial</span> Solutions
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-200 text-base sm:text-lg max-w-xl leading-relaxed"
            >
              Providing affordable loans and investment opportunities to help individuals, families, entrepreneurs, and farmers achieve financial growth.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link 
                to="/apply" 
                className="bg-secondary hover:bg-gold-hover text-primary font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5 duration-300"
              >
                Apply for Loan <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
              <a 
                href="#services" 
                className="bg-transparent border border-slate-300 hover:border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                Explore Services
              </a>
            </motion.div>

            {/* Checkmarks Grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 gap-4 pt-8 border-t border-navy-light/40 max-w-lg"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold text-slate-100">Quick Approval</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold text-slate-100">Low Interest Rates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold text-slate-100">Secure Process</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold text-slate-100">Trusted Microfinance Partner</span>
              </div>
            </motion.div>
          </div>

          {/* Right Banner Image & Floating Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-md aspect-square bg-gradient-to-tr from-primary/30 to-white/10 rounded-3xl border border-white/10 p-2 shadow-2xl overflow-hidden flex items-center justify-center animate-float"
            >
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
              <img 
                src="/logo.png" 
                alt="Logo Concept Backdrop" 
                className="w-2/3 h-2/3 object-contain opacity-80"
              />
              
              {/* Floating Stat Card */}
              <div className="absolute bottom-6 left-6 right-6 glass-card-navy p-4 rounded-2xl flex items-center gap-4 text-left border border-white/20">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">Trust & Security</div>
                  <div className="text-sm font-bold text-white">RBI Registered MFI Partner</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800 text-center">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Key Value Pillars
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary">
              Why Nayak Sairam is Trusted
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              We connect the trust and governance of traditional banking with the agility, speed, and simplicity of modern financial technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Instant Approval', desc: 'Verify documents online and receive approvals within 24-48 hours.', icon: Zap, color: 'bg-amber-500/10 text-amber-500' },
              { title: 'Low Interest Rates', desc: 'Starting from 10.99% p.a., with agricultural and group loans at special subsidised rates.', icon: Coins, color: 'bg-green-500/10 text-green-500' },
              { title: 'Secure Transactions', desc: 'Bank-level cybersecurity protocols, secure vaults for gold, and encrypted databases.', icon: ShieldCheck, color: 'bg-blue-500/10 text-blue-500' },
              { title: 'Flexible Repayment', desc: 'Choose paybacks from 12 to 120 months. Align payments with crop harvests or monthly paychecks.', icon: Clock, color: 'bg-indigo-500/10 text-indigo-500' },
              { title: 'Dedicated Support', desc: '24/7 client helplines, custom WhatsApp query chats, and regional branch assistance.', icon: MessageSquare, color: 'bg-purple-500/10 text-purple-500' },
              { title: 'Financial Inclusion', desc: 'Special loan setups and mentorship groups specifically structured to uplift rural communities.', icon: Users2, color: 'bg-pink-500/10 text-pink-500' }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.06), 0 10px 10px -5px rgba(0,0,0,0.04)' }}
                  className="bg-slate-50 border border-slate-200/60 p-8 rounded-2xl text-left space-y-4 group transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-primary">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. LOAN SERVICES SECTION */}
      <section id="services" className="py-24 px-4 sm:px-8 bg-slate-50 text-slate-800">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div className="space-y-4 text-left max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
                Custom Loan Schemes
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary">
                Tailored Credit Solutions for Every Need
              </h2>
            </div>
            <Link to="/loans" className="text-primary hover:text-secondary font-bold text-sm flex items-center gap-1 group self-start">
              Compare all loan products <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loanTypes.map((loan) => (
              <div 
                key={loan.id} 
                className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-bold">
                      {loan.name[0]}
                    </div>
                    <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                      Starting {loan.interestRate}%
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-primary">{loan.name}</h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">
                      Max: ₹{(loan.maxAmount / 100000).toFixed(1)} Lakhs
                    </p>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                    {loan.description}
                  </p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button 
                    onClick={() => navigate(`/calculator?amount=${loan.maxAmount / 2}&rate=${loan.interestRate}`)}
                    className="text-xs text-slate-500 hover:text-primary font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" /> EMI Cal
                  </button>
                  <Link 
                    to={`/apply?type=${loan.id}`}
                    className="bg-primary hover:bg-navy-dark text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  >
                    Apply Now <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INSTANT PERSONAL LOAN ONLINE (BLOG / INFO STYLE SECTION) */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text / Info details */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Eligibility & Details
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary leading-tight">
              Get an Instant Personal Loan Fully Online
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Applying for an instant loan has never been easier. Learn what is required, view the interest models, and check if you qualify in under 5 minutes.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              {[
                { id: 'apply', label: 'Who Can Apply?' },
                { id: 'docs', label: 'Documents Required' },
                { id: 'rates', label: 'Interest Rates' },
                { id: 'time', label: 'Processing Time' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveInfoTab(tab.id as any)}
                  className={`w-full text-left py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-between border transition-all cursor-pointer ${
                    activeInfoTab === tab.id
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeInfoTab === tab.id ? 'translate-x-1 text-secondary' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Display Board */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-8 rounded-3xl shadow-sm text-left min-h-[350px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {activeInfoTab === 'apply' && (
                <motion.div
                  key="apply"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-4"
                >
                  <h3 className="font-display font-extrabold text-xl text-primary">Applicant Criteria</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    Our credit scoring algorithms assess basic details to welcome a wide bracket of applicants:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { role: 'Salaried Employees', crit: 'Working in Private, Public, or Gov units with min income ₹15,000/mo' },
                      { role: 'Self Employed', crit: 'Shop owners, traders, consultants, and professionals with 2+ yrs tenure' },
                      { role: 'Farmers / Agri Unions', crit: 'Individuals holding agricultural land titles or cooperative members' },
                      { role: 'Women Entrepreneurs', crit: 'Joint Liability Groups (JLG) or self-employed micro artisans' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/60 flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-800">{item.role}</h4>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.crit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeInfoTab === 'docs' && (
                <motion.div
                  key="docs"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-4"
                >
                  <h3 className="font-display font-extrabold text-xl text-primary">Required Documentation</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Keep digital copies of these four basic documents ready for immediate verification checks:
                  </p>
                  <ul className="space-y-3">
                    {[
                      { name: 'Aadhaar Card', desc: 'Proof of Identity and residential address (Base64 file or PDF).' },
                      { name: 'PAN Card', desc: 'Required for tax validation and instant credit score checks.' },
                      { name: 'Bank Statement', desc: 'Salary credit/business account statement for the last 6 months.' },
                      { name: 'Income Proof', desc: 'Latest 3 months salary slips, ITR filings, or agricultural produce receipts.' }
                    ].map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200/50">
                        <span className="w-6 h-6 rounded-full bg-primary/5 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="text-xs text-slate-800">{doc.name}</strong>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{doc.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {activeInfoTab === 'rates' && (
                <motion.div
                  key="rates"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-6"
                >
                  <h3 className="font-display font-extrabold text-xl text-primary">Transparent Interest Structures</h3>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 max-w-md">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-sm font-semibold text-slate-600">Starting Interest Rate</span>
                      <strong className="text-lg font-display text-primary">10.99% <span className="text-xs text-slate-400">p.a.</span></strong>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-sm font-semibold text-slate-600">Agricultural Loans</span>
                      <strong className="text-lg font-display text-green-600">7.99% <span className="text-xs text-slate-400">p.a.</span></strong>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-sm font-semibold text-slate-600">JLG Women Loans</span>
                      <strong className="text-lg font-display text-primary">9.00% <span className="text-xs text-slate-400">p.a.</span></strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-600">Processing Fee</span>
                      <strong className="text-sm font-bold text-slate-700">0% to 2% max</strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    *Rates subject to customer profile score and document verification audits. Zero pre-payment penalties apply on selected schemes.
                  </p>
                </motion.div>
              )}

              {activeInfoTab === 'time' && (
                <motion.div
                  key="time"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-6 text-center py-6"
                >
                  <div className="w-20 h-20 bg-secondary/10 border-2 border-secondary rounded-full flex items-center justify-center mx-auto mb-4 pulse-gold">
                    <Clock className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-primary">24 to 48 Hours Disbursal</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Once documents are successfully submitted online, credit scoring takes less than 2 hours. Funds are wired directly to bank accounts within 1-2 business days.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 6. PROCESS SECTION (HOW IT WORKS) */}
      <section className="py-24 px-4 sm:px-8 bg-slate-50 text-slate-800 text-center">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Workflow Steps
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary">
              How the Loan Process Works
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              We have completely eliminated physical bank queues. Apply and receive cash in four simple steps:
            </p>
          </div>

          {/* Stepper Grid Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {[
              { step: 'Step 1', title: 'Apply Online', desc: 'Fill personal details and upload documents in our secure form wizard.', icon: Landmark },
              { step: 'Step 2', title: 'Verify Documents', desc: 'Our credit auditing teams conduct digital verification and validation checkups.', icon: ShieldCheck },
              { step: 'Step 3', title: 'Loan Approval', desc: 'Credit approval triggers are registered and interest structures are locked.', icon: Check },
              { step: 'Step 4', title: 'Receive Funds', desc: 'The requested amount is securely wired straight to your active bank account.', icon: Coins }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl relative z-10 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary text-secondary font-bold text-xs flex items-center justify-center mx-auto mb-4 border-2 border-secondary shadow-md">
                    <Icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="text-[10px] text-secondary font-extrabold uppercase tracking-widest mb-1">
                    {step.step}
                  </div>
                  <h3 className="font-display font-bold text-base text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. EMI CALCULATOR SECTION */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800 scroll-mt-20" id="emi-calculator">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              EMI Calculator
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary">
              Calculate Your Monthly Installment
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Use our interactive calculators to experiment with Loan Amount, Yearly Interest Rate, and payback Tenure to schedule your budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Sliders Input Panel */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
              
              {/* Slider 1: Loan Amount */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Loan Amount</label>
                  <span className="text-base font-display font-extrabold text-primary">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="2000000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>₹20,000</span>
                  <span>₹20 Lakhs</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Interest Rate (% p.a.)</label>
                  <span className="text-base font-display font-extrabold text-primary">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="7.99"
                  max="25"
                  step="0.05"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>7.99%</span>
                  <span>25%</span>
                </div>
              </div>

              {/* Slider 3: Loan Tenure */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Tenure (Months)</label>
                  <span className="text-base font-display font-extrabold text-primary">
                    {loanTenure} months ({Math.round(loanTenure / 12 * 10) / 10} yrs)
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="84"
                  step="6"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>6 mos</span>
                  <span>84 mos</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-slate-200/60 flex flex-wrap gap-3">
                <button 
                  onClick={() => { setLoanAmount(200000); setInterestRate(10.99); setLoanTenure(36); }}
                  className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:border-primary transition-colors cursor-pointer"
                >
                  Personal Loan Mode
                </button>
                <button 
                  onClick={() => { setLoanAmount(500000); setInterestRate(12.5); setLoanTenure(60); }}
                  className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:border-primary transition-colors cursor-pointer"
                >
                  MSME Loan Mode
                </button>
                <button 
                  onClick={() => { setLoanAmount(150000); setInterestRate(7.99); setLoanTenure(24); }}
                  className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:border-primary transition-colors cursor-pointer"
                >
                  Agri/Harvest Mode
                </button>
              </div>

            </div>

            {/* Calculations Result & Custom SVG Pie Chart */}
            <div className="lg:col-span-5 bg-primary text-white p-8 rounded-3xl shadow-xl flex flex-col items-center justify-between min-h-[400px]">
              
              <div className="w-full text-center space-y-4">
                <span className="text-[10px] font-bold tracking-widest text-secondary uppercase">Estimated Payback</span>
                <div className="space-y-1">
                  <h4 className="text-slate-400 text-xs font-bold uppercase">Monthly Installment (EMI)</h4>
                  <div className="text-4xl font-display font-extrabold text-secondary">
                    ₹{emiOutputs.emi.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Live Drawing SVG Pie Chart */}
              <div className="relative w-40 h-40 my-6 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background track circle representing total payable */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke="#001F42"
                    strokeWidth="12"
                  />
                  {/* Principal Circle segment */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke="#D4AF37"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={principalOffset}
                    className="transition-all duration-500 ease-out"
                  />
                  {/* Interest Circle segment */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke="#0D4A8C"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={interestOffset}
                    className="transition-all duration-500 ease-out"
                    style={{ transformOrigin: 'center', transform: 'rotate(180deg)' }}
                  />
                </svg>
                {/* Center Badge */}
                <div className="absolute text-center">
                  <span className="text-[10px] text-slate-300 font-bold uppercase leading-none block">EMI</span>
                  <span className="text-xs font-bold text-white mt-1 block">Cal</span>
                </div>
              </div>

              {/* Stats Breakdown */}
              <div className="w-full grid grid-cols-2 gap-4 border-t border-navy-light pt-6">
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Principal</span>
                  </div>
                  <div className="text-sm font-extrabold font-display">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-navy-light" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Total Interest</span>
                  </div>
                  <div className="text-sm font-extrabold font-display">
                    ₹{emiOutputs.totalInterest.toLocaleString('en-IN')}
                  </div>
                </div>
                
                <div className="col-span-2 text-center pt-2 border-t border-navy-light/40">
                  <div className="text-[10px] font-semibold text-slate-400">Total Payable Amount</div>
                  <div className="text-base font-extrabold font-display text-secondary mt-0.5">
                    ₹{emiOutputs.totalPayable.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <Link 
                to="/apply"
                className="w-full bg-secondary hover:bg-gold-hover text-primary font-extrabold text-xs py-3 rounded-xl shadow-lg mt-6 text-center transition-colors block"
              >
                Proceed to Apply
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 8. BENEFITS OF INSTANT PERSONAL LOAN */}
      <section className="py-24 px-4 sm:px-8 bg-slate-50 text-slate-800 text-center">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Customer Value Addition
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary">
              Benefits of Personal Loans Online
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: 'Fast Approval', desc: 'Audited in 2 hours' },
              { label: 'Minimal Docs', desc: 'Only 4 KYC papers' },
              { label: 'Flexible Tenure', desc: 'Up to 60 Months' },
              { label: 'Low Rates', desc: 'Starting 10.99%' },
              { label: '100% Digital', desc: 'No paper queues' },
              { label: 'No Hidden Fees', desc: 'Transparent terms' }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-2 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-extrabold text-sm mb-2">
                  ✓
                </div>
                <h3 className="font-bold text-xs text-slate-800">{benefit.label}</h3>
                <span className="text-[10px] text-slate-400 font-medium">{benefit.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SLIDER SECTION */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Client Stories
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary">
              What Our Customers Say
            </h2>
          </div>

          {/* Slider Wrapper */}
          <div className="relative min-h-[220px] flex items-center justify-center px-8">
            <AnimatePresence mode="wait">
              {testimonials.length > 0 && (
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-slate-50 border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-sm text-center space-y-6 max-w-2xl relative"
                >
                  <p className="text-slate-600 text-sm sm:text-base italic leading-relaxed">
                    "{testimonials[currentTestimonial].review}"
                  </p>
                  
                  <div className="flex flex-col items-center gap-2">
                    <img 
                      src={testimonials[currentTestimonial].image} 
                      alt="" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-secondary shadow-sm"
                    />
                    <div>
                      <h4 className="font-display font-bold text-sm text-primary">
                        {testimonials[currentTestimonial].name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {testimonials[currentTestimonial].location}
                      </span>
                    </div>
                    {/* Stars */}
                    <div className="flex gap-0.5 text-secondary">
                      {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            {testimonials.length > 0 && (
              <>
                <button 
                  onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="absolute left-0 p-2 rounded-full bg-slate-100 hover:bg-slate-200 border text-slate-500 cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                  className="absolute right-0 p-2 rounded-full bg-slate-100 hover:bg-slate-200 border text-slate-500 cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <Link to="/testimonials" className="text-xs font-bold text-primary hover:underline block pt-2">
            Read all 6 success testimonials
          </Link>
        </div>
      </section>

      {/* 10. FAQ ACCORDION SECTION */}
      <section className="py-24 px-4 sm:px-8 bg-slate-50 text-slate-800">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              General Queries
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Accordion Categories */}
          <div className="flex justify-center flex-wrap gap-2.5">
            {[
              { id: 'loans', label: 'Loans' },
              { id: 'investments', label: 'Investments' },
              { id: 'emi', label: 'EMI Terms' },
              { id: 'repayment', label: 'Repayments' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveFaqCategory(cat.id as any);
                  setExpandedFaqId(null);
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                  activeFaqCategory === cat.id
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active Category Questions */}
          <div className="space-y-4">
            {faqData[activeFaqCategory].map((faq) => {
              const expanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandedFaqId(expanded ? null : faq.id)}
                    className="w-full text-left p-5 font-bold text-sm text-primary flex justify-between items-center cursor-pointer"
                  >
                    {faq.q}
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180 text-secondary' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 border-t border-slate-100 text-xs text-slate-500 leading-relaxed text-left">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. BRANCH LOCATIONS & GOOGLE MAPS INTEGRATION */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Branch Listings */}
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Our Networks
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary leading-tight">
              Visit Nayak Sairam Offices Near You
            </h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {mockDb.getBranches().map((branch) => (
                <div key={branch.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-display font-bold text-sm text-primary leading-snug">{branch.name}</h4>
                    {branch.isMain && (
                      <span className="bg-secondary/15 text-primary font-bold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded border border-secondary/30">
                        Main
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {branch.address}
                  </p>
                  <div className="text-[10px] text-slate-400 space-y-1">
                    <div>Phone: {branch.phone}</div>
                    <div>Email: {branch.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Google Maps Container */}
          <div className="lg:col-span-7 bg-slate-100 border border-slate-200 rounded-3xl relative overflow-hidden min-h-[350px] shadow-sm flex items-center justify-center p-4">
            {/* Visual Custom Mock Map */}
            <div className="absolute inset-0 bg-[#E5E3DF] p-6 flex flex-col justify-between">
              {/* Map grid lines mock */}
              <div className="absolute inset-0 opacity-15" style={{ 
                backgroundImage: 'radial-gradient(#003366 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />
              
              {/* Floating pins */}
              <div className="absolute top-1/4 left-1/3 text-center animate-bounce">
                <Landmark className="w-8 h-8 text-primary fill-secondary shadow-md" />
                <span className="bg-primary text-white text-[9px] font-bold py-0.5 px-2 rounded-full shadow border border-secondary block mt-1">Chennai Main</span>
              </div>
              <div className="absolute top-1/2 left-2/3 text-center opacity-75">
                <Landmark className="w-6 h-6 text-primary fill-secondary" />
                <span className="bg-primary text-white text-[9px] font-bold py-0.5 px-2 rounded-full shadow block mt-1">Bengaluru</span>
              </div>
              <div className="absolute bottom-1/4 left-1/2 text-center opacity-75">
                <Landmark className="w-6 h-6 text-primary fill-secondary" />
                <span className="bg-primary text-white text-[9px] font-bold py-0.5 px-2 rounded-full shadow block mt-1">Hyderabad</span>
              </div>

              {/* Location disclaimer tag */}
              <div className="mt-auto relative z-10 bg-white/90 backdrop-blur-sm border border-slate-200 p-4 rounded-2xl max-w-sm text-left">
                <h5 className="font-bold text-xs text-primary mb-1">Corporate & Regional Geolocation</h5>
                <p className="text-[10px] text-slate-500 leading-normal">
                  All branches are connected via centralized core banking interfaces. Use contact cards for exact walking coordinates.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 13. CONTACT US SECTION (FORM & DETAILS) */}
      <section className="py-24 px-4 sm:px-8 bg-slate-50 text-slate-800 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Details */}
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Get in Touch
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary leading-tight">
              Have Questions? <br/>Write to Us Instantly
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Our help desk is ready to assist you. Submit an enquiry online, write to us on WhatsApp, or call our corporate lines.
            </p>
            
            <div className="space-y-4 pt-4 border-t border-slate-200/60 max-w-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-400 uppercase">Call Support</h4>
                  <span className="text-sm font-extrabold text-primary">+91 44 2855 9000</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center shadow-md">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-400 uppercase">WhatsApp Chat</h4>
                  <a href="https://wa.me/919840283741" target="_blank" rel="noopener noreferrer" className="text-sm font-extrabold text-green-600 hover:underline">
                    +91 98402 83741
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-md border border-primary/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-400 uppercase">Email Support</h4>
                  <span className="text-sm font-extrabold text-primary">corp.chennai@nayaksairam.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-sm">
            <h3 className="font-display font-extrabold text-xl text-primary mb-6 text-left">Online Enquiry Form</h3>
            
            {formSubmitted ? (
              <div className="p-8 text-center bg-green-50 border border-green-200 rounded-2xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
                  ✓
                </div>
                <h4 className="font-bold text-green-800">Message Submitted!</h4>
                <p className="text-xs text-green-600">
                  Thank you. A representative from Sairam Micro Finance will call you back within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98402XXXXX"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Subject Of Interest</label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Personal Loan Query">Personal Loan Query</option>
                    <option value="MSME Loan Query">MSME Business Loan Query</option>
                    <option value="Gold Loan Query">Gold Loan Query</option>
                    <option value="Investment Plans">Investment Placement Schemes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Message / Inquiry</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you would like to clarify..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-navy-dark text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Send Enquiry <Send className="w-3.5 h-3.5 text-secondary" />
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
      
    </div>
  );
};
