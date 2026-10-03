"use client";

import { useState } from "react";
import { Calculator, IndianRupee, PieChart, ShieldCheck, ArrowRight } from "lucide-react";
import { calculateEMI, formatIndianCurrency } from "@/lib/utils";

interface EmiCalculatorProps {
  propertyPrice: number;
}

export default function EmiCalculator({ propertyPrice }: EmiCalculatorProps) {
  // Default loan amount: 80% of property price
  const initialLoan = Math.round(propertyPrice * 0.8);
  const [loanAmount, setLoanAmount] = useState<number>(initialLoan);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  const { monthlyEmi, totalAmount, totalInterest } = calculateEMI(
    loanAmount,
    interestRate,
    tenureYears
  );

  const principalPercent = totalAmount > 0 ? Math.round((loanAmount / totalAmount) * 100) : 50;
  const interestPercent = 100 - principalPercent;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Nagpur Home Loan EMI Calculator</h3>
            <p className="text-xs text-slate-500">
              Calculate realistic monthly repayments for this property
            </p>
          </div>
        </div>
        <div className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" /> SBI / HDFC Benchmark Rates
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loan Amount Slider */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-2">
              <span className="text-slate-700">Home Loan Amount</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                {formatIndianCurrency(loanAmount)}
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={propertyPrice > 500000 ? propertyPrice : 5000000}
              step={50000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
              <span>₹5 Lakhs</span>
              <span>80% Default ({formatIndianCurrency(initialLoan)})</span>
              <span>{formatIndianCurrency(propertyPrice)}</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-2">
              <span className="text-slate-700">Interest Rate (% p.a.)</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                {interestRate}%
              </span>
            </div>
            <input
              type="range"
              min={6.5}
              max={15.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
              <span>6.5% (Prime)</span>
              <span>8.5% (Current Avg)</span>
              <span>15.0%</span>
            </div>
          </div>

          {/* Loan Tenure Slider */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold mb-2">
              <span className="text-slate-700">Loan Tenure</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                {tenureYears} Years ({tenureYears * 12} Months)
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
              <span>5 Years</span>
              <span>20 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Calculation Output Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              Estimated Monthly Outflow
            </span>
            <div className="mt-2 mb-6">
              <span className="text-3xl sm:text-4xl font-black text-white">
                ₹{monthlyEmi.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-semibold">/ month</span>
            </div>

            {/* Split breakdown visual bar */}
            <div className="space-y-2 mb-6">
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  style={{ width: `${principalPercent}%` }}
                  className="bg-emerald-500 h-full"
                  title={`Principal: ${principalPercent}%`}
                />
                <div
                  style={{ width: `${interestPercent}%` }}
                  className="bg-amber-400 h-full"
                  title={`Interest: ${interestPercent}%`}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Principal ({principalPercent}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  Total Interest ({interestPercent}%)
                </span>
              </div>
            </div>

            {/* Detailed summary items */}
            <div className="space-y-2.5 text-xs border-t border-slate-800 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Principal Loan</span>
                <span className="font-bold text-white">{formatIndianCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Interest</span>
                <span className="font-bold text-amber-300">{formatIndianCurrency(totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
                <span className="text-white">Total Repayment</span>
                <span className="text-emerald-400">{formatIndianCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
            *Subject to bank eligibility, CIBIL score & loan approval norms.
          </div>
        </div>
      </div>
    </div>
  );
}
