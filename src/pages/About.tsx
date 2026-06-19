import React, { useState } from 'react';
import { mockDb } from '../services/mockDb';
import { 
  ShieldCheck, Heart, Sparkles, Handshake, 
  ArrowRight, Landmark, Mail, Plus, Coins
} from 'lucide-react';

export const About: React.FC = () => {
  // Investment Form State
  const [invName, setInvName] = useState('');
  const [invEmail, setInvEmail] = useState('');
  const [invPhone, setInvPhone] = useState('');
  const [invAmount, setInvAmount] = useState(50000);
  const [invScheme, setInvScheme] = useState('Fixed Deposit Plan');
  const [invDuration, setInvDuration] = useState(3);
  const [invSubmitted, setInvSubmitted] = useState(false);

  const handleInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName || !invEmail || !invPhone) return;
    mockDb.createInvestment(invName, invEmail, invPhone, invAmount, invScheme, invDuration);
    setInvSubmitted(true);
    setTimeout(() => {
      setInvName('');
      setInvEmail('');
      setInvPhone('');
      setInvSubmitted(false);
    }, 3000);
  };

  const values = [
    { title: 'Integrity', desc: 'Operating with absolute honesty and compliance in all microfinance audits.', icon: ShieldCheck, color: 'text-blue-600 bg-blue-50' },
    { title: 'Transparency', desc: 'Zero hidden charges, clear interest calculations, and straightforward repayment terms.', icon: Landmark, color: 'text-green-600 bg-green-50' },
    { title: 'Trust', desc: 'Building long-term relationships with self-help collectives, entrepreneurs, and farmers.', icon: Handshake, color: 'text-amber-600 bg-amber-50' },
    { title: 'Innovation', desc: 'Leveraging digital workflows to offer quick, accessible loans without paperwork delay.', icon: Sparkles, color: 'text-purple-600 bg-purple-50' },
    { title: 'Customer First', desc: 'Designing credit programs around the cash cycles and seasonal requirements of our borrowers.', icon: Heart, color: 'text-pink-600 bg-pink-50' }
  ];

  const leaders = [
    { name: 'Nayak Sairam', role: 'Founder & Managing Director', bio: 'Former commercial banking veteran with 25+ years of experience in rural banking frameworks and financial inclusion models.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop' },
    { name: 'Vijay Devendra', role: 'Co-Founder & Chief Executive Officer', bio: 'Fintech specialist with a background in digital payment integrations and micro-credit scoring systems development.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop' },
    { name: 'Meera Subramanian', role: 'Head of Rural Development & Micro-Credit', bio: 'Dedicated community leader who has spent 15 years organizing self-help group programs and women empowerment collectives.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop' },
    { name: 'Raghav Reddy', role: 'Chief Risk Officer & Compliance', bio: 'Oversees banking standards, credit policy evaluations, and absolute alignment with the Reserve Bank of India guidelines.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop' }
  ];

  const jobs = [
    { title: 'Microfinance Credit Officer', location: 'Coimbatore, TN', type: 'Full-time / Field', exp: '1-3 Years experience' },
    { title: 'Regional Operations Manager', location: 'Bengaluru, KA', type: 'Full-time / Office', exp: '5+ Years in banking' },
    { title: 'KYC Verification Specialist', location: 'Chennai, TN', type: 'Full-time / Hybrid', exp: 'Entry Level / Trainee' }
  ];

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* Page Header */}
      <section className="bg-primary text-white py-20 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/20 z-0" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full">
            Institutional Legacy
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            Empowering Communities Since 2015
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Nayak Sairam Micro Finance is committed to empowering individuals, entrepreneurs, women, and farmers through accessible, ethical, and affordable financial services.
          </p>
        </div>
      </section>

      {/* Overview & Mission/Vision */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 text-left space-y-6">
            <h2 className="font-display font-extrabold text-3xl text-primary">
              Company Overview & Commitment
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Founded in Chennai, Nayak Sairam Micro Finance was created to bridge the massive credit gap in rural and semi-urban India. We understand that local farmers, micro-merchants, and women entrepreneurs represent the engine of community growth, yet they are often left unserved by corporate banking requirements.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              By combining strict RBI category guidelines with easy-to-use digital application pipelines, we have provided over ₹12 Crore in small loans, uplifting more than 15,000 active clients. We do not just dispense credit; we foster sustainable financial growth.
            </p>
            
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div>
                <h4 className="font-display font-extrabold text-2xl text-primary">15K+</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Active Borrowers</p>
              </div>
              <div>
                <h4 className="font-display font-extrabold text-2xl text-primary">₹12Cr+</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Disbursed Funds</p>
              </div>
              <div>
                <h4 className="font-display font-extrabold text-2xl text-primary">98.7%</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Repayment Rate</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 gap-6">
            {/* Mission */}
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl text-left space-y-3">
              <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-bold">
                M
              </div>
              <h3 className="font-display font-bold text-lg text-primary">Our Mission</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                To provide inclusive, transparent, and digital-friendly financial solutions that improve lives, secure micro-enterprises, and strengthen local communities.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-primary text-white p-8 rounded-3xl text-left space-y-3 shadow-lg">
              <div className="w-10 h-10 bg-white/10 text-secondary rounded-xl flex items-center justify-center font-bold">
                V
              </div>
              <h3 className="font-display font-bold text-lg text-white">Our Vision</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                To become India's most trusted and technologically advanced microfinance institution for grass-roots financial empowerment.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-4 sm:px-8 bg-slate-50 text-slate-800 text-center">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Moral Frameworks
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary">Our Core Values</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="bg-white border border-slate-200/80 p-6 rounded-2xl text-left space-y-3 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${val.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-primary">{val.title}</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800 text-center">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Board of Management
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary">Meet Our Leadership Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-slate-200 overflow-hidden relative">
                  <img src={leader.image} alt={leader.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="p-6 text-left space-y-2">
                  <div>
                    <h4 className="font-display font-bold text-base text-primary leading-tight">{leader.name}</h4>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block mt-0.5">{leader.role}</span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{leader.bio}</p>
                  <div className="pt-2">
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[11px] font-bold text-primary hover:underline"
                    >
                      Connect on LinkedIn →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. INVESTMENT PLACEMENT FORM SECTION */}
      <section id="investment" className="py-24 px-4 sm:px-8 bg-slate-50 text-slate-800 border-t border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Growth Placements
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary leading-tight">
              Invest Securely, Earn Competitive Yields
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We offer structured micro-investment deposits for general public placement. By investing with Nayak Sairam, you secure attractive returns while funding the growth of rural entrepreneurs.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <Coins className="w-5 h-5 text-secondary flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-primary">Micro Placement FD</h4>
                  <p className="text-[10px] text-slate-500">Interest rates up to 8.5% p.a. starting from ₹5,000.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <Plus className="w-5 h-5 text-secondary flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-primary">Recurring Deposits</h4>
                  <p className="text-[10px] text-slate-500">Save as low as ₹1,000 monthly for structured tenures.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Request Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-sm scroll-mt-20" id="investment-form">
            <h3 className="font-display font-extrabold text-xl text-primary mb-6 text-left">Investment Request Form</h3>
            
            {invSubmitted ? (
              <div className="p-8 text-center bg-green-50 border border-green-200 rounded-2xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm">
                  ✓
                </div>
                <h4 className="font-bold text-green-800">Investment Request Lodged!</h4>
                <p className="text-xs text-green-600">
                  Thank you. An investment auditor from Nayak Sairam will contact you shortly with brochure documents.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInvestmentSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={invName}
                      onChange={(e) => setInvName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@example.com"
                      value={invEmail}
                      onChange={(e) => setInvEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98402XXXXX"
                      value={invPhone}
                      onChange={(e) => setInvPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Amount (INR)</label>
                    <input
                      type="number"
                      required
                      min="5000"
                      value={invAmount}
                      onChange={(e) => setInvAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">FD Scheme</label>
                    <select
                      value={invScheme}
                      onChange={(e) => setInvScheme(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Fixed Deposit Plan">Fixed Deposit (FD)</option>
                      <option value="Recurring Deposit Plan">Recurring Deposit (RD)</option>
                      <option value="Group Empowerment Fund">Group Empowerment Placement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Duration (Years)</label>
                    <select
                      value={invDuration}
                      onChange={(e) => setInvDuration(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 text-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value={1}>1 Year</option>
                      <option value={3}>3 Years</option>
                      <option value={5}>5 Years</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-navy-dark text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Submit Placement Request <ArrowRight className="w-3.5 h-3.5 text-secondary" />
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-24 px-4 sm:px-8 bg-white text-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 text-left space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">
              Work With Us
            </span>
            <h2 className="font-display font-extrabold text-3xl text-primary">Careers at Nayak Sairam</h2>
            <p className="text-slate-500 text-xs leading-relaxed">
              We are constantly seeking energetic microfinance officers, risk auditors, and customer managers. Check our open openings and apply by emailing your CV.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border flex items-start gap-2.5">
              <Mail className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-primary">Submit CV</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">careers@nayaksairam.com</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4 text-left">
            {jobs.map((job, idx) => (
              <div key={idx} className="bg-slate-50 border p-5 rounded-2xl flex justify-between items-center hover:border-primary transition-colors">
                <div>
                  <h4 className="font-display font-bold text-sm text-primary">{job.title}</h4>
                  <div className="flex gap-4 text-[10px] text-slate-400 font-semibold mt-1">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.exp}</span>
                  </div>
                </div>
                <a href="mailto:careers@nayaksairam.com?subject=Application%20for%20Job" className="p-2 rounded-lg bg-white border hover:bg-primary hover:text-white text-slate-600 transition-all flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
