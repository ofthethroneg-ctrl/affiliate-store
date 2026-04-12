import React, { useState } from 'react';
import { FiSearch, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ onSearch, searchValue, onCategoryChange, selectedCategory, categories }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue || '');

  const handleSearch = (e) => {
    setLocalSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f0d1a]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="text-white" size={16} />
            </div>
            <span className="font-display text-lg font-bold gradient-text hidden sm:block">ShopElite</span>
          </a>

          {/* Search bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={localSearch}
                onChange={handleSearch}
                placeholder="Search products..."
                className="w-full bg-[#1e1b2e] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Desktop category pills */}
          <nav className="hidden lg:flex items-center gap-1">
            {['All', ...categories.slice(0, 4)].map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat === 'All' ? 'all' : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  (cat === 'All' && selectedCategory === 'all') || cat === selectedCategory
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden py-3 border-t border-white/5 flex flex-wrap gap-2 pb-4">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => { onCategoryChange(cat === 'All' ? 'all' : cat); setMenuOpen(false); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  (cat === 'All' && selectedCategory === 'all') || cat === selectedCategory
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;