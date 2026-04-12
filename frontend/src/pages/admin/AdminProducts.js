import React, { useState, useEffect, useCallback } from 'react';
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight,
  FiFilter, FiRefreshCw, FiCheckSquare, FiSquare, FiAlertTriangle, FiLayers
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { CATEGORIES, formatDate, formatNumber, formatPrice, getPlatformColor, getPlatformLabel } from '../../utils/helpers';
import { TableSkeleton } from '../../components/Skeleton';
import ProductFormModal from '../../components/ProductFormModal';
import BulkImportModal from '../../components/BulkImportModal';
import api from '../../utils/api';

const ITEMS_PER_PAGE = 10;

function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay">
      <div className="bg-[#1e1b2e] rounded-2xl border border-white/10 p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center">
            <FiAlertTriangle className="text-red-400" size={18} />
          </div>
          <h3 className="text-white font-semibold">Confirm Delete</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm font-medium transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // 'bulk' | product object
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showBulk, setShowBulk] = useState(false);

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        ...(category !== 'all' && { category }),
        ...(search && { q: search }),
        active: 'false', // show all in admin
      };
      const res = await api.get('/products', { params });
      setProducts(res.data.data);
      setPagination(res.data.pagination);
      setSelectedIds([]);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      if (deleteTarget === 'bulk') {
        await api.delete('/products/bulk', { data: { ids: selectedIds } });
        toast.success(`${selectedIds.length} products deleted`);
      } else {
        await api.delete(`/products/${deleteTarget._id}`);
        toast.success('Product deleted');
      }
      setDeleteTarget(null);
      setSelectedIds([]);
      fetchProducts(pagination.page);
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p._id));
    }
  };

  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < products.length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{pagination.total} total products</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchProducts(pagination.page)}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-colors"
            title="Refresh"
          >
            <FiRefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowBulk(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium rounded-xl transition-all"
          >
            <FiLayers size={16} />
            Bulk Import
          </button>
          <button
            onClick={() => { setEditProduct(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-xl transition-all"
          >
            <FiPlus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="form-input pl-9"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="form-input pl-9 pr-8 min-w-[160px] appearance-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 mb-4 px-4 py-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <span className="text-sm text-orange-300 font-medium">{selectedIds.length} selected</span>
          <button
            onClick={() => setDeleteTarget('bulk')}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 font-medium transition-colors ml-auto"
          >
            <FiTrash2 size={14} />
            Delete Selected
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1e1b2e] rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={8} /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-white font-medium mb-1">No products found</h3>
            <p className="text-slate-500 text-sm">Try changing your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr>
                  <th className="w-10">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                      {allSelected ? <FiCheckSquare size={16} className="text-orange-400" /> :
                        someSelected ? <FiCheckSquare size={16} className="text-orange-400/50" /> :
                        <FiSquare size={16} />}
                    </button>
                  </th>
                  <th className="text-left">Product</th>
                  <th className="text-left hidden sm:table-cell">Category</th>
                  <th className="text-left hidden md:table-cell">Platform</th>
                  <th className="text-left hidden lg:table-cell">Price</th>
                  <th className="text-right">Clicks</th>
                  <th className="text-right hidden md:table-cell">Added</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className={selectedIds.includes(product._id) ? 'bg-orange-500/5' : ''}>
                    <td>
                      <button onClick={() => toggleSelect(product._id)} className="text-slate-400 hover:text-orange-400">
                        {selectedIds.includes(product._id)
                          ? <FiCheckSquare size={16} className="text-orange-400" />
                          : <FiSquare size={16} />}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.productName}
                          className="w-10 h-10 rounded-lg object-cover bg-[#151322] flex-shrink-0"
                          onError={e => { e.target.style.display='none'; }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm text-slate-200 font-medium truncate max-w-[180px]">{product.productName}</p>
                          <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-slate-500 hover:text-orange-400 transition-colors truncate block max-w-[180px]">
                            View link ↗
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-lg">{product.category}</span>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPlatformColor(product.platform)}`}>
                        {getPlatformLabel(product.platform)}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className="text-sm text-slate-300">
                        {product.price ? formatPrice(product.price) : '—'}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="text-sm font-bold text-orange-400">{formatNumber(product.clicks)}</span>
                    </td>
                    <td className="text-right hidden md:table-cell">
                      <span className="text-xs text-slate-500">{formatDate(product.createdAt)}</span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditProduct(product); setShowForm(true); }}
                          className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/5">
            <p className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.pages} · {pagination.total} products
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchProducts(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <FiChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const p = i + Math.max(1, pagination.page - 2);
                if (p > pagination.pages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => fetchProducts(p)}
                    className={`w-8 h-8 text-xs rounded-lg font-medium transition-all ${
                      p === pagination.page
                        ? 'bg-orange-500 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => fetchProducts(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Import Modal */}
      {showBulk && (
        <BulkImportModal
          onClose={() => setShowBulk(false)}
          onSaved={() => { setShowBulk(false); fetchProducts(1); }}
        />
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editProduct}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSaved={() => { setShowForm(false); setEditProduct(null); fetchProducts(pagination.page); }}
        />
      )}

      {/* Confirm Delete Modal */}
      {deleteTarget && (
        <ConfirmModal
          message={
            deleteTarget === 'bulk'
              ? `Are you sure you want to delete ${selectedIds.length} selected products? This cannot be undone.`
              : `Are you sure you want to delete "${deleteTarget.productName}"? This cannot be undone.`
          }
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
