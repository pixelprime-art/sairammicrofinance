import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 text-slate-800 text-left font-sans">
      <div className="mb-6">
        <Link to="/" className="text-primary hover:text-secondary font-bold text-xs flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-6 border-slate-100">
          <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-primary">Terms & Conditions</h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
              Effective Date: June 19, 2026
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to the online application portals of <strong>Sairam Microfinance</strong>. By applying for loans or using our EMI calculators, you agree to comply with the terms, conditions, and credit rules outlined below.
          </p>

          <h3 className="font-display font-bold text-base text-primary pt-4">1. Credit Application Rules</h3>
          <p>
            Applicants must guarantee that all details filled in the multi-step form (including employment records and salary numbers) are complete and accurate. Submitting fake Aadhaar or PAN files constitutes a penal fraud under banking guidelines.
          </p>

          <h3 className="font-display font-bold text-base text-primary pt-4">2. Interest Rate Locks</h3>
          <p>
            Calculated interest rates (starting at 10.99% p.a. for personal loans and 7.99% p.a. for farmers) represent estimates. The final interest rate is officially locked after credit scoring audits and document checks, and is recorded inside the loan sanction letter.
          </p>

          <h3 className="font-display font-bold text-base text-primary pt-4">3. Repayment & Auto-Debit</h3>
          <p>
            Borrowers agree to repay monthly EMI installments on or before the designated debit dates. Standard late fees may apply on delayed payments. Borrowers can activate National Automated Clearing House (NACH) mandates for easy automated monthly debits.
          </p>

          <h3 className="font-display font-bold text-base text-primary pt-4">4. Prepayment / Early Closure</h3>
          <p>
            Borrowers reserve the right to close outstanding loans early after six successful EMI payments. Standard foreclosure guidelines apply as stated in the sanction letter. SAIRAM MICROFINANCE does not charge pre-payment penalties on selected subsidized schemes.
          </p>
        </div>
      </div>
    </div>
  );
};
