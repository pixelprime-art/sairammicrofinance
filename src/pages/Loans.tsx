import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import type { LoanType } from '../services/mockDb';
import { 
  ArrowRight, Calculator, Check, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Loans: React.FC = () => {
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);

  useEffect(() => {
    setLoanTypes(mockDb.getLoanTypes());
  }, []);

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* Header Banner */}
      <section className="bg-[url('/loanbanner.jpg')] bg-cover bg-center bg-no-repeat text-white py-16 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/20 z-0" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full">
            Financial Offerings
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            Structured Loan Services
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Choose from a wide variety of loan configurations, designed specifically to help you grow your business, secure emergency care, fund studies, or buy machinery.
          </p>
        </div>
      </section>

      {/* Grid of detailed loan types */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {loanTypes.map((loan, idx) => (
              <motion.div 
                key={loan.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Top Badge */}
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-primary text-secondary rounded-2xl flex items-center justify-center font-display font-extrabold text-lg shadow-sm border border-secondary/20">
                      {loan.name[0]}
                    </div>
                    <div className="text-right space-y-1">
                      <span className="bg-primary/5 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20 block">
                        Interest Rate: {loan.interestRate}% p.a.
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mr-1 mt-1">
                        Proc Fee: {loan.processingFee}
                      </span>
                    </div>
                  </div>

                  {/* Title & Limits */}
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-primary">{loan.name}</h3>
                    <div className="flex gap-4 text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wide">
                      <span>Max Cap: ₹{loan.maxAmount.toLocaleString('en-IN')}</span>
                      <span>•</span>
                      <span>Max Tenure: {loan.tenureMonths} Months</span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed">
                    {loan.description}
                  </p>

                  {/* Features checklist */}
                  <div className="space-y-2 pt-4 border-t border-slate-200/50">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Key Benefits</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {loan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-600">
                          <Check className="w-4 h-4 text-secondary shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Redirection Panel */}
                <div className="pt-8 mt-8 border-t border-slate-200/50 grid grid-cols-2 gap-4">
                  <Link 
                    to={`/calculator?amount=${loan.maxAmount / 2}&rate=${loan.interestRate}&tenure=${loan.tenureMonths}`}
                    className="bg-white hover:bg-slate-100 text-primary border border-slate-200 font-bold text-xs py-3 rounded-xl shadow-sm text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Calculator className="w-4 h-4" /> Calculate EMI
                  </Link>
                  <Link 
                    to={`/apply?type=${loan.id}`}
                    className="bg-primary hover:bg-navy-dark text-white font-bold text-xs py-3 rounded-xl shadow-md text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Apply Now <ArrowRight className="w-4 h-4 text-secondary" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Audit Statement */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4 text-left max-w-3xl mx-auto">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-sm text-amber-800">Important Credit Notice</h5>
              <p className="text-xs text-amber-700 leading-relaxed mt-1">
                Loan approvals are strictly subject to credit policy rules and basic verification checks on uploaded Aadhaar, PAN, and income details. Sairam Microfinance does not demand prepayment commissions or cash handouts for file verification. Please report administrative issues to our audit helpline.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
