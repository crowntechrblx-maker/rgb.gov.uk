import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

export const TaxCalculator = () => {
  const [revenue, setRevenue] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [result, setResult] = useState<any>(null);

  const calculateTax = (e: React.FormEvent) => {
    e.preventDefault();
    const profit = Math.max(0, revenue - expenses);
    // Simple mock UK tax calculation logic
    const allowance = 12570;
    const taxable = Math.max(0, profit - allowance);
    const tax = taxable * 0.20; // 20% basic rate
    
    setResult({
      profit,
      taxable,
      tax,
      net: profit - tax
    });
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-gds-blue text-white py-12">
        <div className="govuk-width-container">
          <Link to="/" className="text-sm border-b border-white hover:border-transparent transition-all mb-8 inline-block opacity-70">
            Back to GOV.UK
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <Calculator className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Self-Employed Tax Estimator</h1>
          </div>
          <p className="text-xl max-w-2xl opacity-90">
            Estimate how much Income Tax and National Insurance you might need to pay if you're self-employed.
          </p>
        </div>
      </div>

      <div className="govuk-width-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gds-grey p-8 border-t-8 border-gds-black h-fit">
            <h2 className="text-2xl font-bold mb-6">Enter your details</h2>
            <form onSubmit={calculateTax} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold">Total annual business income</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold">£</span>
                  <input 
                    type="number"
                    className="w-full border-2 border-gds-black p-2 pl-8 focus:ring-4 focus:ring-gds-yellow outline-none"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold">Allowable business expenses</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold">£</span>
                  <input 
                    type="number"
                    className="w-full border-2 border-gds-black p-2 pl-8 focus:ring-4 focus:ring-gds-yellow outline-none"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="bg-gds-black text-white px-8 py-3 font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                Calculate estimate <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 bg-blue-50 p-6 flex gap-4 items-start border-l-4 border-gds-blue">
              <Info className="w-6 h-6 text-gds-blue shrink-0" />
              <p className="text-sm text-gds-blue italic">
                This is only an estimate based on current tax year rates. You'll get an accurate figure when you file your Self Assessment tax return.
              </p>
            </div>
          </div>

          <div className="relative">
            {result ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border-4 border-gds-black p-8 shadow-[8px_8px_0_#0b0c0c]"
              >
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-gds-green" />
                  Your Estimate
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-lg">Total Profit</span>
                    <span className="text-2xl font-bold">£{result.profit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <span className="text-lg">Taxable Income</span>
                    <span className="text-xl font-bold">£{result.taxable.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-6 bg-gds-grey px-4">
                    <span className="text-xl font-bold">Estimated Tax Due</span>
                    <span className="text-3xl font-bold text-red-600">£{result.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 font-bold border-t-2 border-gds-black mt-4">
                    <span className="text-xl">Net Income</span>
                    <span className="text-2xl">£{result.net.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="font-bold mb-4">What's next?</h3>
                  <ul className="space-y-4">
                    <li>
                      <Link to="/guides/set-up-business" className="text-gds-blue underline font-bold flex items-center gap-2">
                        How to register for Self Assessment <ChevronRight className="w-4 h-4" />
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="text-gds-blue underline font-bold flex items-center gap-2">
                        View allowable business expenses <ChevronRight className="w-4 h-4" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 border-4 border-dashed border-gray-200">
                <div className="text-center text-gray-400">
                  <Calculator className="w-20 h-20 mx-auto mb-4 opacity-20" />
                  <p className="text-xl font-bold">Results will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
