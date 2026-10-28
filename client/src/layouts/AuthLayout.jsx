import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Sparkles, BarChart2 } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Left Column: Form Content */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
        <div>
          <Link to="/" className="inline-flex items-center space-x-2.5 mb-10 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-500/25 transition-transform group-hover:scale-105">
              B
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100">
              BudgetIQ
            </span>
          </Link>
        </div>

        <div className="w-full">
          <Outlet />
        </div>

        <div className="pt-8 text-xs text-slate-400 flex items-center justify-between">
          <span>© 2026 BudgetIQ Financial Intelligence.</span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit Bank-grade Encryption</span>
          </span>
        </div>
      </div>

      {/* Right Column: Visual Product Showcase */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-brand-900 via-navy-900 to-slate-950 p-12 text-white flex-col justify-between overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold tracking-wide border border-brand-500/30 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>Smart Budget Optimization Engine</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-lg mb-4">
            Maximize enterprise runway with intelligent expense optimization.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-md">
            Consolidate corporate department budgets, track live expenses in INR, detect burn-rate anomalies, and receive automated recommendations to eliminate unnecessary spending.
          </p>
        </div>

        {/* Floating preview cards */}
        <div className="relative z-10 space-y-4 max-w-md">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200">October 2026 Monthly Savings</span>
              <span className="text-xs font-bold text-emerald-400">+14.2% MoM</span>
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">₹12,45,000</div>
            <div className="mt-2 w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/30 flex items-center justify-center text-brand-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-white">AWS Cloud Instance Optimization</p>
              <p className="text-slate-300 text-[11px]">Identified ₹55,000 potential monthly savings</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          Trusted by over 450+ high-growth technology and financial enterprises across India.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
