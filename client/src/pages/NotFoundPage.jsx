import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 mx-auto flex items-center justify-center font-extrabold text-2xl">
          404
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          Page Not Found
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The requested page could not be located on the Nexora corporate financial ledger.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
