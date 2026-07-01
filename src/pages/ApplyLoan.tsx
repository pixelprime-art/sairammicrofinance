import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDb';
import type { LoanApplication } from '../services/mockDb';
import { 
  User, Briefcase, IndianRupee, FileUp, ArrowLeft, 
  ArrowRight, ShieldCheck, Check, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FormInputs = {
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  loanType: string;
  amount: number;
  tenureMonths: number;
  occupation: string;
  employerName: string;
  experienceYears: number;
  monthlyIncome: number;
  otherIncome: number;
};

export const ApplyLoan: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Step indicator state
  const [currentStep, setCurrentStep] = useState(1);
  const [successApp, setSuccessApp] = useState<LoanApplication | null>(null);
  
  // Files base64 mock storage
  const [aadhaarFile, setAadhaarFile] = useState<{ name: string; data: string } | null>(null);
  const [panFile, setPanFile] = useState<{ name: string; data: string } | null>(null);
  const [photoFile, setPhotoFile] = useState<{ name: string; data: string } | null>(null);
  const [incomeFile, setIncomeFile] = useState<{ name: string; data: string } | null>(null);
  const [fileErrors, setFileErrors] = useState<string | null>(null);

  // Read preselected type from URL
  const selectedType = searchParams.get('type') || 'personal';

  // React Hook Form
  const { register, handleSubmit, trigger } = useForm<FormInputs>({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      loanType: selectedType,
      amount: selectedType === 'personal' ? 200000 : selectedType === 'agricultural' ? 150000 : 500000,
      tenureMonths: selectedType === 'personal' ? 36 : selectedType === 'gold' ? 12 : 60,
      gender: 'Male',
      occupation: 'Salaried Employee',
      experienceYears: 2,
      otherIncome: 0
    }
  });

  // Convert files to base64 utility
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<{ name: string; data: string } | null>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFileErrors('File size must be under 2MB.');
      return;
    }

    setFileErrors(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setter({
        name: file.name,
        data: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  // Step Navigations with Validation
  const handleNextStep = async () => {
    let fieldsToValidate: (keyof FormInputs)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['fullName', 'dob', 'mobile', 'email', 'amount', 'tenureMonths'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['occupation', 'employerName', 'experienceYears'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['monthlyIncome', 'otherIncome'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Submit Final
  const onSubmit = (data: FormInputs) => {
    if (!aadhaarFile || !panFile || !photoFile || !incomeFile) {
      setFileErrors('All four KYC documents are required for credit check verification.');
      return;
    }

    // Calculate monthly EMI mock
    const loanTypes = mockDb.getLoanTypes();
    const matched = loanTypes.find(t => t.id === data.loanType);
    const rate = matched ? matched.interestRate : 10.99;
    
    const monthlyRate = rate / 12 / 100;
    const emi = (data.amount * monthlyRate * Math.pow(1 + monthlyRate, data.tenureMonths)) / 
                (Math.pow(1 + monthlyRate, data.tenureMonths) - 1);

    const submissionData = {
      userId: user?.id || 'guest',
      fullName: data.fullName,
      dob: data.dob,
      gender: data.gender,
      mobile: data.mobile,
      email: data.email,
      loanType: data.loanType,
      amount: Number(data.amount),
      tenureMonths: Number(data.tenureMonths),
      interestRate: rate,
      monthlyEMI: Math.round(emi),
      occupation: data.occupation,
      employerName: data.employerName,
      experienceYears: Number(data.experienceYears),
      monthlyIncome: Number(data.monthlyIncome),
      otherIncome: Number(data.otherIncome),
      documents: {
        aadhaarName: aadhaarFile.name,
        aadhaarData: aadhaarFile.data,
        panName: panFile.name,
        panData: panFile.data,
        photoName: photoFile.name,
        photoData: photoFile.data,
        incomeProofName: incomeFile.name,
        incomeProofData: incomeFile.data
      }
    };

    const newApplication = mockDb.createApplication(submissionData);
    setSuccessApp(newApplication);
  };

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* Header */}
      <section 
        className="bg-primary text-white py-12 px-4 sm:px-8 text-center relative overflow-hidden"
        style={{
          backgroundImage: "url('/applyloanbanner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/60 z-0" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-white/10 px-4 py-1 rounded-full">
            Application Portal
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Apply for Loan Online
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Fill out our secure, encrypted multi-step form to register your application details. All information is guarded under strict RBI privacy guidelines.
          </p>
        </div>
      </section>

      {/* Main wizard body */}
      <section className="py-16 px-4 sm:px-8 bg-white text-slate-800">
        <div className="max-w-3xl mx-auto">

          {successApp ? (
            /* SUCCESS SCREEN */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-green-500/10 text-green-600 border border-green-500/20 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-primary">Application Submitted Successfully</h3>
                <p className="text-sm text-slate-500">
                  Your application has been registered with reference ID:
                </p>
                <div className="inline-block bg-primary text-secondary font-display font-bold text-lg px-6 py-2 rounded-xl shadow-md border border-secondary/20 tracking-wider">
                  {successApp.id}
                </div>
              </div>

              <div className="border-t border-b border-slate-200 py-6 my-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Applicant</span>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{successApp.fullName}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Loan Type</span>
                  <div className="text-xs font-bold text-slate-800 mt-0.5 capitalize">{successApp.loanType}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Amount</span>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">₹{successApp.amount.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated EMI</span>
                  <div className="text-xs font-bold mt-0.5 text-secondary">₹{successApp.monthlyEMI.toLocaleString('en-IN')}/mo</div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                Our verification officers will review your uploaded Aadhaar and income sheets within 24-48 hours. You will receive SMS alerts and in-app dashboard notifications upon status updates.
              </p>

              <div className="pt-6 flex justify-center gap-4">
                <button 
                  onClick={() => {
                    // Force admin login to show dashboard verification workflow
                    navigate('/admin');
                  }}
                  className="bg-primary hover:bg-navy-dark text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  Go to Admin Panel to Review <ArrowRight className="w-4 h-4 text-secondary" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* WIZARD CARD */
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
              
              {/* Stepper Header */}
              <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                {[
                  { step: 1, icon: User, label: 'Personal' },
                  { step: 2, icon: Briefcase, label: 'Employment' },
                  { step: 3, icon: IndianRupee, label: 'Income' },
                  { step: 4, icon: FileUp, label: 'KYC Docs' }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = currentStep >= item.step;
                  const current = currentStep === item.step;
                  return (
                    <div key={item.step} className="flex flex-col items-center gap-1 text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        current 
                          ? 'bg-primary text-secondary border-secondary scale-110 ring-4 ring-primary/10 shadow-sm'
                          : active
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline ${
                        current ? 'text-primary' : active ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: PERSONAL DETAILS */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      className="space-y-4"
                    >
                      <h3 className="font-display font-extrabold text-base text-primary mb-4">Step 1: Personal Details</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name (As in Aadhaar)</label>
                          <input 
                            type="text"
                            required
                            {...register('fullName', { required: true })}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Date of Birth</label>
                          <input 
                            type="date"
                            required
                            {...register('dob', { required: true })}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Gender</label>
                          <select 
                            {...register('gender')}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800 cursor-pointer"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other / Collective</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mobile Number</label>
                          <input 
                            type="tel"
                            required
                            placeholder="10-digit number"
                            {...register('mobile', { required: true, pattern: /^[0-9]{10}$/ })}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                          <input 
                            type="email"
                            required
                            {...register('email', { required: true })}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/60">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Loan Category</label>
                          <select 
                            {...register('loanType')}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800 cursor-pointer"
                          >
                            <option value="personal">Personal Loan</option>
                            <option value="business">Business Loan (MSME)</option>
                            <option value="gold">Gold Loan</option>
                            <option value="education">Education Loan</option>
                            <option value="agricultural">Agricultural Loan</option>
                            <option value="womens-empowerment">Women's Empowerment Loan</option>
                            <option value="emergency">Emergency Loan</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Loan Amount (INR)</label>
                          <input 
                            type="number"
                            required
                            {...register('amount', { required: true, min: 10000 })}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tenure (Months)</label>
                          <input 
                            type="number"
                            required
                            {...register('tenureMonths', { required: true, min: 6 })}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: EMPLOYMENT DETAILS */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      className="space-y-4"
                    >
                      <h3 className="font-display font-extrabold text-base text-primary mb-4">Step 2: Employment Details</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Occupation Category</label>
                          <select 
                            {...register('occupation')}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800 cursor-pointer"
                          >
                            <option value="Salaried Employee">Salaried Employee</option>
                            <option value="Self Employed Business">Self Employed (Business Owner)</option>
                            <option value="Farmer / Agricultural Worker">Farmer / Agricultural Worker</option>
                            <option value="Unemployed / Homemaker">Homemaker / Small Collective</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Employer / Business Name</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. TCS or Self Store"
                            {...register('employerName', { required: true })}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Work Experience (Years)</label>
                        <input 
                          type="number"
                          required
                          {...register('experienceYears', { required: true, min: 0 })}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: INCOME DETAILS */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      className="space-y-4"
                    >
                      <h3 className="font-display font-extrabold text-base text-primary mb-4">Step 3: Income Details</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Monthly Net Income (INR)</label>
                          <input 
                            type="number"
                            required
                            {...register('monthlyIncome', { required: true, min: 1000 })}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Other Sources Income (Monthly / Optional)</label>
                          <input 
                            type="number"
                            {...register('otherIncome')}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-xl border flex items-start gap-2.5">
                        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Your income data is cross-referenced with your bank statement uploads to determine the maximum credit threshold and eligible interest subsidies.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: DOCUMENT UPLOAD */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      className="space-y-4"
                    >
                      <h3 className="font-display font-extrabold text-base text-primary mb-4">Step 4: Upload KYC Documents</h3>
                      
                      {fileErrors && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
                          {fileErrors}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        {/* Aadhaar */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Aadhaar Card (PDF / JPG)</label>
                          <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-100/50 cursor-pointer">
                            <input 
                              type="file" 
                              required
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, setAadhaarFile)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <FileUp className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                            <span className="text-[10px] text-slate-500 block truncate">
                              {aadhaarFile ? aadhaarFile.name : 'Upload Aadhaar front/back'}
                            </span>
                          </div>
                        </div>

                        {/* PAN */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">PAN Card (PDF / JPG)</label>
                          <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-100/50 cursor-pointer">
                            <input 
                              type="file" 
                              required
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, setPanFile)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <FileUp className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                            <span className="text-[10px] text-slate-500 block truncate">
                              {panFile ? panFile.name : 'Upload PAN Card photo'}
                            </span>
                          </div>
                        </div>

                        {/* Passport Photo */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Passport Photo (JPG / PNG)</label>
                          <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-100/50 cursor-pointer">
                            <input 
                              type="file" 
                              required
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, setPhotoFile)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <FileUp className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                            <span className="text-[10px] text-slate-500 block truncate">
                              {photoFile ? photoFile.name : 'Upload profile picture'}
                            </span>
                          </div>
                        </div>

                        {/* Income Proof */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Income Proof (Salary / Land Patta)</label>
                          <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-100/50 cursor-pointer">
                            <input 
                              type="file" 
                              required
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, setIncomeFile)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <FileUp className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                            <span className="text-[10px] text-slate-500 block truncate">
                              {incomeFile ? incomeFile.name : 'Upload 3 mos slips or Land title'}
                            </span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

                {/* Footer buttons */}
                <div className="pt-6 border-t border-slate-200/60 flex justify-between items-center gap-4">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs py-3 px-5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Previous Step
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-primary hover:bg-navy-dark text-white font-bold text-xs py-3 px-6 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Next Step <ArrowRight className="w-4 h-4 text-secondary" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-secondary hover:bg-gold-hover text-primary font-extrabold text-xs py-3.5 px-8 rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Submit Application <ShieldCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>

            </div>
          )}

        </div>
      </section>

    </div>
  );
};
