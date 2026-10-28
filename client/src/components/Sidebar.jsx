import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Sparkles,
  BarChart3,
  Building2,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Budgets', path: '/budgets', icon: PieChart },
  {
    name: 'Optimization Engine',
    path: '/optimization',
    icon: Sparkles,
    badge: 'Smart',
  },
  { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  { name: 'Departments', path: '/departments', icon: Building2 },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => {
  const { user, business, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
    }`;

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-blue-500/30 shrink-0">
              B
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100 font-sans block">
                  BudgetIQ
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block truncate">
                  {business?.name || 'Budget Intelligence'}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse toggle button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={navLinkClass}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout block */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <div
          onClick={() => navigate('/profile')}
          className={`flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="View profile"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-brand-500/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          )}

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {user?.name}
              </div>
              {user?.email && (
                <div className="text-[10px] text-slate-400 truncate">
                  {user.email}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className={`mt-2 w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Sign out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={onCloseMobile}
        >
          <div
            className="w-64 h-full bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
