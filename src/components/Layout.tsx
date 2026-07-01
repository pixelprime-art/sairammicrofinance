import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { X, Send } from 'lucide-react';

// ─── Typewriter ────────────────────────────────────────────────────────────────
const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    let isDeleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const type = () => {
      if (!isDeleting && i <= text.length) {
        setDisplayText(text.substring(0, i));
        i++;
        timer = setTimeout(type, 100);
      } else if (isDeleting && i >= 0) {
        setDisplayText(text.substring(0, i));
        i--;
        timer = setTimeout(type, 50);
      } else {
        isDeleting = !isDeleting;
        timer = setTimeout(type, isDeleting ? 2000 : 500);
      }
    };

    timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div
      className={`transition-all duration-200 ease-in-out flex items-center justify-center overflow-hidden
        ${displayText.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
        bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md text-[10px] font-bold text-primary border border-slate-200 h-[26px] whitespace-nowrap`}
    >
      <span>{displayText}<span className="animate-pulse">|</span></span>
    </div>
  );
};

// ─── Bot logic ─────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  from: 'user' | 'bot';
  text: string;
}

const QA: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['hello', 'hey'],
    answer: "Hello! 👋 Welcome to Sairam Microfinance. How can I assist you today?",
  },
  {
    keywords: ['hi'],
    answer: "Hi there! 👋 How can I help you today?",
  },
  {
    keywords: ['what services', 'services do you offer', 'services offer', 'what do you offer'],
    answer: "We offer a range of financial services including:\n• Personal Loans\n• Business Loans\n• Gold Loans\n• Group Loans\n• Loan Against Property\n• EMI Payment Support\n• Financial Guidance",
  },
  {
    keywords: ['apply for a loan', 'how to apply', 'apply loan', 'application process','process','loan process'],
    answer: "Applying is simple:\n1. Fill out the online application form.\n2. Upload the required documents.\n3. Our team will verify your details.\n4. After approval, the loan amount will be disbursed.",
  },
  {
    keywords: ['documents required', 'what documents', 'kyc documents', 'papers needed','what are the documents required','document'],
    answer: "Generally, you'll need:\n• Aadhaar Card\n• PAN Card\n• Passport-size Photo\n• Address Proof\n• Income Proof\n• Bank Statement\n• Salary Slip (if applicable)\n\nAdditional documents may be requested based on the loan type.",
  },
  {
    keywords: ['eligible', 'eligibility', 'who can apply', 'qualify'],
    answer: "Eligibility generally includes:\n• Age between 21–60 years\n• Valid identity proof\n• Stable income\n• Good repayment history\n• Indian resident",
  },
  {
    keywords: ['minimum loan', 'min loan', 'smallest loan', 'least amount'],
    answer: "The minimum loan amount depends on the loan product. Please contact our team for the latest details.",
  },
  {
    keywords: ['maximum loan', 'max loan', 'highest loan', 'maximum amount'],
    answer: "The maximum loan amount is determined based on your income, repayment capacity, and eligibility.",
  },
  {
    keywords: ['interest rate', 'rate of interest', 'roi', 'interest'],
    answer: "Interest rates vary depending on the loan type, applicant profile, and repayment period. Contact our loan officer for the latest rates.",
  },
  {
    keywords: ['how long', 'approval time', 'how many days', 'processing time'],
    answer: "Most loan applications are reviewed within 24–72 working hours after all required documents are submitted.",
  },
  {
    keywords: ['disbursed', 'disbursal', 'how do i get the money', 'loan transferred'],
    answer: "After approval, the loan amount is transferred directly to your registered bank account.",
  },
  {
    keywords: ['apply online', 'online application', 'can i apply online'],
    answer: "Yes! You can apply online anytime through our website or contact our support team for assistance.",
  },
  {
    keywords: ['loan status', 'check status', 'track application', 'application status'],
    answer: "Provide your application number or registered mobile number, and our support team will help you track your application.",
  },
  {
    keywords: ['repay early', 'prepayment', 'foreclose', 'early repayment', 'part payment'],
    answer: "Yes! Prepayment options are available. Charges, if any, depend on your loan agreement.",
  },
  {
    keywords: ['pay emi', 'how to pay emi', 'payment method', 'pay my emi'],
    answer: "EMIs can be paid through:\n• UPI\n• Net Banking\n• Bank Transfer\n• Auto Debit\n• Cash at Branch",
  },
  {
    keywords: ['miss emi', 'missed emi', 'missed payment', 'late payment', 'skip emi'],
    answer: "Missing an EMI may result in late payment charges and may affect your credit history. We recommend contacting us immediately if you face repayment difficulties.",
  },
  {
    keywords: ['change emi date', 'emi date', 'reschedule emi'],
    answer: "In certain cases, EMI dates may be changed based on company policy. Please contact customer support.",
  },
  {
    keywords: ['calculate emi', 'emi calculator', 'emi calculation'],
    answer: "You can use our EMI Calculator by entering:\n• Loan Amount\n• Interest Rate\n• Loan Tenure\n\nThe calculator instantly displays your monthly EMI.",
  },
  {
    keywords: ['processing fee', 'fees', 'charges', 'any fee'],
    answer: "Processing fees vary depending on the loan type. Our team will provide complete fee details before loan approval.",
  },
  {
    keywords: ['business loan', 'business finance', 'entrepreneur loan'],
    answer: "Yes! We provide business loans for entrepreneurs, self-employed individuals, and small business owners.",
  },
  {
    keywords: ['women entrepreneur', 'women loan', 'ladies loan', 'self help group', 'shg'],
    answer: "Yes! We offer special financial solutions designed to support women entrepreneurs and self-help groups.",
  },
  {
    keywords: ['self employed', 'self-employed', 'freelancer', 'own business'],
    answer: "Yes! Self-employed individuals can apply by submitting the required business and income documents.",
  },
  {
    keywords: ['agricultural loan', 'agri loan', 'farmer loan', 'farming'],
    answer: "Yes, agricultural financing may be available depending on the location and eligibility.",
  },
  {
    keywords: ['contact', 'reach you', 'customer support', 'helpline', 'phone', 'email', 'whatsapp'],
    answer: "You can contact us through:\n• Phone\n• Email\n• WhatsApp\n• Visit our nearest branch",
  },
  {
    keywords: ['office hours', 'working hours', 'timing', 'open hours'],
    answer: "Our office hours are:\nMonday – Saturday\n9:30 AM – 6:00 PM",
  },
  {
    keywords: ['branch', 'location', 'address', 'nearest branch', 'office location'],
    answer: "We have branches across different locations. Visit the Branches page on our website or ask us for the nearest branch.",
  },
  {
    keywords: ['information secure', 'data safe', 'privacy', 'secure', 'data protection'],
    answer: "Yes! We use secure technology to protect your personal and financial information.",
  },
  {
    keywords: ['update mobile', 'change mobile number', 'mobile number update'],
    answer: "Yes! Visit your nearest branch or contact customer support with valid identity proof.",
  },
  {
    keywords: ['update bank', 'change bank account', 'bank account update'],
    answer: "Yes! Submit a written request along with supporting documents to update your bank account.",
  },
  {
    keywords: ['credit score', 'cibil', 'credit history', 'credit check'],
    answer: "Depending on the loan type, your credit history may be considered during the approval process.",
  },
  {
    keywords: ['without income proof', 'no income proof', 'no salary slip'],
    answer: "Some loan products may have alternative eligibility criteria. Contact our loan officer for guidance.",
  },
  {
    keywords: ['close loan', 'loan closure', 'close my loan', 'pay off loan'],
    answer: "After repaying the outstanding balance, you can request a Loan Closure Certificate from our branch.",
  },
  {
    keywords: ['closure certificate', 'noc', 'no objection certificate'],
    answer: "A Loan Closure Certificate is an official document confirming that your loan has been fully repaid and closed.",
  },
  {
    keywords: ['another loan', 'second loan', 'two loans', 'multiple loans'],
    answer: "Yes, subject to eligibility, repayment history, and company policy.",
  },
  {
    keywords: ['loan tenure', 'tenure', 'repayment period', 'loan duration'],
    answer: "Loan tenure is the repayment period selected for your loan, which may range from a few months to several years depending on the loan type.",
  },
  {
    keywords: ['doorstep', 'home service', 'door step'],
    answer: "Doorstep services may be available in selected locations. Please contact your nearest branch.",
  },
  {
    keywords: ['cancel application', 'withdraw application', 'cancel loan'],
    answer: "Yes! Loan applications can usually be cancelled before disbursement. Please contact customer support.",
  },
  {
    keywords: ['kyc', 'know your customer'],
    answer: "KYC (Know Your Customer) is the process of verifying your identity using documents such as Aadhaar, PAN, and address proof.",
  },
  {
    keywords: ['aadhaar', 'aadhar', 'aadhaar mandatory'],
    answer: "Aadhaar is generally required for identity verification, subject to applicable regulations.",
  },
  {
    keywords: ['small business', 'micro enterprise', 'msme', 'sme'],
    answer: "Yes! We support micro, small, and medium enterprises with suitable loan products.",
  },
  {
    keywords: ['speak to loan officer', 'loan officer', 'meet officer', 'callback'],
    answer: "You can request a callback or visit your nearest branch to meet a loan officer.",
  },
  {
    keywords: ['track emi', 'emi history', 'payment history', 'track payment'],
    answer: "Yes! You can request your payment history from our support team.",
  },
  {
    keywords: ['rejected', 'application rejected', 'loan rejected', 'not approved'],
    answer: "If your application is not approved, our team will explain the reason where possible. You may reapply after improving your eligibility.",
  },
  {
    keywords: ['hidden fee', 'hidden charges', 'extra charges', 'transparent'],
    answer: "No! We maintain transparent pricing and explain all applicable charges before loan approval.",
  },
  {
    keywords: ['submit documents', 'upload documents', 'how to submit'],
    answer: "Documents can be submitted:\n• Online\n• At your nearest branch\n• Through our authorized representative (where available)",
  },
  {
    keywords: ['payment method', 'payment modes', 'accepted payments', 'how to pay','payment'],
    answer: "We accept:\n• UPI\n• NEFT/RTGS\n• Net Banking\n• Cash (at branches)\n• Auto Debit",
  },
  {
    keywords: ['weekend', 'apply saturday', 'apply sunday', 'apply anytime'],
    answer: "Yes! Online applications are accepted 24/7.",
  },
  {
    keywords: ['local language', 'regional language', 'tamil', 'telugu', 'kannada', 'hindi'],
    answer: "Yes! Our customer support team is available in multiple regional languages, depending on the branch and location.",
  },
  {
    keywords: ['forgot application', 'application number', 'lost application number'],
    answer: "Contact customer support using your registered mobile number, and we will help retrieve your application details.",
  },
  {
    keywords: ['gold loan', 'gold'],
    answer: "Our Gold Loans offer instant disbursal with low interest rates and full vault security for your ornaments. Visit our nearest branch with your gold to get started.",
  },
  {
    keywords: ['emi', 'repay', 'instalment'],
    answer: "Our EMI plans are flexible — you can choose repayment tenures from 6 to 60 months. Would you like to know more?",
  },
  {
    keywords: ['invest', 'deposit', 'fd', 'fixed deposit'],
    answer: "We offer attractive investment & deposit schemes with high returns and complete safety. Contact us to know current rates.",
  },
  {
    keywords: ['loan'],
    answer: "We offer Personal Loans, Business Loans, Gold Loans, Group Loans, and Loan Against Property. Which type would you like to know more about?",
  },
];

function getBotReply(input: string): string {
  const text = input.toLowerCase();
  for (const qa of QA) {
    if (qa.keywords.some(kw => text.includes(kw))) {
      return qa.answer;
    }
  }
  return "I'm here to help! You can ask me about our loans, EMI plans, gold loans, eligibility, documents, branch locations, or contact details.";
}

// ─── Chat popup ────────────────────────────────────────────────────────────────
const ChatPopup = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: 'bot', text: "Hi! 👋 I'm the Sairam Microfinance virtual assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now(), from: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, from: 'bot', text: getBotReply(trimmed) };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, 1000 + Math.random() * 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.92 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-[340px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
      style={{ maxHeight: '520px' }}
    >
      {/* Header */}
      <div className="bg-primary px-5 py-4 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
          <img src="/chatbot.png" alt="Bot" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight">Sairam Assistant</p>
          <p className="text-white/60 text-[10px] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
            Online
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.from === 'bot' && (
              <div className="w-6 h-6 rounded-full overflow-hidden mr-2 shrink-0 self-end">
                <img src="/chatbot.png" alt="Bot" className="w-full h-full object-cover" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed shadow-sm ${
                msg.from === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm'
              }`}
            >
              {msg.text.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
              <img src="/chatbot.png" alt="Bot" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-[12px] text-slate-700 outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-slate-400"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-8 h-8 rounded-full bg-primary hover:bg-primary/80 disabled:opacity-40 flex items-center justify-center transition-all cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Layout ────────────────────────────────────────────────────────────────────
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="grow"
      >
        {children}
      </motion.main>
      <Footer />

      {/* Floating Chatbot */}
      <div className="fixed bottom-4 right-6 z-50 flex flex-col items-end gap-2">

        {/* Chat Popup */}
        <AnimatePresence>
          {chatOpen && <ChatPopup onClose={() => setChatOpen(false)} />}
        </AnimatePresence>

        {/* Bot button */}
        <button
          onClick={() => setChatOpen(prev => !prev)}
          className="w-20 h-20 bg-transparent rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
          aria-label="Open Chat"
        >
          <img src="/chatbot.png" alt="Chatbot" className="w-full h-full object-cover" loading="lazy" />
        </button>

        {/* Typewriter bubble (hide when chat is open) */}
        {!chatOpen && <TypewriterText text="Hi, May I assist you?" />}
      </div>
    </div>
  );
};
