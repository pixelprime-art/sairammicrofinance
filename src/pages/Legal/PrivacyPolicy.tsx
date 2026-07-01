import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
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
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-primary">Privacy Policy</h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
              Effective Date: June 19, 2026
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            At <strong>Sairam Microfinance</strong>, we prioritize the confidentiality and safety of your personal credentials and financial records. This Privacy Policy details our operational rules on collection, usage, and safeguarding of customer profiles.
          </p>

          <h3 className="font-display font-bold text-base text-primary pt-4">1. Information We Collect</h3>
          <p>
            To process credit applications, we request and audit details including:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Personal Identity Credentials:</strong> Full Name, Date of Birth, Gender, and passport size photo files.</li>
            <li><strong>Contact details:</strong> Mobile number, email addresses, and residential layouts.</li>
            <li><strong>Official KYC papers:</strong> Aadhaar Card number, PAN details, bank statements, and salary slips.</li>
            <li><strong>Employment parameters:</strong> Occupation category, business names, salary levels, and years of experience.</li>
          </ul>

          <h3 className="font-display font-bold text-base text-primary pt-4">2. Purpose of Audit Audits</h3>
          <p>
            We process customer details exclusively for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Conducting credit assessment checkups and checking eligibility ratios.</li>
            <li>Executing online KYC registrations and verification steps.</li>
            <li>Disbursing approved loan funds securely to matched bank accounts.</li>
            <li>Auditing repayment patterns and issuing in-app alert notifications.</li>
          </ul>

          <h3 className="font-display font-bold text-base text-primary pt-4">3. Data Security</h3>
          <p>
            All file uploads (including Aadhaar and PAN documents encoded to Base64) are stored in encrypted local storage/server databases. We do not distribute, sell, or lend customer details to third-party marketing networks.
          </p>

          <h3 className="font-display font-bold text-base text-primary pt-4">4. RBI Guidelines Compliance</h3>
          <p>
            Our governance structure aligns strictly with the Fair Practices Code issued by the Reserve Bank of India (RBI). Customers reserve the right to review their credit ledger files and request updates to inaccurate contact records.
          </p>
        </div>
      </div>
    </div>
  );
};
