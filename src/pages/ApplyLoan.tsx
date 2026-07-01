import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../services/mockDb';
import type { LoanApplication } from '../services/mockDb';
import { 
  User, Briefcase, IndianRupee, ArrowLeft, 
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
  customOccupation?: string;
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
  const [shake, setShake] = useState(0);

  // Read preselected type from URL
  const selectedType = searchParams.get('type') || 'personal';

  // React Hook Form
  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      loanType: selectedType,
      amount: selectedType === 'personal' ? 200000 : selectedType === 'agricultural' ? 150000 : 500000,
      tenureMonths: selectedType === 'personal' ? 36 : selectedType === 'gold' ? 12 : 60,
      gender: 'Male',
      occupation: 'Salaried Employee',
      customOccupation: '',
      experienceYears: 2,
      otherIncome: 0
    }
  });

  const selectedOccupation = watch('occupation');

  // Step Navigations with Validation
  const handleNextStep = async () => {
    let fieldsToValidate: (keyof FormInputs)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['fullName', 'dob', 'mobile', 'email', 'amount', 'tenureMonths'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['occupation', 'employerName', 'experienceYears'];
      if (selectedOccupation === 'Others') {
        fieldsToValidate.push('customOccupation');
      }
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShake(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Submit Final
  const onSubmit = (data: FormInputs) => {
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
      occupation: data.occupation === 'Others' ? (data.customOccupation || 'Others') : data.occupation,
      employerName: data.employerName,
      experienceYears: Number(data.experienceYears),
      monthlyIncome: Number(data.monthlyIncome),
      otherIncome: Number(data.otherIncome),
      documents: {
        aadhaarName: 'Not Provided',
        aadhaarData: '',
        panName: 'Not Provided',
        panData: '',
        photoName: 'Not Provided',
        photoData: '',
        incomeProofName: 'Not Provided',
        incomeProofData: ''
      }
    };

    const newApplication = mockDb.createApplication(submissionData);
    setSuccessApp(newApplication);
  };

  const onInvalidSubmit = () => {
    setShake(prev => prev + 1);
  };

  const hasCurrentStepErrors = () => {
    let currentFields: (keyof FormInputs)[] = [];
    if (currentStep === 1) {
      currentFields = ['fullName', 'dob', 'mobile', 'email', 'amount', 'tenureMonths'];
    } else if (currentStep === 2) {
      currentFields = ['occupation', 'employerName', 'experienceYears'];
      if (selectedOccupation === 'Others') {
        currentFields.push('customOccupation');
      }
    } else if (currentStep === 3) {
      currentFields = ['monthlyIncome', 'otherIncome'];
    }
    return currentFields.some(field => errors[field]);
  };

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* Header */}
      <section className="bg-primary text-white py-12 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/20 z-0" />
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
                  <div className="text-xs font-bold text-slate-800 mt-0.5 text-secondary">₹{successApp.monthlyEMI.toLocaleString('en-IN')}/mo</div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                Our verification officers will review your application details within 24-48 hours. You will receive SMS alerts and in-app dashboard notifications upon status updates.
              </p>

              <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => navigate('/')}
                  className="bg-primary hover:bg-navy-dark text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-secondary" /> Back to Home Page
                </button>
                <button 
                  onClick={() => navigate('/loans')}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Explore Other Loans <ArrowRight className="w-4 h-4 text-primary" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* WIZARD CARD */
            <motion.div 
              animate={shake ? { x: [0, -6, 6, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm"
            >
              
              {/* Stepper Header */}
              <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                {[
                  { step: 1, icon: User, label: 'Personal' },
                  { step: 2, icon: Briefcase, label: 'Employment' },
                  { step: 3, icon: IndianRupee, label: 'Income' }
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
              <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-6 text-left">
                {hasCurrentStepErrors() && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>
                    Please correct the highlighted errors on this page before proceeding.
                  </div>
                )}
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
                            {...register('fullName', { required: true })}
                            className={`w-full bg-white border rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-slate-800 ${
                              errors.fullName 
                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                : 'border-slate-200 focus:border-primary/50'
                            }`}
                          />
                          {errors.fullName && <p className="text-[10px] text-red-500 mt-1.5 font-semibold">Full name is required.</p>}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Date of Birth</label>
                          <input 
                            type="date"
                            {...register('dob', { required: true })}
                            className={`w-full bg-white border rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-slate-800 ${
                              errors.dob 
                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                : 'border-slate-200 focus:border-primary/50'
                            }`}
                          />
                          {errors.dob && <p className="text-[10px] text-red-500 mt-1.5 font-semibold">Date of birth is required.</p>}
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
                            placeholder="10-digit number"
                            {...register('mobile', { required: true, pattern: /^[0-9]{10}$/ })}
                            className={`w-full bg-white border rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-slate-800 ${
                              errors.mobile 
                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                : 'border-slate-200 focus:border-primary/50'
                            }`}
                          />
                          {errors.mobile && (
                            <p className="text-[10px] text-red-500 mt-1.5 font-semibold">
                              {errors.mobile.type === 'pattern' ? 'Please enter a valid 10-digit mobile number.' : 'Mobile number is required.'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                          <input 
                            type="email"
                            {...register('email', { required: true })}
                            className={`w-full bg-white border rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-slate-800 ${
                              errors.email 
                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                : 'border-slate-200 focus:border-primary/50'
                            }`}
                          />
                          {errors.email && <p className="text-[10px] text-red-500 mt-1.5 font-semibold">A valid email address is required.</p>}
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
                            {...register('amount', { required: true, min: 10000 })}
                            className={`w-full bg-white border rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-slate-800 ${
                              errors.amount 
                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                : 'border-slate-200 focus:border-primary/50'
                            }`}
                          />
                          {errors.amount && (
                            <p className="text-[10px] text-red-500 mt-1.5 font-semibold">
                              {errors.amount.type === 'min' ? 'Loan amount must be at least ₹10,000.' : 'Loan amount is required.'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tenure (Months)</label>
                          <input 
                            type="number"
                            {...register('tenureMonths', { required: true, min: 6 })}
                            className={`w-full bg-white border rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-slate-800 ${
                              errors.tenureMonths 
                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                : 'border-slate-200 focus:border-primary/50'
                            }`}
                          />
                          {errors.tenureMonths && (
                            <p className="text-[10px] text-red-500 mt-1.5 font-semibold">
                              {errors.tenureMonths.type === 'min' ? 'Tenure must be at least 6 months.' : 'Tenure is required.'}
                            </p>
                          )}
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
                            <option value="Self Employed / Business">Self Employed / Business</option>
                            <option value="Agriculture & Allied Activities">Agriculture & Allied Activities</option>
                            <option value="Daily Wage / Labour">Daily Wage / Labour</option>
                            <option value="Homemaker">Homemaker</option>
                            <option value="Retired / Pensioner">Retired / Pensioner</option>
                            <option value="Others">Others</option>
                          </select>

                          {selectedOccupation === 'Others' && (
                            <div className="mt-3">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Specify Occupation</label>
                              <input 
                                type="text"
                                {...register('customOccupation', { required: selectedOccupation === 'Others' })}
                                placeholder="e.g. Freelance Designer"
                                className={`w-full bg-white border rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-slate-800 ${
                                  errors.customOccupation 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                    : 'border-slate-200 focus:border-primary/50'
                                }`}
                              />
                              {errors.customOccupation && <p className="text-[10px] text-red-500 mt-1.5 font-semibold">Please specify your occupation.</p>}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Employer / Business Name</label>
                          <input 
                            type="text"
                            placeholder="e.g. TCS or Self Store"
                            {...register('employerName', { required: true })}
                            className={`w-full bg-white border rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-slate-800 ${
                              errors.employerName 
                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                : 'border-slate-200 focus:border-primary/50'
                            }`}
                          />
                          {errors.employerName && <p className="text-[10px] text-red-500 mt-1.5 font-semibold">Employer / Business name is required.</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Work Experience (Years)</label>
                        <input 
                          type="number"
                          {...register('experienceYears', { required: true, min: 0 })}
                          className={`bg-white border rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-slate-800 w-44 ${
                            errors.experienceYears 
                              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                              : 'border-slate-200 focus:border-primary/50'
                          }`}
                        />
                        {errors.experienceYears && (
                          <p className="text-[10px] text-red-500 mt-1.5 font-semibold">
                            {errors.experienceYears.type === 'min' ? 'Experience cannot be negative.' : 'Work experience is required.'}
                          </p>
                        )}
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
                            {...register('monthlyIncome', { required: true, min: 1000 })}
                            className={`w-full bg-white border rounded-xl py-3 px-4 text-xs focus:outline-none transition-all text-slate-800 ${
                              errors.monthlyIncome 
                                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                                : 'border-slate-200 focus:border-primary/50'
                            }`}
                          />
                          {errors.monthlyIncome && (
                            <p className="text-[10px] text-red-500 mt-1.5 font-semibold">
                              {errors.monthlyIncome.type === 'min' ? 'Monthly income must be at least ₹1,000.' : 'Monthly income is required.'}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Other Sources Income (Monthly / Optional)</label>
                          <input 
                            type="number"
                            {...register('otherIncome')}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary/50 border-slate-200 text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-primary/5 rounded-xl border flex items-start gap-2.5">
                        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Your income data is cross-referenced with your bank statement uploads to determine the maximum credit threshold and eligible interest subsidies.
                        </p>
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

                  {currentStep < 3 ? (
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

            </motion.div>
          )}

        </div>
      </section>

    </div>
  );
};
