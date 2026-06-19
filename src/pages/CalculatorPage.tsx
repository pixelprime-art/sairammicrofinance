import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Calculator, ArrowRight, BarChart2, Table 
} from 'lucide-react';

interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export const CalculatorPage: React.FC = () => {
  const location = useLocation();

  // Read URL query params (if user redirected from a specific loan card)
  const getParam = (name: string, fallback: number) => {
    const params = new URLSearchParams(location.search);
    const val = params.get(name);
    return val ? Number(val) : fallback;
  };

  // State
  const [loanAmount, setLoanAmount] = useState(() => getParam('amount', 300000));
  const [interestRate, setInterestRate] = useState(() => getParam('rate', 10.99));
  const [loanTenure, setLoanTenure] = useState(() => getParam('tenure', 36));
  
  const [outputs, setOutputs] = useState({ emi: 0, totalInterest: 0, totalPayable: 0 });
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);

  // Recalculate
  useEffect(() => {
    const monthlyRate = interestRate / 12 / 100;
    const n = loanTenure;

    let emi = 0;
    if (monthlyRate === 0) {
      emi = loanAmount / n;
    } else {
      emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    }

    const totalPayable = emi * n;
    const totalInterest = totalPayable - loanAmount;

    setOutputs({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayable: Math.round(totalPayable)
    });

    // Compile Amortization Schedule
    let balance = loanAmount;
    const newSchedule: AmortizationRow[] = [];
    const fixedEMI = emi;

    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = fixedEMI - interestPayment;
      balance = balance - principalPayment;

      newSchedule.push({
        month: i,
        emi: Math.round(fixedEMI),
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.max(0, Math.round(balance))
      });
    }
    setSchedule(newSchedule);

  }, [loanAmount, interestRate, loanTenure]);

  // Sync state if query parameters change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('amount')) setLoanAmount(Number(params.get('amount')));
    if (params.get('rate')) setInterestRate(Number(params.get('rate')));
    if (params.get('tenure')) setLoanTenure(Number(params.get('tenure')));
  }, [location.search]);

  // SVG parameters
  const totalVal = outputs.totalPayable || 1;
  const principalPercent = (loanAmount / totalVal) * 100;
  const interestPercent = (outputs.totalInterest / totalVal) * 100;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const principalOffset = circumference - (principalPercent / 100) * circumference;
  const interestOffset = circumference - (interestPercent / 100) * circumference;

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* Banner */}
      <section className="bg-primary text-white py-16 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/20 z-0" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-secondary text-xs font-bold uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full">
            Financial Tools
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
            EMI & Amortization Calculator
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Understand your repayment schedules before applying. Adjust details, view monthly repayments, and review exactly how much interest you pay over the loan tenure.
          </p>
        </div>
      </section>

      {/* Main calculator interface */}
      <section className="py-24 px-4 sm:px-8 bg-white text-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Control Panel */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-8 rounded-3xl space-y-6">
              <h3 className="font-display font-extrabold text-lg text-primary flex items-center gap-2">
                <Calculator className="w-5 h-5 text-secondary" /> Set Loan Variables
              </h3>

              {/* Amount input */}
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Loan Amount (INR)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">₹</span>
                    <input 
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Math.min(5000000, Number(e.target.value)))}
                      className="bg-white border rounded-lg py-1 px-3 pl-6 text-xs text-primary font-bold focus:outline-none w-28 text-right"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="3000000"
                  step="5000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Interest Rate (% Yearly)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      step="0.01"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Math.min(30, Number(e.target.value)))}
                      className="bg-white border rounded-lg py-1 px-3 pr-6 text-xs text-primary font-bold focus:outline-none w-20 text-right"
                    />
                    <span className="absolute right-2 top-1.5 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="7.99"
                  max="25"
                  step="0.05"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Tenure months */}
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Loan Tenure (Months)</label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Math.min(120, Number(e.target.value)))}
                      className="bg-white border rounded-lg py-1 px-3 pr-8 text-xs text-primary font-bold focus:outline-none w-20 text-right"
                    />
                    <span className="absolute right-2 top-1.5 text-xs font-semibold text-slate-400">mos</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="6"
                  max="120"
                  step="6"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div className="text-left">
                  <span className="font-semibold text-slate-500">Annualized Cost Ratio (APR)</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Total cost index inclusive of mock documentation charges.</p>
                </div>
                <strong className="text-slate-800 text-sm font-bold">{(interestRate + 0.25).toFixed(2)}%</strong>
              </div>
            </div>

            {/* Calculations Result Output */}
            <div className="lg:col-span-5 bg-primary text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between min-h-[400px]">
              
              <div className="w-full text-center space-y-4">
                <span className="text-[10px] font-bold tracking-widest text-secondary uppercase">Repayment Estimate</span>
                <div className="space-y-1">
                  <h4 className="text-slate-400 text-xs font-bold uppercase">Monthly Payment (EMI)</h4>
                  <div className="text-4xl font-display font-extrabold text-secondary">
                    ₹{outputs.emi.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="relative w-40 h-40 my-6 flex items-center justify-center self-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#001F42" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke="#D4AF37"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={principalOffset}
                    className="transition-all duration-500 ease-out"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke="#0D4A8C"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={interestOffset}
                    className="transition-all duration-500 ease-out"
                    style={{ transformOrigin: 'center', transform: 'rotate(180deg)' }}
                  />
                </svg>
                <div className="absolute text-center">
                  <BarChart2 className="w-6 h-6 text-secondary mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-slate-300 uppercase leading-none block">EMI Ratio</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="w-full grid grid-cols-2 gap-4 border-t border-navy-light pt-6">
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Principal Loan</span>
                  </div>
                  <div className="text-sm font-extrabold font-display">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-navy-light" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Total Interest</span>
                  </div>
                  <div className="text-sm font-extrabold font-display">
                    ₹{outputs.totalInterest.toLocaleString('en-IN')}
                  </div>
                </div>
                
                <div className="col-span-2 text-center pt-2 border-t border-navy-light/40">
                  <div className="text-[10px] font-semibold text-slate-400">Total Payable Amount</div>
                  <div className="text-base font-extrabold font-display text-secondary mt-0.5">
                    ₹{outputs.totalPayable.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 mt-6">
                <button 
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="bg-navy-light hover:bg-navy-light/80 text-white font-bold text-xs py-3 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Table className="w-4 h-4" /> Schedule
                </button>
                <Link 
                  to="/apply"
                  className="bg-secondary hover:bg-gold-hover text-primary font-extrabold text-xs py-3 rounded-xl shadow-lg text-center transition-colors flex items-center justify-center gap-1"
                >
                  Apply Loan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

          {/* Amortization Table */}
          {showSchedule && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-left">
              <div className="flex justify-between items-center">
                <h4 className="font-display font-extrabold text-lg text-primary flex items-center gap-2">
                  <Table className="w-5 h-5 text-secondary" /> Monthly Amortization Table
                </h4>
                <button 
                  onClick={() => setShowSchedule(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Hide Table
                </button>
              </div>

              <div className="overflow-x-auto max-h-[400px] border border-slate-200 rounded-xl custom-scrollbar bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-3 px-4">Month</th>
                      <th className="py-3 px-4">EMI Installment</th>
                      <th className="py-3 px-4">Principal Paid</th>
                      <th className="py-3 px-4">Interest Paid</th>
                      <th className="py-3 px-4">Outstanding Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedule.map((row) => (
                      <tr key={row.month} className="hover:bg-slate-50 transition-colors text-slate-700">
                        <td className="py-2.5 px-4 font-bold">{row.month}</td>
                        <td className="py-2.5 px-4">₹{row.emi.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-4 text-green-600">₹{row.principal.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-4 text-red-500">₹{row.interest.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-4 font-semibold">₹{row.balance.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
};
