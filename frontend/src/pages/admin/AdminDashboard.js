import React, { useState, useEffect } from 'react';
import { FiPackage, FiMousePointer, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { formatNumber, formatDate, getPlatformColor, getPlatformLabel } from '../../utils/helpers';
import { StatSkeleton } from '../../components/Skeleton';
import api from '../../utils/api';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-[#1e1b2e] rounded-2xl p-6 border border-white/5 hover:border-orange-500/20 transition-colors">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
    {sub && <div className="text-xs text-slate-600 mt-1">{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/dashboard-stats'),
      api.get('/analytics/top-products?limit=5')
    ]).then(([statsRes, topRes]) => {
      setStats(statsRes.data.data);
      setTopProducts(topRes.data.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-bold text-white mb-6">Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <StatSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FiPackage}
          label="Total Products"
          value={formatNumber(stats?.totalProducts || 0)}
          sub={`${stats?.activeProducts || 0} active`}
          color="bg-blue-500/15 text-blue-400"
        />
        <StatCard
          icon={FiMousePointer}
          label="Total Clicks"
          value={formatNumber(stats?.totalClicks || 0)}
          sub="Affiliate clicks"
          color="bg-orange-500/15 text-orange-400"
        />
        <StatCard
          icon={FiTrendingUp}
          label="Categories"
          value={stats?.categoryCounts?.length || 0}
          sub="Product categories"
          color="bg-purple-500/15 text-purple-400"
        />
        <StatCard
          icon={FiActivity}
          label="Platforms"
          value={stats?.platformCounts?.length || 0}
          sub="Affiliate platforms"
          color="bg-green-500/15 text-green-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-[#1e1b2e] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm">Top Performing Products</h2>
            <span className="text-xs text-slate-500">By clicks</span>
          </div>
          <div className="divide-y divide-white/5">
            {topProducts.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-8">No data yet</p>
            ) : topProducts.map((product, index) => (
              <div key={product._id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors">
                <span className="text-lg font-bold text-slate-700 w-6 text-center">
                  {index + 1}
                </span>
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-10 h-10 rounded-lg object-cover bg-[#151322]"
                  onError={e => { e.target.style.display='none'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate font-medium">{product.productName}</p>
                  <p className="text-xs text-slate-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-orange-400">{formatNumber(product.clicks)}</div>
                  <div className="text-xs text-slate-600">clicks</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-[#1e1b2e] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h2 className="font-semibold text-white text-sm">Category Breakdown</h2>
          </div>
          <div className="p-5 space-y-3">
            {(stats?.categoryCounts || []).slice(0, 8).map(cat => {
              const pct = stats?.totalProducts ? Math.round((cat.count / stats.totalProducts) * 100) : 0;
              return (
                <div key={cat._id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{cat._id}</span>
                    <span className="text-slate-500">{cat.count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-[#1e1b2e] rounded-2xl border border-white/5 overflow-hidden lg:col-span-2">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm">Recently Added</h2>
            <a href="/admin/products" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr>
                  <th className="text-left">Product</th>
                  <th className="text-left hidden sm:table-cell">Category</th>
                  <th className="text-left hidden md:table-cell">Platform</th>
                  <th className="text-right">Clicks</th>
                  <th className="text-right hidden sm:table-cell">Added</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentProducts || []).map(product => (
                  <tr key={product._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt={product.productName}
                          className="w-9 h-9 rounded-lg object-cover bg-[#151322] flex-shrink-0"
                          onError={e => { e.target.style.display='none'; }} />
                        <span className="text-sm text-slate-200 truncate max-w-[160px] font-medium">{product.productName}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="text-xs text-slate-400">{product.category}</span>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPlatformColor(product.platform)}`}>
                        {getPlatformLabel(product.platform)}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="text-sm font-semibold text-orange-400">{formatNumber(product.clicks)}</span>
                    </td>
                    <td className="text-right hidden sm:table-cell">
                      <span className="text-xs text-slate-500">{formatDate(product.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
