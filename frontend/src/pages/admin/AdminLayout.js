import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiLogOut, FiShoppingBag,
  FiMenu, FiX, FiExternalLink
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
            <FiShoppingBag className="text-white" size={16} />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-display">ShopElite</div>
            <div className="text-xs text-slate-500">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-link"
        >
          <FiExternalLink size={18} />
          View Store
        </a>
        <button onClick={handleLogout} className="sidebar-link w-full text-left hover:text-red-400">
          <FiLogOut size={18} />
          Logout
        </button>
        {/* Admin info */}
        <div className="flex items-center gap-3 px-4 py-3 mt-2 bg-white/5 rounded-xl">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 font-bold text-sm">
            {admin?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-300 truncate">{admin?.name}</div>
            <div className="text-xs text-slate-500 truncate">{admin?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0f0d1a' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-[#0f0d1a] border-r border-white/5 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0f0d1a] border-r border-white/5 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-white/5 bg-[#0f0d1a] flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <FiMenu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:block">{admin?.email}</span>
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 font-bold text-sm">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
