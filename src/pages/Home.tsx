import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDb } from '../services/mockDb';
import type { LoanType } from '../services/mockDb';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, Zap, Coins, Users2, 
  ChevronRight, MessageSquare, Phone, Mail, Award, 
  ChevronLeft, Calculator, Clock, Star, Landmark, ChevronDown, Check, Send,
  User, Briefcase, Sprout
} from 'lucide-react';

interface SolutionCard {
  id: string;
  title: string;
  tagline: string;
  primaryBtn: { text: string; link: string };
  secondaryBtn: { text: string; link: string };
  image: string;
  bgClass: string;
  featured?: boolean;
}

const tabs = [
  { id: 'personal', label: 'Personal' },
  { id: 'business', label: 'Business' },
  { id: 'gold', label: 'Gold' },
  { id: 'education', label: 'Education' },
  { id: 'agricultural', label: 'Agricultural' },
  { id: 'womens-empowerment', label: "Women's" },
  { id: 'emergency', label: 'Emergency' }
];

const solutionsData: SolutionCard[] = [
  {
    id: "personal",
    title: "Instant Personal Loan",
    tagline: "Collateral-free personal loans up to ₹5 Lakhs in just 10 seconds. 100% paperless digital approval and instant account disbursal.",
    primaryBtn: { text: "Apply Online", link: "/apply?type=personal" },
    secondaryBtn: { text: "EMI Calculator", link: "/calculator" },
    image: "/Personal_loan.png",
    bgClass: "bg-[#5CA8FF] text-white border border-[#4fa0ff]",
  },
  {
    id: "business",
    title: "MSME Business Loan",
    tagline: "Grow your enterprise with quick working capital and expansion loans up to ₹25 Lakhs. Flexible repayment tenures and fast processing.",
    primaryBtn: { text: "Apply Online", link: "/apply?type=business" },
    secondaryBtn: { text: "Check Eligibility", link: "/loans" },
    image: "/Business_loan.png",
    bgClass: "bg-[#0D9488] text-white border border-[#23a598]",
    featured: true
  },
  {
    id: "gold",
    title: "Instant Gold Loan",
    tagline: "Unlock the value of your gold with instant cash in just 45 minutes. Safe vault storage, zero processing fees, and rates starting at 8.99% p.a.",
    primaryBtn: { text: "Apply Online", link: "/apply?type=gold" },
    secondaryBtn: { text: "Check Rates", link: "/loans" },
    image: "/Gold_loan.png",
    bgClass: "bg-[#F59E0B] text-white border border-[#d97706]",
  },
  {
    id: "education",
    title: "Higher Education Loan",
    tagline: "Empower your academic dreams with higher education loans. Covers 100% of fees, travel, and accommodation with flexible repayment terms.",
    primaryBtn: { text: "Apply Online", link: "/apply?type=education" },
    secondaryBtn: { text: "EMI Calculator", link: "/calculator" },
    image: "/Educaiton_loan.png",
    bgClass: "bg-[#E8EDF5] text-[#002C54] border border-[#cbd5e1]",
  },
  {
    id: "agricultural",
    title: "Agricultural Farm Loan",
    tagline: "Support your farming needs with low-interest agricultural loans for crops, tractors, and farm machinery. Flexible repayment aligned with crop cycles.",
    primaryBtn: { text: "Apply Online", link: "/apply?type=agricultural" },
    secondaryBtn: { text: "Check Schemes", link: "/loans" },
    image: "/Agriculture_loan.png",
    bgClass: "bg-[#15803D] text-white border border-[#22c55e]",
    featured: true
  },
  {
    id: "womens-empowerment",
    title: "Women Empowerment Loan",
    tagline: "Collateral-free micro loans to empower women entrepreneurs, self-help groups, and rural cottage industries with dedicated skill support.",
    primaryBtn: { text: "Apply Online", link: "/apply?type=womens-empowerment" },
    secondaryBtn: { text: "Success Stories", link: "/about" },
    image: "/Women_loan.png",
    bgClass: "bg-[#FFD6DB] text-[#5C0617] border border-[#ffb3bc]",
  },
  {
    id: "emergency",
    title: "Emergency Liquidity Loan",
    tagline: "Get quick cash in under 4 hours for unexpected medical needs, salary advances, or house repairs. Minimal checks and zero processing fees.",
    primaryBtn: { text: "Apply Online", link: "/apply?type=emergency" },
    secondaryBtn: { text: "Help Center", link: "/about" },
    image: "/Emergency_Loan.png",
    bgClass: "bg-[#1E40AF] text-white border border-[#3b82f6]",
  }
];

const sliderConfigs = {
  personal: {
    amount: { min: 20000, max: 1500000, step: 10000, labelMin: '₹20,000', labelMax: '₹15 Lakhs' },
    rate: { min: 7.99, max: 25.00, step: 0.05, labelMin: '7.99%', labelMax: '25%' },
    tenure: { min: 6, max: 60, step: 6, labelMin: '6 mos', labelMax: '60 mos' }
  },
  msme: {
    amount: { min: 50000, max: 5000000, step: 50000, labelMin: '₹50,000', labelMax: '₹50 Lakhs' },
    rate: { min: 8.99, max: 24.00, step: 0.05, labelMin: '8.99%', labelMax: '24%' },
    tenure: { min: 12, max: 120, step: 12, labelMin: '12 mos', labelMax: '120 mos' }
  },
  agri: {
    amount: { min: 10000, max: 1000000, step: 5000, labelMin: '₹10,000', labelMax: '₹10 Lakhs' },
    rate: { min: 5.99, max: 18.00, step: 0.05, labelMin: '5.99%', labelMax: '18%' },
    tenure: { min: 6, max: 60, step: 6, labelMin: '6 mos', labelMax: '60 mos' }
  }
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  

  
  // Blog / Info Tabs
  const [activeInfoTab, setActiveInfoTab] = useState<'apply' | 'docs' | 'rates' | 'time'>('apply');
  
  // Banking Solutions Carousel State
  const [currentSolutionCard, setCurrentSolutionCard] = useState(7); // 7 points to the first tab (Personal) of the middle set
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isSolutionCarouselHovered, setIsSolutionCarouselHovered] = useState(false);

  // Derived state for the active tab linked to the currently centered card
  const activeSolutionTabIndex = (currentSolutionCard % 7 + 7) % 7;
  const activeSolutionTab = tabs[activeSolutionTabIndex].id;
  
  const [cardWidth, setCardWidth] = useState(740);
  const [cardHeight, setCardHeight] = useState(400);
  const [gap, setGap] = useState(20);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setCardWidth(740);
        setCardHeight(400);
        setGap(20);
      } else if (window.innerWidth >= 1024) {
        setCardWidth(660);
        setCardHeight(360);
        setGap(16);
      } else if (window.innerWidth >= 640) {
        setCardWidth(520);
        setCardHeight(320);
        setGap(12);
      } else {
        setCardWidth(window.innerWidth - 32);
        setCardHeight(300);
        setGap(8);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clean up silent warp transitions
  const handleAnimationComplete = () => {
    if (currentSolutionCard < 7) {
      setShouldAnimate(false);
      const equivalentIndex = ((currentSolutionCard - 7) % 7 + 7) % 7 + 7;
      setCurrentSolutionCard(equivalentIndex);
    } else if (currentSolutionCard > 13) {
      setShouldAnimate(false);
      const equivalentIndex = ((currentSolutionCard - 7) % 7 + 7) % 7 + 7;
      setCurrentSolutionCard(equivalentIndex);
    }
  };

  useEffect(() => {
    if (!shouldAnimate) {
      const raf = requestAnimationFrame(() => {
        setShouldAnimate(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [shouldAnimate]);

  // Solution Carousel Auto-play loop (moves right-to-left, i.e., index increases every 60s)
  useEffect(() => {
    if (isSolutionCarouselHovered) return;
    const timer = setInterval(() => {
      setCurrentSolutionCard(prev => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, [isSolutionCarouselHovered]);
  
  // FAQ State
  const [activeFaqCategory, setActiveFaqCategory] = useState<'loans' | 'investments' | 'emi' | 'repayment'>('loans');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  // EMI Calculator State
  const [calculatorTab, setCalculatorTab] = useState<'personal' | 'msme' | 'agri'>('personal');
  const [loanAmount, setLoanAmount] = useState(200000); // INR
  const [interestRate, setInterestRate] = useState(10.99); // Yearly %
  const [loanTenure, setLoanTenure] = useState(36); // Months
  const [emiOutputs, setEmiOutputs] = useState({ emi: 0, totalInterest: 0, totalPayable: 0 });

  const handleTabChange = (tabId: 'personal' | 'msme' | 'agri') => {
    setCalculatorTab(tabId);
    if (tabId === 'personal') {
      setLoanAmount(200000);
      setInterestRate(10.99);
      setLoanTenure(36);
    } else if (tabId === 'msme') {
      setLoanAmount(500000);
      setInterestRate(12.50);
      setLoanTenure(60);
    } else if (tabId === 'agri') {
      setLoanAmount(150000);
      setInterestRate(7.99);
      setLoanTenure(24);
    }
  };

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('General Enquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setLoanTypes(mockDb.getLoanTypes());
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



  const faqData = {
    loans: [
      { id: 1, q: "What is the maximum loan amount I can apply for?", a: "For personal loans, you can apply for up to ₹5 Lakhs. For MSME business loans, the maximum limit is ₹25 Lakhs, subject to eligibility check and verification." },
      { id: 2, q: "Does Nayak Sairam Micro Finance require collateral for all loans?", a: "No. Our Personal Loans, Women's Empowerment Loans, and Emergency Loans are completely collateral-free. Only MSME Business Loans and Gold Loans require security/collateral." },
      { id: 9, q: "How long does it take for a loan to get approved and disbursed?", a: "Once you submit your enquiry and KYC documents, initial approval takes 24-48 hours. Post final approval, the loan amount is disbursed directly into your bank account within 2 hours." },
      { id: 10, q: "Who is eligible to apply for a Women's Empowerment Loan?", a: "Any woman entrepreneur or self-help group of women aged 18 to 60 running a micro-enterprise or wishing to start a new business is eligible. No prior credit score is required for group-lending setups." }
    ],
    investments: [
      { id: 3, q: "What micro-investment options are available?", a: "We offer fixed deposits and recurring micro-investment schemes starting at just ₹1,000 per month with competitive interest yields. Fill out our Investment Enquiry Form to learn more." },
      { id: 4, q: "Are my investments secure with Nayak Sairam?", a: "Yes. Our operations follow rigid regulatory guidelines, and our security models maintain institutional vault and backup architectures." },
      { id: 11, q: "Can I withdraw my Fixed Deposit investment before maturity?", a: "Yes, premature withdrawal is permitted. The interest rate applicable will be based on the actual tenure the deposit remained with us, subject to a nominal penalty fee of 1%." },
      { id: 12, q: "Do you offer recurring deposit (RD) schemes for small savers?", a: "Yes! Our Recurring Micro-Investment scheme allows you to invest as little as ₹1,000 monthly, helping farmers and micro-business owners build savings systematically." }
    ],
    emi: [
      { id: 5, q: "How is the monthly EMI calculated?", a: "EMI is calculated using a standard formula: [P x R x (1+R)^N]/[(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is tenure in months. You can use our sliders to experiment with variables." },
      { id: 6, q: "Can I pre-close my loan early?", a: "Yes, you can pre-close your loan after 6 successful EMI repayments. Standard prepayment terms apply depending on the loan category." },
      { id: 13, q: "Does the interest rate remain fixed throughout the loan tenure?", a: "Yes, all our personal, business, and agricultural loans come with fixed interest rates. Your monthly EMI remains constant throughout the tenure, protected from market fluctuations." },
      { id: 14, q: "Are there any hidden processing fees added to the EMI?", a: "No, we maintain 100% transparency. Any processing fees or administrative charges are disclosed upfront during document signing and are never added to your calculated EMI." }
    ],
    repayment: [
      { id: 7, q: "What happens if I miss an EMI payment date?", a: "A minor late payment fee may apply. We encourage clients to enable Auto-Debit (NACH) to avoid manual repayment delays and keep credit scores healthy." },
      { id: 8, q: "Can I choose my EMI repayment date?", a: "Yes, during document verification, you can align your EMI repayment dates with your salary credit or crop harvest schedule (for agricultural loans)." },
      { id: 15, q: "What payment modes are accepted for monthly repayments?", a: "We accept NACH Auto-Debit, UPI payments (GPay, PhonePe, Paytm), net banking, debit cards, and cash deposits at any of our local regional branches." },
      { id: 16, q: "Can I make partial prepayments to reduce my principal amount?", a: "Yes! You can make part-payments towards your loan principal after 6 months. This helps reduce either your monthly EMI amount or the remaining tenure of your loan." }
    ]
  };

  const config = sliderConfigs[calculatorTab];
  const loanAmountPercent = Math.max(0, Math.min(100, ((loanAmount - config.amount.min) / (config.amount.max - config.amount.min)) * 100));
  const interestRatePercent = Math.max(0, Math.min(100, ((interestRate - config.rate.min) / (config.rate.max - config.rate.min)) * 100));
  const loanTenurePercent = Math.max(0, Math.min(100, ((loanTenure - config.tenure.min) / (config.tenure.max - config.tenure.min)) * 100));

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

      {/* BANKING SOLUTIONS SECTION */}
      <section className="py-12 sm:py-16 bg-slate-50 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-8 space-y-10">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
              Banking Solutions tailor-made for you
            </h2>
          </div>

          {/* Tabs header */}
          <div className="flex justify-center border-b border-slate-200 overflow-x-auto scrollbar-none max-w-4xl mx-auto">
            <div className="flex space-x-2 sm:space-x-4 md:space-x-6 px-2">
              {tabs.map((tab) => {
                const isActive = activeSolutionTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      const tabIdx = tabs.findIndex(t => t.id === tab.id);
                      setShouldAnimate(true);
                      setCurrentSolutionCard(7 + tabIdx);
                    }}
                    className={`relative py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap focus:outline-none ${
                      isActive ? 'text-primary' : 'text-slate-500 hover:text-primary/80'
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeSolutionTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* HDFC-style Carousel - Outside max-w-7xl to bleed completely edge-to-edge */}
        <div 
          className="relative w-full overflow-hidden py-4"
          onMouseEnter={() => setIsSolutionCarouselHovered(true)}
          onMouseLeave={() => setIsSolutionCarouselHovered(false)}
        >
          {/* Carousel viewport */}
          <div className="flex justify-center items-center relative overflow-hidden" style={{ height: `${cardHeight + 40}px` }}>
            <div className="flex items-center justify-center w-full">
              <motion.div
                className="flex items-center"
                style={{
                  gap: `${gap}px`,
                  width: 'max-content',
                }}
                animate={{
                  x: -(currentSolutionCard - 10) * (cardWidth + gap)
                }}
                transition={shouldAnimate ? { type: 'spring', stiffness: 220, damping: 28 } : { duration: 0 }}
                onAnimationComplete={handleAnimationComplete}
              >
                {[
                  ...solutionsData,
                  ...solutionsData,
                  ...solutionsData
                ].map((card, idx) => {
                  const isCenter = idx === currentSolutionCard;
                  
                  const isBlueCard = card.bgClass.includes('5CA8FF');
                  const isTealCard = card.bgClass.includes('0D9488');
                  const isGoldCard = card.bgClass.includes('F59E0B');
                  const isLightGreyCard = card.bgClass.includes('E8EDF5');
                  const isGreenCard = card.bgClass.includes('15803D');
                  const isPinkCard = card.bgClass.includes('FFD6DB');
                  const isSapphireCard = card.bgClass.includes('1E40AF');
                  const bgStyle = card.bgClass.includes('FFF0F2') ? { backgroundColor: '#FFF0F2' }
                    : card.bgClass.includes('E6F4FF') ? { backgroundColor: '#E6F4FF' }
                    : isBlueCard ? { background: 'linear-gradient(135deg, #5CA8FF 0%, #2E79E6 100%)' }
                    : isTealCard ? { background: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)' }
                    : isGoldCard ? { background: 'linear-gradient(135deg, #FBBF24 0%, #B45309 100%)' }
                    : isLightGreyCard ? { background: 'linear-gradient(135deg, #F3F6FA 0%, #E8EDF5 100%)' }
                    : isGreenCard ? { background: 'linear-gradient(135deg, #4ADE80 0%, #14532D 100%)' }
                    : isPinkCard ? { background: 'linear-gradient(135deg, #FFF5F6 0%, #FFD6DB 100%)' }
                    : isSapphireCard ? { background: 'linear-gradient(135deg, #1D4ED8 0%, #0F172A 100%)' }
                    : { backgroundColor: '#ffffff' };
                  const isCustomCard = isBlueCard || isTealCard || isGoldCard || isLightGreyCard || isGreenCard || isPinkCard || isSapphireCard;
                  const isDarkCustomCard = isBlueCard || isTealCard || isGoldCard || isGreenCard || isSapphireCard;
                  const textColor = card.bgClass.includes('FFF0F2') ? 'text-[#4A1521]'
                    : card.bgClass.includes('E6F4FF') ? 'text-[#002C54]'
                    : isLightGreyCard ? 'text-[#002C54]'
                    : isPinkCard ? 'text-[#5C0617]'
                    : isDarkCustomCard ? 'text-white' : 'text-slate-800';
                  const subTextColor = card.bgClass.includes('FFF0F2') ? 'text-[#7A3545]'
                    : card.bgClass.includes('E6F4FF') ? 'text-[#1a4a7a]'
                    : isBlueCard ? 'text-blue-50'
                    : isTealCard ? 'text-teal-50'
                    : isGoldCard ? 'text-amber-50'
                    : isLightGreyCard ? 'text-slate-600'
                    : isGreenCard ? 'text-green-50'
                    : isPinkCard ? 'text-[#8E243A]'
                    : isSapphireCard ? 'text-blue-100' : 'text-slate-500';

                  return (
                    <motion.div
                      key={`${card.id}-${idx}`}
                      onClick={() => {
                        if (!isCenter) {
                          setCurrentSolutionCard(idx);
                        }
                      }}
                      animate={{
                        scale: isCenter ? 1.0 : 0.9,
                        opacity: isCenter ? 1.0 : 0.55,
                      }}
                      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer select-none transition-shadow duration-300 ${
                        isCenter
                          ? isBlueCard
                            ? 'shadow-[0_25px_60px_rgba(92,168,255,0.35)] border border-blue-300/40'
                            : isTealCard
                            ? 'shadow-[0_25px_60px_rgba(20,184,166,0.35)] border border-teal-300/40'
                            : isGoldCard
                            ? 'shadow-[0_25px_60px_rgba(243,201,79,0.35)] border border-yellow-300/40'
                            : isLightGreyCard
                            ? 'shadow-[0_25px_60px_rgba(0,51,102,0.12)] border border-slate-200/60'
                            : isGreenCard
                            ? 'shadow-[0_25px_60px_rgba(22,163,74,0.35)] border border-green-300/40'
                            : isPinkCard
                            ? 'shadow-[0_25px_60px_rgba(255,182,193,0.35)] border border-pink-200/50'
                            : isSapphireCard
                            ? 'shadow-[0_25px_60px_rgba(30,64,175,0.35)] border border-blue-400/40'
                            : 'shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-slate-200/80'
                          : 'shadow-md border border-slate-200/40 hover:opacity-75'
                      }`}
                      style={{
                        width: cardWidth,
                        height: cardHeight,
                        ...bgStyle,
                        flexShrink: 0,
                      }}
                    >
                      <div className="relative w-full h-full flex items-center px-8 sm:px-12 py-8">
                        {/* Text & CTAs */}
                        <div className="flex flex-col justify-between h-full z-10 max-w-[55%] gap-4 sm:gap-6">
                          <div className={`space-y-2 sm:space-y-3 text-left ${textColor}`}>
                            {card.featured && (
                              <span className={`inline-block text-[9px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 ${
                                isDarkCustomCard
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[#003366]/10 text-[#003366]'
                              }`}>
                                Featured Option
                              </span>
                            )}
                            <h3 className="font-display font-extrabold text-xl sm:text-3xl lg:text-[34px] leading-[1.1] tracking-tight">
                              {card.title}
                            </h3>
                            <p className={`text-xs sm:text-sm lg:text-[15px] leading-relaxed font-medium line-clamp-3 ${subTextColor}`}>
                              {card.tagline}
                            </p>
                          </div>
                          <div className="flex flex-row flex-wrap gap-3 sm:gap-4">
                            <Link
                              to={card.primaryBtn.link}
                              className={
                                isBlueCard
                                  ? "bg-white hover:bg-blue-50 text-[#003366] text-[11px] sm:text-xs md:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                                  : isTealCard
                                  ? "bg-white hover:bg-teal-50 text-[#0F766E] text-[11px] sm:text-xs md:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                                  : isGoldCard
                                  ? "bg-white hover:bg-amber-50 text-[#B45309] text-[11px] sm:text-xs md:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                                  : isGreenCard
                                  ? "bg-white hover:bg-green-50 text-[#166534] text-[11px] sm:text-xs md:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                                  : isSapphireCard
                                  ? "bg-white hover:bg-blue-50 text-[#1E40AF] text-[11px] sm:text-xs md:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                                  : "bg-[#003366] hover:bg-[#002244] text-white text-[11px] sm:text-xs md:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                              }
                            >
                              {card.primaryBtn.text}
                            </Link>
                            <Link
                              to={card.secondaryBtn.link}
                              className={
                                isDarkCustomCard
                                  ? "bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm text-[11px] sm:text-xs md:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-sm hover:shadow transition-all duration-300 whitespace-nowrap"
                                  : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-[11px] sm:text-xs md:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl shadow-sm hover:shadow transition-all duration-300 whitespace-nowrap"
                              }
                            >
                              {card.secondaryBtn.text}
                            </Link>
                          </div>
                        </div>
                        {/* Product/person image */}
                        <img
                          src={card.image}
                          alt={card.title}
                          className={`absolute bottom-0 right-0 w-auto object-contain pointer-events-none z-0 transition-all duration-300 ${
                            isCustomCard ? 'h-[112%] -mr-6 sm:-mr-8' : 'h-[96%]'
                          }`}
                          style={{ maxWidth: isCustomCard ? '56%' : '48%' }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Navigation arrows (Side-by-side, no dots like HDFC reference) */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setCurrentSolutionCard(prev => prev - 1)}
              className="w-10 h-10 rounded-full bg-[#003366] text-white flex items-center justify-center shadow-md hover:bg-[#002244] transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentSolutionCard(prev => prev + 1)}
              className="w-10 h-10 rounded-full bg-[#003366] text-white flex items-center justify-center shadow-md hover:bg-[#002244] transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. INSTANT PERSONAL LOAN ONLINE (BLOG / INFO STYLE SECTION) */}
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
                { id: 'apply', label: 'Eligibility & Documents' },
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
          <div className="lg:col-span-7 flex flex-col justify-center relative min-h-[420px]">
            <AnimatePresence mode="wait">
              {activeInfoTab === 'apply' && (
                <motion.div
                  key="apply"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full h-full"
                >
                  {/* Card 1: Personal Loan Eligibility */}
                  <div className="relative bg-[#F9F7FF] border border-[#EBE5FF] p-6 sm:p-8 rounded-[32px] text-left flex flex-col gap-6 hover:shadow-md transition-all duration-300 overflow-hidden">
                    {/* Floating circular icon container */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.03)] z-10">
                      <div style={{ transform: 'translate(-5px, 5px)' }}>
                        <svg width="34" height="34" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="8" y="4" width="28" height="38" rx="4" fill="#0084FF" />
                          <line x1="14" y1="12" x2="30" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="14" y1="18" x2="30" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="14" y1="24" x2="26" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="14" y1="30" x2="22" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                          <rect x="26" y="24" width="16" height="16" rx="4" fill="#FBBF24" stroke="white" strokeWidth="1.5" />
                          <path d="M30 32L33 35L38 29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-2 pr-12">
                      <h4 className="font-display font-extrabold text-xl text-purple-950 sm:text-2xl">Personal Loan eligibility</h4>
                      <p className="text-xs text-purple-700/80 mt-1.5 leading-relaxed">
                        To qualify for a personal loan with us, please ensure you meet the following criteria
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        "Age from 21 to 60 years",
                        "Both self-employed and salaried individuals can apply",
                        "Minimum net monthly income of Rs. 15,000"
                      ].map((item, idx) => (
                        <div key={idx} className="bg-[#FAF5FF] border border-[#E9D5FF] py-3.5 px-4 rounded-xl flex items-center gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-[#581C87] font-semibold text-[11px] sm:text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] flex-shrink-0" />
                          <span className="leading-normal">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: Documents Required */}
                  <div className="relative bg-[#F4FAF6] border border-[#E1F5E8] p-6 sm:p-8 rounded-[32px] text-left flex flex-col gap-6 hover:shadow-md transition-all duration-300 overflow-hidden">
                    {/* Floating circular icon container */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.03)] z-10">
                      <div style={{ transform: 'translate(-5px, 5px)' }}>
                        <svg width="34" height="34" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12C6 9.79086 7.79086 8 10 8H18L22 12H40C42.2091 12 44 13.7909 44 16V38C44 40.2091 42.2091 42 40 42H10C7.79086 42 6 40.2091 6 38V12Z" fill="#D97706" />
                          <rect x="12" y="14" width="24" height="24" rx="2" fill="#0084FF" />
                          <line x1="16" y1="20" x2="32" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                          <line x1="16" y1="26" x2="32" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
                          <line x1="16" y1="32" x2="26" y2="32" stroke="white" stroke-width="2" stroke-linecap="round" />
                          <path d="M6 18C6 15.7909 7.79086 14 10 14H40C42.2091 14 44 15.7909 44 18V38C44 40.2091 42.2091 42 40 42H10C7.79086 42 6 40.2091 6 38V18Z" fill="#FBBF24" />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-2 pr-12">
                      <h4 className="font-display font-extrabold text-xl text-emerald-950 sm:text-2xl">Documents required</h4>
                      <p className="text-xs text-emerald-700/80 mt-1.5 leading-relaxed">
                        When you apply for a personal loan, you will need to provide the following documents
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        "PAN Card",
                        "Last three month's bank statements",
                        "Aadhaar Card"
                      ].map((item, idx) => (
                        <div key={idx} className="bg-[#F0FDF4] border border-[#BBF7D0] py-3.5 px-4 rounded-xl flex items-center gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-[#14532D] font-semibold text-[11px] sm:text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                          <span className="leading-normal">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeInfoTab === 'rates' && (
                <motion.div
                  key="rates"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full h-full"
                >
                  <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[32px] shadow-[0_4px_35px_rgba(0,0,0,0.02)] text-left w-full h-full flex flex-col justify-between hover:shadow-md transition-all duration-300">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#003366] bg-[#003366]/5 px-3 py-1 rounded-full">
                          Rates & Costs
                        </span>
                        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#003366] leading-tight">
                          Transparent Interest Rates
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                          Our interest rates are completely transparent with no hidden commissions:
                        </p>
                      </div>

                      <div className="space-y-3 pt-1">
                        {[
                          { label: "Standard Personal Rate", val: "From 10.99% p.a." },
                          { label: "Subsidised Agricultural Rate", val: "7.99% p.a." },
                          { label: "JLG Women Loans Rate", val: "9.00% p.a." },
                          { label: "Processing & Setup Fee", val: "0% – 2% Max" }
                        ].map((item, idx) => (
                          <div key={idx} className="bg-slate-50/50 py-3.5 px-4 rounded-xl border border-slate-100 flex items-center justify-between gap-3 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:border-amber-100 transition-all duration-200">
                            <span className="text-xs sm:text-sm font-semibold text-slate-700">{item.label}</span>
                            <strong className="text-xs sm:text-sm font-bold text-amber-600">{item.val}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeInfoTab === 'time' && (
                <motion.div
                  key="time"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full h-full"
                >
                  <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[32px] shadow-[0_4px_35px_rgba(0,0,0,0.02)] text-left w-full h-full flex flex-col justify-between hover:shadow-md transition-all duration-300">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#003366] bg-[#003366]/5 px-3 py-1 rounded-full">
                          Timeline
                        </span>
                        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#003366] leading-tight">
                          Processing & Disbursal
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                          Quick disbursal pipeline designed to get you the funds when you need them:
                        </p>
                      </div>

                      <div className="space-y-3 pt-1">
                        {[
                          { label: "Application Time", val: "Under 5 Mins" },
                          { label: "Verification Check", val: "Less Than 2 Hours" },
                          { label: "Fund Transfer Disbursal", val: "24 – 48 Hours" },
                          { label: "Status Notifications", val: "Real-time updates on WhatsApp" }
                        ].map((item, idx) => (
                          <div key={idx} className="bg-slate-50/50 py-3.5 px-4 rounded-xl border border-slate-100 flex items-center justify-between gap-3 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:border-sky-100 transition-all duration-200">
                            <span className="text-xs sm:text-sm font-semibold text-slate-700">{item.label}</span>
                            <strong className="text-xs sm:text-sm font-bold text-sky-600">{item.val}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
              { step: 'Step 1', title: 'Apply Online', desc: 'Fill personal details and upload documents in our secure form wizard.', icon: Landmark, color: 'bg-blue-500/10 text-blue-500' },
              { step: 'Step 2', title: 'Verify Documents', desc: 'Our credit auditing teams conduct digital verification and validation checkups.', icon: ShieldCheck, color: 'bg-purple-500/10 text-purple-500' },
              { step: 'Step 3', title: 'Loan Approval', desc: 'Credit approval triggers are registered and interest structures are locked.', icon: Check, color: 'bg-emerald-500/10 text-emerald-500' },
              { step: 'Step 4', title: 'Receive Funds', desc: 'The requested amount is securely wired straight to your active bank account.', icon: Coins, color: 'bg-amber-500/10 text-amber-500' }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200/60 p-6 rounded-2xl relative z-10 hover:shadow-lg transition-shadow duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${step.color} hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
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
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              EMI Calculator
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary">
              Calculate Your Monthly Installment
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Flexible EMIs to address your needs. Use our interactive calculator to experiment with options.
            </p>
          </div>

          {/* Calculator Categories Horizontal Tab Bar */}
          <div className="border-b border-slate-200 w-full overflow-x-auto no-scrollbar flex justify-start lg:justify-center">
            <div className="flex gap-8 px-4 pb-0.5 min-w-max">
              {[
                { id: 'personal', label: 'Personal Loan', icon: User, color: 'text-[#E11D48]' },
                { id: 'msme', label: 'MSME Loan', icon: Briefcase, color: 'text-[#E11D48]' },
                { id: 'agri', label: 'Agri/Harvest Mode', icon: Sprout, color: 'text-slate-400' }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = calculatorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    className={`flex items-center gap-2.5 py-4 px-1 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'border-primary text-primary font-bold' 
                        : 'border-transparent text-slate-500 hover:text-primary hover:border-slate-300'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#E11D48]' : tab.color}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Sliders Input Panel */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
              
              {/* Slider 1: Loan Amount / Deposit Amount */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">
                    Loan Amount
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
                    <input 
                      type="number"
                      value={loanAmount || ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setLoanAmount(Math.min(config.amount.max * 1.5, val));
                      }}
                      className="bg-white border border-slate-200 rounded-lg py-1 px-3 pl-6 text-xs sm:text-sm text-primary font-bold focus:outline-none focus:border-primary/50 w-28 sm:w-32 text-right transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-primary/5"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={config.amount.min}
                  max={config.amount.max}
                  step={config.amount.step}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full custom-slider bg-[#E2E8F0] cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #003366 0%, #003366 ${loanAmountPercent}%, #E2E8F0 ${loanAmountPercent}%, #E2E8F0 100%)`
                  }}
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>{config.amount.labelMin}</span>
                  <span>{config.amount.labelMax}</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Interest Rate (% p.a.)</label>
                  <div className="relative flex items-center">
                    <input 
                      type="number"
                      step="0.01"
                      value={interestRate || ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setInterestRate(Math.min(config.rate.max * 1.5, val));
                      }}
                      className="bg-white border border-slate-200 rounded-lg py-1 px-3 pr-6 text-xs sm:text-sm text-primary font-bold focus:outline-none focus:border-primary/50 w-20 sm:w-24 text-right transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-primary/5"
                    />
                    <span className="absolute right-2.5 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={config.rate.min}
                  max={config.rate.max}
                  step={config.rate.step}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full custom-slider bg-[#E2E8F0] cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #003366 0%, #003366 ${interestRatePercent}%, #E2E8F0 ${interestRatePercent}%, #E2E8F0 100%)`
                  }}
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>{config.rate.labelMin}</span>
                  <span>{config.rate.labelMax}</span>
                </div>
              </div>

              {/* Slider 3: Loan Tenure */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">
                    Tenure (Months)
                    {loanTenure > 0 && (
                      <span className="text-[11px] font-normal text-slate-400 ml-1">
                        ({Math.round(loanTenure / 12 * 10) / 10} yrs)
                      </span>
                    )}
                  </label>
                  <div className="relative flex items-center">
                    <input 
                      type="number"
                      value={loanTenure || ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setLoanTenure(Math.min(config.tenure.max * 1.5, val));
                      }}
                      className="bg-white border border-slate-200 rounded-lg py-1 px-3 pr-8 text-xs sm:text-sm text-primary font-bold focus:outline-none focus:border-primary/50 w-20 sm:w-24 text-right transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-primary/5"
                    />
                    <span className="absolute right-2 text-xs font-bold text-slate-400">mos</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={config.tenure.min}
                  max={config.tenure.max}
                  step={config.tenure.step}
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full custom-slider bg-[#E2E8F0] cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #003366 0%, #003366 ${loanTenurePercent}%, #E2E8F0 ${loanTenurePercent}%, #E2E8F0 100%)`
                  }}
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>{config.tenure.labelMin}</span>
                  <span>{config.tenure.labelMax}</span>
                </div>
              </div>

              {/* Helper Tip Content (Replacing old Quick Action Buttons) */}
              <div className="pt-5 border-t border-slate-200/60 flex items-start gap-2.5 text-left">
                <span className="bg-primary/5 text-primary p-1.5 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-700 block">Illustrative Repayment T&C</span>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-wide">
                    Figures are indicative. Interest rates and tenures depend on custom verification and credit rating protocols.
                  </p>
                </div>
              </div>

            </div>

            {/* Calculations Result Panel */}
            <div className="lg:col-span-5 bg-gradient-to-br from-white to-[#F3F8FF] border border-blue-100/70 p-6 sm:p-8 rounded-[32px] shadow-[0_4px_30px_rgba(0,51,102,0.015)] flex flex-col justify-between min-h-[400px] text-left relative overflow-hidden">
              
              {/* EMI Banner (Top Box) */}
              <div className="bg-gradient-to-r from-[#DCEEFE]/70 to-[#EBF5FF]/50 border border-blue-100/50 p-6 rounded-2xl text-center space-y-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]">
                <span className="block text-xs sm:text-sm font-semibold text-[#003366]/80">
                  Your Monthly EMI will be
                </span>
                <div className="text-3xl sm:text-4xl font-display font-black text-primary tracking-tight">
                  ₹ {emiOutputs.emi.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Rows Breakdown (Middle) */}
              <div className="space-y-4 py-6">
                {[
                  { label: "Amount Payable", val: `₹ ${emiOutputs.totalPayable.toLocaleString('en-IN')}`, dot: "bg-emerald-500" },
                  { label: "Interest Amount", val: `₹ ${emiOutputs.totalInterest.toLocaleString('en-IN')}`, dot: "bg-amber-500" },
                  { label: "Principal Amount", val: `₹ ${loanAmount.toLocaleString('en-IN')}`, dot: "bg-blue-500" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
                      <span className="text-xs sm:text-sm font-semibold text-slate-500">{item.label}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 font-display">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons (Bottom) */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Link 
                  to="/apply"
                  className="flex-1 bg-primary hover:bg-navy-dark text-white font-bold text-xs py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Apply Now <ChevronRight className="w-3.5 h-3.5 text-secondary" />
                </Link>
                <Link 
                  to="/loans"
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Know More <ChevronRight className="w-3.5 h-3.5 text-[#E11D48]" />
                </Link>
              </div>

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
              { label: 'Fast Approval', desc: 'Audited in 2 hours', image: '/benefit_approval_new.png' },
              { label: 'Minimal Docs', desc: 'Only 4 KYC papers', image: '/benefit_docs_new.png' },
              { label: 'Flexible Tenure', desc: 'Up to 60 Months', image: '/benefit_tenure_new.png' },
              { label: 'Low Rates', desc: 'Starting 10.99%', image: '/benefit_rates_new.png' },
              { label: '100% Digital', desc: 'No paper queues', image: '/benefit_digital_new.png' },
              { label: 'No Hidden Fees', desc: 'Transparent terms', image: '/benefit_no_fees_new.png' }
            ].map((benefit, idx) => (
              <div 
                key={idx} 
                className="group bg-white border border-slate-200/80 p-6 sm:p-8 rounded-[32px] flex flex-col justify-center items-center text-center space-y-4 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1.5 hover:ring-1 hover:ring-primary/10 transition-all duration-300"
              >
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white ring-4 ring-primary/10 shadow-lg mb-2 flex items-center justify-center bg-slate-50 shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <img src={benefit.image} alt={benefit.label} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">{benefit.label}</h3>
                <span className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">{benefit.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION (WAVE DESIGN) */}
      <section className="pt-10 pb-24 px-4 sm:px-8 bg-white text-slate-800 relative overflow-hidden text-center">
        {/* Soft blue curved background wave */}
        <div className="absolute top-0 left-0 right-0 h-[380px] md:h-[460px] z-0 overflow-hidden pointer-events-none">
          <svg 
            viewBox="0 0 1440 320" 
            className="w-full h-full" 
            preserveAspectRatio="none"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M0,0 L1440,0 L1440,120 C1080,300 360,300 0,120 Z" 
              fill="#E0F2FE" 
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Client Stories
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary">
              What Our Customers Say
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto font-semibold">
              Real feedback from microfinance customers, farmers, and entrepreneurs who grew with us.
            </p>
          </div>

          {/* 4 columns layout with individually adjusted containers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-8 pb-16 lg:pb-24 px-4 -mt-20 lg:-mt-28">
            
            {/* Column 1: Ramesh K. Kumar */}
            <div className="flex flex-col items-center text-center space-y-4 group transition-all duration-300 lg:translate-y-8 lg:-translate-x-30">
              {/* Circular Avatar */}
              <div className="w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-50 shrink-0 transform hover:scale-105 transition-transform duration-300">
                <img src="/testimonial_ramesh.png" alt="Ramesh K. Kumar" className="w-full h-full object-cover" />
              </div>
              
              {/* Testimonial Quote */}
              <p className="text-slate-700 font-semibold text-xs sm:text-sm italic leading-relaxed max-w-[240px] px-2">
                "Bought a modern tractor with a crop-cycle repayment schedule that is extremely farmer-friendly!"
              </p>

              {/* Client Info */}
              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-sm text-primary tracking-tight">Ramesh K. Kumar</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Coimbatore, TN
                </span>
                {/* Stars */}
                <div className="flex justify-center gap-0.5 text-secondary pt-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
              </div>
            </div>

            {/* Column 2: Priyanka Sen */}
            <div className="flex flex-col items-center text-center space-y-4 group transition-all duration-300 lg:translate-y-25 lg:-translate-x-15">
              {/* Circular Avatar */}
              <div className="w-44 h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-50 shrink-0 transform hover:scale-105 transition-transform duration-300">
                <img src="/testimonial_priyanka.png" alt="Priyanka Sen" className="w-full h-full object-cover" />
              </div>
              
              {/* Testimonial Quote */}
              <p className="text-slate-700 font-semibold text-xs sm:text-sm italic leading-relaxed max-w-[240px] px-2">
                "Sairam's Women Empowerment program trusted my vision and funded my boutique in just 3 days!"
              </p>

              {/* Client Info */}
              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-sm text-primary tracking-tight">Priyanka Sen</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Bengaluru, KA
                </span>
                {/* Stars */}
                <div className="flex justify-center gap-0.5 text-secondary pt-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
              </div>
            </div>

            {/* Column 3: Arun Deshmukh */}
            <div className="flex flex-col items-center text-center space-y-4 group transition-all duration-300 lg:translate-y-24 lg:translate-x-15">
              {/* Circular Avatar */}
              <div className="w-44 h-44 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-50 shrink-0 transform hover:scale-105 transition-transform duration-300">
                <img src="/testimonial_arun.png" alt="Arun Deshmukh" className="w-full h-full object-cover" />
              </div>
              
              {/* Testimonial Quote */}
              <p className="text-slate-700 font-semibold text-xs sm:text-sm italic leading-relaxed max-w-[240px] px-2">
                "Expanded my grocery store with a digital business loan that was smooth and transparent! Highly recommended partner."
              </p>

              {/* Client Info */}
              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-sm text-primary tracking-tight">Arun Deshmukh</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Hyderabad, TS
                </span>
                {/* Stars */}
                <div className="flex justify-center gap-0.5 text-secondary pt-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
              </div>
            </div>

            {/* Column 4: Meenakshi Iyer */}
            <div className="flex flex-col items-center text-center space-y-4 group transition-all duration-300 lg:translate-y-8 lg:translate-x-30">
              {/* Circular Avatar */}
              <div className="w-36 h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-50 shrink-0 transform hover:scale-105 transition-transform duration-300">
                <img src="/testimonial_meenakshi.png" alt="Meenakshi Iyer" className="w-full h-full object-cover" />
              </div>
              
              {/* Testimonial Quote */}
              <p className="text-slate-700 font-semibold text-xs sm:text-sm italic leading-relaxed max-w-[240px] px-2">
                "Got an instant gold loan with low rates and absolute vault security for my ornaments! It gave me peace of mind."
              </p>

              {/* Client Info */}
              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-sm text-primary tracking-tight">Meenakshi Iyer</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Chennai, TN
                </span>
                {/* Stars */}
                <div className="flex justify-center gap-0.5 text-secondary pt-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
              </div>
            </div>

          </div>

          <div className="pt-10 flex justify-center">
            <Link 
              to="/testimonials" 
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-50 hover:bg-primary border border-slate-200 hover:border-primary text-slate-700 hover:text-white font-display font-extrabold text-sm tracking-tight transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group cursor-pointer"
            >
              <span>Read all</span>
              <ArrowRight className="w-4 h-4 text-primary group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </div>
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

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 px-4 sm:px-8 bg-slate-50 text-slate-800 text-center">
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

      {/* 5. LOAN SERVICES SECTION */}
      <section id="services" className="py-24 px-4 sm:px-8 bg-white border-y border-slate-200/50 text-slate-800">
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
      
    </div>
  );
};
