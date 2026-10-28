import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Play,
  TrendingUp,
  ShieldCheck,
  Zap,
  Building,
  Receipt,
  PieChart,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  Users,
  DollarSign,
  X,
  CreditCard,
  Building2,
  Percent,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeFaq, setActiveFaq] = useState(null);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(true);

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const FAQS = [
    {
      q: 'How does the AI budget optimization engine identify savings?',
      a: 'The engine continuously analyzes historical expenditure patterns, compares daily velocity against departmental budget caps, detects idle cloud computing resources, and identifies overlapping subscription licenses. It then provides transparent, actionable recommendations with estimated rupee savings.',
    },
    {
      q: 'Is our corporate financial data isolated and secure?',
      a: 'Yes. BudgetIQ uses 256-bit encryption in transit and at rest, stateless JWT authentication, and strict multi-tenant database isolation. Your financial records are only accessible to authorized members within your company.',
    },
    {
      q: 'Does BudgetIQ support Indian Rupee (INR ₹) and Indian financial cycles?',
      a: 'Absolutely. BudgetIQ is built specifically for Indian enterprises and global teams with native INR formatting (Lakhs and Crores), April–March fiscal year cycles, and Indian payment methods like UPI, Corporate Cards, and NEFT/RTGS.',
    },
    {
      q: 'Can I export reports for my CA and auditing team?',
      a: 'Yes. You can export complete transaction ledgers and executive financial reports as CSV spreadsheets or print executive PDF-formatted summaries in one click.',
    },
    {
      q: 'Can multiple team members have different permissions?',
      a: 'Yes. BudgetIQ supports Role-Based Access Control (RBAC). Admins have complete access across budgets, transactions, settings, and users, while Finance Managers focus on day-to-day transaction entry, budget planning, and audit reports.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* 1. TOP NAVBAR (Matches User Screenshot Exactly) */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between">
          {/* Logo Brand: Blue square icon with 'B' + BudgetIQ */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-blue-500/30 transition-transform group-hover:scale-105">
              B
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              BudgetIQ
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#customers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Customers
            </a>
            <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Navigation Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle light/dark theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <Link
              to="/dashboard"
              className="hidden sm:inline-block text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Dashboard
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-600/20 active:scale-95 transition-all"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Matches User Screenshot Exactly) */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        {/* Eyebrow Badge: Sparkles + AI-POWERED BUDGET INTELLIGENCE */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in zoom-in-95 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>AI-POWERED BUDGET INTELLIGENCE</span>
        </div>

        {/* Huge Bold Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
          Stop Losing Money.<br />
          Start <span className="text-blue-600 dark:text-blue-500">Optimizing</span><br />
          Budgets.
        </h1>

        {/* Subtitle Paragraph */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-9">
          BudgetIQ gives small and medium businesses a clear picture of their finances — track expenses, compare budgets, and get AI-powered recommendations to cut costs and maximize profit.
        </p>

        {/* Action Buttons: Solid Blue + Outline Demo */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <Link
            to="/register"
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/25 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>Start Free — No credit card</span>
          </Link>

          <button
            onClick={() => setShowDemoModal(true)}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border-2 border-blue-600/80 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <Play className="w-4 h-4 fill-blue-600 dark:fill-blue-400" />
            <span>Watch Demo</span>
          </button>
        </div>

        {/* Trust Badges Row (Matches User Screenshot Exactly) */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-4">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 flex items-center space-x-1.5 shadow-sm">
            <span>🏢</span>
            <span>2,400+ businesses</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 flex items-center space-x-1.5 shadow-sm">
            <span>💰</span>
            <span>₹12Cr+ savings identified</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 flex items-center space-x-1.5 shadow-sm">
            <span>📊</span>
            <span>98% uptime</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 flex items-center space-x-1.5 shadow-sm">
            <span>⚡</span>
            <span>2 min setup time</span>
          </div>
        </div>

        {/* GPT-4 powered AI sub-badge (Matches User Screenshot Exactly) */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
          <span>🤖</span>
          <span>GPT-4 powered AI</span>
        </div>
      </section>

      {/* 3. PRODUCT PREVIEW SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl p-3 bg-gradient-to-b from-blue-100/60 via-slate-100/40 to-slate-200/60 dark:from-blue-950/40 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-card">
            {/* Mockup Top Header */}
            <div className="h-11 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs text-slate-400 ml-2 font-mono">app.budgetiq.com/dashboard</span>
              </div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">Live Dashboard Preview</div>
            </div>

            {/* Dashboard Mockup Body */}
            <div className="p-6 space-y-6">
              {/* Mini Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Budget Cap</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">₹31,95,000</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Actual Expenses</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">₹23,88,000</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Savings</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹2,62,000</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Utilization</span>
                  <span className="text-xl font-bold text-blue-600">74.7% (Healthy)</span>
                </div>
              </div>

              {/* Recommendation Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold block">Smart Optimization Insight Available</span>
                    <span className="text-slate-300">Convert idle AWS r6g.2xlarge cloud compute instances to save ₹55,000/month.</span>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shrink-0 text-center"
                >
                  Apply Fix
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES SECTION */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Modern Enterprise Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
              Everything your business needs to stay profitable
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
              Eliminate budget guesswork with real-time financial tracking, departmental accountability, and rule-based savings recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Expense Management Ledger
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Log corporate outflows in INR, attach invoice bills/receipts, tag payment methods (UPI, Cards, Bank Transfers), and export clean CSVs anytime.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Multi-Department Budget Caps
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Set monthly limits for Tech, Marketing, HR, Ops, and Sales. Automated threshold alerts trigger at 80%, 90%, and 100% capacity to prevent overspending.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Smart Optimization Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Detects runaway burn rates, idle compute subscriptions, and underutilized budget surplus. Offers transparent one-click fixes to adjust allocations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Executive Financial Reports
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Generate audit-ready reports comparing planned vs actual spend, category distribution, and operating savings margins with native printable styles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Role-Based Multi-Tenancy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Admin and Finance Manager roles allow collaborative budget approvals while safeguarding sensitive business settings and financial records.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Zero-Config Deployment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Built with React, Vite, Node, and Mongoose. Ready for immediate deployment to Vercel and Render with zero-friction database auto-provisioning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMERS & SOCIAL PROOF */}
      <section id="customers" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Trusted Nationwide
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Loved by fast-scaling Indian startups & CFOs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 italic mb-4">
              "BudgetIQ flagged ₹1.8 Lakhs in duplicate software licenses and idle AWS instances within our first 30 days. It paid for itself in week one."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                AK
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Arun Kulkarni</h4>
                <p className="text-[10px] text-slate-400">VP Finance, ScaleEdge Cloud</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 italic mb-4">
              "The department threshold alert system stopped our digital ad campaigns from overspending by ₹3.5 Lakhs at month-end. Game changer."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                SM
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sneha Mukhopadhyay</h4>
                <p className="text-[10px] text-slate-400">Chief of Staff, Zenta Logistics</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 italic mb-4">
              "Clean Indian Rupee formatting, straightforward planned vs actual charts, and quick CSV reports our auditors can directly inspect without friction."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-xs">
                RJ
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Rohan Jha</h4>
                <p className="text-[10px] text-slate-400">Director, FinPulse Technologies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSPARENT PRICING */}
      <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Clear & Predictable
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Plans that scale with your runway
            </h2>
            <div className="flex items-center justify-center space-x-3 mt-6">
              <span className={`text-xs font-medium ${!annualBilling ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}>
                Monthly Billing
              </span>
              <button
                onClick={() => setAnnualBilling(!annualBilling)}
                className="w-12 h-6 rounded-full bg-blue-600 p-0.5 transition-colors relative"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    annualBilling ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-medium ${annualBilling ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}>
                Annual Billing <span className="text-emerald-600 font-bold">(Save 20%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">For bootstrapped teams getting organized.</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹0</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Up to 2 Departments</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>50 Monthly Transactions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Core Dashboard Charts</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 block text-center py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Growth (Most Popular) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-600 shadow-xl relative flex flex-col justify-between">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Growth</h3>
                <p className="text-xs text-slate-400 mt-1">Full budget intelligence for scaling startups.</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {annualBilling ? '₹1,999' : '₹2,499'}
                  </span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Unlimited Departments & Budgets</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Unlimited Transactions & Invoices</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Smart Optimization Engine Insights</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Threshold Alerts (80%, 90%, 100%)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>CSV & Printable Executive Reports</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 block text-center py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Enterprise</h3>
                <p className="text-xs text-slate-400 mt-1">Multi-entity corporate governance.</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {annualBilling ? '₹5,999' : '₹7,499'}
                  </span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Everything in Growth</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Multi-Entity Consolidation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Dedicated Financial Architect</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>99.9% Enterprise SLA</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="mt-8 block text-center py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Contact Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-card transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full py-4 px-5 text-left flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. BOTTOM CALL TO ACTION (CTA) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 sm:p-12 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to eliminate corporate budget waste?
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Join over 2,400+ forward-thinking businesses tracking live expenses, setting department caps, and recovering capital with BudgetIQ.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-blue-700 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Start Free — Instant Setup
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs rounded-xl border border-blue-400/40 transition-all"
              >
                Open Demo Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-10 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              B
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">BudgetIQ</span>
            <span>— Financial Optimization & Corporate Intelligence</span>
          </div>
          <div>© {new Date().getFullYear()} BudgetIQ Technologies. All rights reserved.</div>
        </div>
      </footer>

      {/* Video Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              BudgetIQ Interactive Product Demo
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Watch how our rule-based AI engine detects runaway expenses and optimizes departmental budgets.
            </p>
            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
              <video
                src="/budget_optimizer_flow_1793111165040.webp"
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Link
                to="/dashboard"
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
              >
                Try Live Interactive Dashboard →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
