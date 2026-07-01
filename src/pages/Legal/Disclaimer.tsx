import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Disclaimer: React.FC = () => {
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
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-primary">Disclaimer</h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
              Effective Date: June 19, 2026
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            The details and calculators hosted on <strong>Sairam Microfinance</strong> website serve general informational and credit planning purposes. They do not constitute formal commercial loan commitments.
          </p>

          <h3 className="font-display font-bold text-base text-primary pt-4">1. Regulatory Registrations</h3>
          <p>
            Sairam Microfinance is registered as a Category-B Microfinance Institution under the Reserve Bank of India (RBI) guidelines. All credit schemes, subsidy structures, and group JLG loans strictly adhere to the operational guidelines issued by regulatory authorities.
          </p>

          <h3 className="font-display font-bold text-base text-primary pt-4">2. Calculator Outputs</h3>
          <p>
            Outputs from our EMI calculators (including Principal ratios, monthly payments, and interest values) are mathematical approximations. The final EMI and payment schedule is determined after manual KYC checks and is verified inside the signed loan agreement.
          </p>

          <h3 className="font-display font-bold text-base text-primary pt-4">3. Investment Placement Risks</h3>
          <p>
            Micro-investment deposits and fixed/recurring placements are governed by the terms of the specific investment prospectus. Investors are requested to read the product brochures and terms of agreement carefully before executing placements.
          </p>

          <h3 className="font-display font-bold text-base text-primary pt-4">4. No Administrative Charges Alert</h3>
          <p>
            Sairam Microfinance does not demand cash handouts, commissions, or advanced deposits to secure loan files or trigger document verification checks. Borrowers are warned to ignore fraudulent entities demanding money in the company's name.
          </p>
        </div>
      </div>
    </div>
  );
};
