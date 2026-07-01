import React, { useState } from 'react';
import { mockDb } from '../services/mockDb';
import { 
  Phone, Mail, MessageSquare, Landmark, ChevronDown, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Contact: React.FC = () => {
  // Contact Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ states
  const [faqCategory, setFaqCategory] = useState<'loans' | 'investments' | 'emi' | 'repayments'>('loans');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    mockDb.createContactMessage(name, phone, subject, message);
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  const faqData = {
    loans: [
      { id: 1, q: 'What is the processing time for a loan?', a: 'Once you submit your application and KYC files online, credit assessment is done in 2 hours. Approved loan disbursements are usually executed within 24 to 48 hours.' },
      { id: 2, q: 'Are there any prepayment charges for closing loans early?', a: 'No, selected personal and agricultural loan schemes feature zero prepayment penalty charges after six successful monthly installments.' },
      { id: 3, q: 'What is JLG under Women Empowerment programs?', a: 'JLG stands for Joint Liability Group. It is a credit group of 4-10 women who guarantee repayments collectively, allowing collateral-free loans at discounted rates.' }
    ],
    investments: [
      { id: 4, q: 'How can I invest in Sairam fixed deposits?', a: 'Fill out our Investment Request Form on the About page. An auditor will contact you with product brochures and coordinate documents collection.' },
      { id: 5, q: 'What is the minimum investment amount?', a: 'You can start a recurring deposit with as low as ₹1,000 per month, or a fixed deposit placement with ₹5,000.' }
    ],
    emi: [
      { id: 6, q: 'Can I change my EMI debit dates?', a: 'Yes. During KYC review, you can instruct our credit managers to set monthly debit schedules coinciding with salary credits or harvest weeks.' },
      { id: 7, q: 'What credit score is needed to qualify?', a: 'We look at basic income details, bank declarations, and KYC authenticity. A score above 650 is helpful, but group-guaranteed schemes do not demand high scores.' }
    ],
    repayments: [
      { id: 8, q: 'What happens if an EMI is paid late?', a: 'A nominal late payment fee is levied. We highly recommend activating Auto-Debit (NACH) to avoid manual delays and maintain good credit.' },
      { id: 9, q: 'How can I check my outstanding loan balance?', a: 'Customers can contact their local branch office or helpline desk with their loan ID to check ledger details instantly.' }
    ]
  };

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* Header Banner */}
      <section 
        className="bg-primary text-white py-16 px-4 sm:px-8 text-center relative overflow-hidden"
        style={{
          backgroundImage: "url('/contactbanner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/60 z-0" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-white/10 px-4 py-1 rounded-full">
            Help desk Channels
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            Connect With Sairam Finance
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Reach out via phone, send enquiries on WhatsApp, visit branch locations, or submit our contact form. Our administrative support is available 6 days a week.
          </p>
        </div>
      </section>

      {/* Main Form & Contact details */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Details */}
          <div className="lg:col-span-5 text-left space-y-6">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-primary leading-tight">
              Customer Support Channels
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              We respond to digital inquiries and contact submissions within two business hours. Connect using the channels below:
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-100 max-w-md">
              <div className="flex items-center gap-3.5 bg-slate-50 border p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[10px] text-slate-400 uppercase">Call Support Line</h4>
                  <span className="text-sm font-extrabold text-primary">+91 44 2855 9000</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-slate-50 border p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center shadow-md">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-bold text-[10px] text-slate-400 uppercase">WhatsApp Helpdesk</h4>
                  <a href="https://wa.me/919840283741" target="_blank" rel="noopener noreferrer" className="text-sm font-extrabold text-green-600 hover:underline">
                    +91 98402 83741
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-slate-50 border p-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-md border border-primary/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[10px] text-slate-400 uppercase">Email Inbox</h4>
                  <span className="text-sm font-extrabold text-primary">corp.chennai@nayaksairam.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-sm">
            <h3 className="font-display font-extrabold text-lg text-primary mb-6 text-left">Send Message</h3>

            {submitted ? (
              <div className="p-8 text-center bg-green-50 border border-green-200 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h4 className="font-bold text-green-800">Inquiry Logged</h4>
                <p className="text-xs text-green-600">
                  Your query subject has been logged. An officer will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Your Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-primary/50 text-slate-850 rounded-xl py-3 px-4 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mobile Number</label>
                    <input 
                      type="tel"
                      required
                      placeholder="e.g. 98402XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-primary/50 text-slate-850 rounded-xl py-3 px-4 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Inquiry Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-primary/50 text-slate-850 rounded-xl py-3 px-4 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Personal Loan Query">Personal Loan Query</option>
                    <option value="Business Loan Query">Business Loan Query</option>
                    <option value="Investment Schemes">Investment Placement Schemes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details on your loan/investment interest..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-primary/50 text-slate-850 rounded-xl py-3 px-4 text-xs focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-navy-dark text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Send Message <Send className="w-3.5 h-3.5 text-secondary" />
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* FAQ accordion section */}
      <section className="py-24 px-4 sm:px-8 bg-slate-50 text-slate-800 border-t scroll-mt-10" id="faq">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="space-y-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Information Archive
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary">Frequently Asked Questions</h2>
          </div>

          {/* FAQ categories header */}
          <div className="flex justify-center flex-wrap gap-2.5">
            {[
              { id: 'loans', label: 'Loan Products' },
              { id: 'investments', label: 'Investments' },
              { id: 'emi', label: 'EMI / Auditing' },
              { id: 'repayments', label: 'Repayments' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setFaqCategory(cat.id as any);
                  setExpandedId(null);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                  faqCategory === cat.id
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion render */}
          <div className="space-y-4 text-left">
            {faqData[faqCategory].map((faq) => {
              const expanded = expandedId === faq.id;
              return (
                <div key={faq.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandedId(expanded ? null : faq.id)}
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
                        <div className="p-5 pt-0 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
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

      {/* Geolocation Section */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800 border-t border-slate-150">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4 text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Branches & Maps
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-primary leading-tight">
              Locate Branch Offices
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* List */}
            <div className="lg:col-span-5 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {mockDb.getBranches().map(b => (
                <div key={b.id} className="bg-slate-50 border p-4 rounded-xl space-y-2 text-left">
                  <div className="flex justify-between items-start">
                    <h4 className="font-display font-bold text-sm text-primary leading-snug">{b.name}</h4>
                    {b.isMain && <span className="bg-secondary/15 text-primary border border-secondary/35 text-[8px] font-bold uppercase px-2 py-0.5 rounded">Main</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">{b.address}</p>
                  <div className="text-[10px] text-slate-400 font-semibold space-y-0.5">
                    <div>Helpline: {b.phone}</div>
                    <div>Email: {b.email}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mock Map */}
            <div className="lg:col-span-7 bg-slate-100 border border-slate-200 rounded-3xl relative overflow-hidden flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-[#E5E3DF]">
                <div className="absolute inset-0 opacity-15" style={{ 
                  backgroundImage: 'radial-gradient(#003366 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }} />
                
                {/* Pins */}
                <div className="absolute top-1/3 left-1/3 text-center animate-bounce">
                  <Landmark className="w-8 h-8 text-primary fill-secondary" />
                  <span className="bg-primary text-white text-[9px] font-bold py-0.5 px-2 rounded mt-1 block">Chennai Corporate</span>
                </div>
                <div className="absolute top-2/3 left-2/3 text-center opacity-75">
                  <Landmark className="w-6 h-6 text-primary fill-secondary" />
                  <span className="bg-primary text-white text-[9px] font-bold py-0.5 px-2 rounded mt-1 block">Bengaluru Regional</span>
                </div>
              </div>
              <div className="mt-auto relative z-10 bg-white/90 backdrop-blur-sm border border-slate-200 p-4 rounded-xl max-w-sm ml-4 mb-4 text-left shadow">
                <h5 className="font-bold text-xs text-primary mb-1">Central Core Banking Integrated</h5>
                <p className="text-[10px] text-slate-500 leading-normal">
                  All branches are fully synced with central servers. Drop by for physical documentation verify audits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
