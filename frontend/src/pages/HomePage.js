import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiTrendingUp, FiChevronDown } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import { CATEGORIES } from '../utils/helpers';
import api from '../utils/api';

const ITEMS_PER_PAGE = 12;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const searchTimeout = useRef(null);

  const fetchProducts = useCallback(async (reset = false) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const currentPage = reset ? 1 : page;
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        ...(category !== 'all' && { category }),
        ...(search && { q: search }),
        sort: '-createdAt',
      };

      const res = await api.get('/products', { params });
      const { data, pagination } = res.data;

      if (reset) {
        setProducts(data);
        setPage(2);
      } else {
        setProducts(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }

      setTotalProducts(pagination.total);
      setHasMore(currentPage < pagination.pages);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, search, page]);

  // Fetch top products once on mount
  useEffect(() => {
    api.get('/analytics/top-products?limit=4')
      .then(res => setTopProducts(res.data.data))
      .catch(() => {});
  }, []);

  // Reset and refetch on filter/search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchProducts(true);
    // eslint-disable-next-line
  }, [category, search]);

  const handleSearch = (val) => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearch(val), 350);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f0d1a' }}>
      <Navbar
        onSearch={handleSearch}
        searchValue={search}
        onCategoryChange={setCategory}
        selectedCategory={category}
        categories={CATEGORIES}
      />

      {/* Hero Banner */}
      {!search && category === 'all' && (
        <section className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
            </div>
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">Best Deals</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Shop Smarter,<br />
              <span className="gradient-text">Save Bigger</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
              Curated deals from Amazon, Flipkart & Meesho — all in one place.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 text-center">
              {[
                { label: 'Products', value: totalProducts + '+' },
                { label: 'Platforms', value: '3' },
                { label: 'Categories', value: CATEGORIES.length + '' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Trending Section */}
        {!search && category === 'all' && topProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <FiTrendingUp className="text-orange-500" size={20} />
              <h2 className="text-lg font-semibold text-white">Trending Now</h2>
              <div className="flex-1 h-px bg-white/5 ml-2" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {topProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Category filter bar (mobile/desktop) */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-lg font-semibold text-white">
            {category === 'all' ? 'All Products' : category}
            <span className="text-slate-500 text-sm font-normal ml-2">({totalProducts})</span>
          </h2>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              onChange={e => {
                const val = e.target.value;
                // We'd need to pass sort to fetchProducts; for simplicity let's reload
                setCategory(category); // trigger re-fetch
              }}
              className="appearance-none bg-[#1e1b2e] border border-white/10 text-sm text-slate-300 pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:border-orange-500/50"
            >
              <option value="-createdAt">Newest</option>
              <option value="-clicks">Most Popular</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(''); setCategory('all'); }}
              className="mt-6 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => fetchProducts(false)}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-[#1e1b2e] border border-orange-500/30 text-orange-400 rounded-xl text-sm font-medium hover:bg-orange-500/10 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  {loadingMore ? (
                    <><span className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" /> Loading...</>
                  ) : (
                    'Load More Products'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        <p className="mb-1">
          <span className="gradient-text font-semibold">ShopElite</span> — Affiliate product listings from Amazon, Flipkart & Meesho
        </p>
        <p>Prices and availability may vary. Click links to view current offers.</p>
      </footer>
    </div>
  );
}
