import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, TrendingUp, ShieldCheck, Clock, CheckCircle2, Coins } from 'lucide-react';

export const InvestmentService: React.FC = () => {

  const schemes = [
    { title: 'Fixed Deposit (FD)', rate: 'Up to 9.5% p.a.', desc: 'Secure your lump sum amount with guaranteed high returns.' },
    { title: 'Recurring Deposit (RD)', rate: 'Up to 8.5% p.a.', desc: 'Build your savings steadily with monthly micro-investments.' },
    { title: 'Senior Citizen Savings', rate: 'Up to 10.0% p.a.', desc: 'Special higher interest rates for senior citizens for a comfortable retirement.' }
  ];

  return (
    <div className="w-full flex flex-col font-sans bg-slate-50 min-h-screen">
      {/* Hero Banner */}
      <section className="relative w-full h-[220px] sm:h-[300px] overflow-hidden">
        <img
          src="/invest.jpg"
          alt="Investment Services Banner"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-[#002C54]/60" />
        {/* Text content over banner */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full mb-4">
            Grow Your Wealth
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white leading-tight drop-shadow-lg">
            Secure Investment Services
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-xl mt-4 leading-relaxed drop-shadow">
            Invest with Sairam Microfinance for guaranteed returns, complete transparency, and high security.
          </p>
        </div>
      </section>

      {/* Overview / Benefits */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">High Returns</h3>
              <p className="text-sm text-slate-500">Enjoy some of the most competitive interest rates in the market, maximizing your wealth creation.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">100% Secure</h3>
              <p className="text-sm text-slate-500">Your investments are fully secured and compliant with strict financial regulatory frameworks.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Flexible Tenure</h3>
              <p className="text-sm text-slate-500">Choose investment durations ranging from 12 months to 5 years according to your needs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Investment Schemes */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-display font-extrabold text-2xl text-slate-800">Our Investment Schemes</h2>
              <div className="space-y-4">
                {schemes.map((scheme, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#002C54] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800">{scheme.title}</h4>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">{scheme.rate}</span>
                    </div>
                    <p className="text-sm text-slate-500">{scheme.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* About Investment */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#003366] text-white rounded-3xl shadow-2xl overflow-hidden"
              >
                {/* Top accent bar */}
                <div className="h-1.5 w-full bg-linear-to-r from-[#D4AF37] via-yellow-300 to-[#D4AF37]" />

                <div className="p-8 space-y-8">
                  {/* Header */}
                  <div>
                    <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                      Why Invest With Us
                    </span>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-4 leading-tight">
                      About Our Investment Schemes
                    </h3>
                    <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                      Sairam Microfinance has been empowering communities since its inception by offering safe, transparent, and high-yield investment opportunities. Our schemes are RBI-compliant and designed to suit every investor — from first-time savers to seasoned investors.
                    </p>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: '₹50Cr+', label: 'Total Deposits' },
                      { value: '12,000+', label: 'Happy Investors' },
                      { value: '10% p.a.', label: 'Max Interest Rate' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
                        <p className="text-[#D4AF37] font-extrabold text-lg sm:text-xl font-display">{stat.value}</p>
                        <p className="text-slate-300 text-xs mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Key highlights */}
                 

                  {/* CTA */}
                  <a
                    href="/contact"
                    className="w-full bg-[#D4AF37] hover:bg-gold-hover text-[#003366] font-extrabold py-3.5 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <Landmark className="w-5 h-5" />
                    Talk to an Investment Advisor
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
