import React, { useState } from 'react';
import { FiX, FiPlus, FiTrash2, FiUpload, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import helpers from "../utils/helpers";
import api from "../utils/api";

const EMPTY_ROW = () => ({
  id: Date.now() + Math.random(),
  productName: '',
  imageUrl: '',
  affiliateLink: '',
  category: '',
  price: '',
  originalPrice: '',
  discount: '',
});

export default function BulkImportModal({ onClose, onSaved }) {
  const [rows, setRows] = useState([EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW()]);
  const [loading, setLoading] = useState(false);
  const [rowErrors, setRowErrors] = useState({});

  const updateRow = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    // clear error
    setRowErrors(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const addRow = () => setRows(prev => [...prev, EMPTY_ROW()]);

  const removeRow = (id) => {
    if (rows.length === 1) return;
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const validate = () => {
    const errors = {};
    rows.forEach(row => {
      const rowErrs = [];
      if (!row.productName.trim()) rowErrs.push('Name required');
      if (!row.imageUrl.trim()) rowErrs.push('Image URL required');
      if (!row.affiliateLink.trim()) rowErrs.push('Affiliate link required');
      if (!row.category) rowErrs.push('Category required');
      if (rowErrs.length) errors[row.id] = rowErrs.join(', ');
    });
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setRowErrors(errors);
      toast.error('Please fix errors before submitting');
      return;
    }

    setLoading(true);
    try {
      const products = rows.map(({ id, ...rest }) => ({
        productName: rest.productName.trim(),
        imageUrl: rest.imageUrl.trim(),
        affiliateLink: rest.affiliateLink.trim(),
        category: rest.category,
        ...(rest.price && { price: Number(rest.price) }),
        ...(rest.originalPrice && { originalPrice: Number(rest.originalPrice) }),
        ...(rest.discount && { discount: Number(rest.discount) }),
      }));

      const res = await api.post('/products/bulk', { products });
      toast.success(`${res.data.data.length} products imported successfully!`);
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Bulk import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#1e1b2e] rounded-2xl border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div>
            <h2 className="font-semibold text-white">Bulk Import Products</h2>
            <p className="text-xs text-slate-500 mt-0.5">Add multiple products using direct image URLs</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 p-4">
          <table className="w-full text-xs" style={{ minWidth: 900 }}>
            <thead>
              <tr className="text-left">
                {['#', 'Product Name *', 'Image URL *', 'Affiliate Link *', 'Category *', 'Price ₹', 'MRP ₹', 'Discount %', ''].map((h, i) => (
                  <th key={i} className="px-2 py-2 text-slate-500 font-semibold uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-2">
              {rows.map((row, idx) => (
                <React.Fragment key={row.id}>
                  <tr className={rowErrors[row.id] ? 'bg-red-500/5' : ''}>
                    <td className="px-2 py-1.5 text-slate-600 font-mono">{idx + 1}</td>
                    <td className="px-2 py-1.5">
                      <input
                        value={row.productName}
                        onChange={e => updateRow(row.id, 'productName', e.target.value)}
                        placeholder="Product name..."
                        className="form-input text-xs py-2"
                        style={{ minWidth: 160 }}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        value={row.imageUrl}
                        onChange={e => updateRow(row.id, 'imageUrl', e.target.value)}
                        placeholder="https://..."
                        className="form-input text-xs py-2"
                        style={{ minWidth: 180 }}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        value={row.affiliateLink}
                        onChange={e => updateRow(row.id, 'affiliateLink', e.target.value)}
                        placeholder="https://amazon.in/..."
                        className="form-input text-xs py-2"
                        style={{ minWidth: 180 }}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        value={row.category}
                        onChange={e => updateRow(row.id, 'category', e.target.value)}
                        className="form-input text-xs py-2"
                        style={{ minWidth: 130 }}
                      >
                        <option value="">Select...</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="number"
                        value={row.price}
                        onChange={e => updateRow(row.id, 'price', e.target.value)}
                        placeholder="999"
                        className="form-input text-xs py-2"
                        style={{ width: 80 }}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="number"
                        value={row.originalPrice}
                        onChange={e => updateRow(row.id, 'originalPrice', e.target.value)}
                        placeholder="1999"
                        className="form-input text-xs py-2"
                        style={{ width: 80 }}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="number"
                        value={row.discount}
                        onChange={e => updateRow(row.id, 'discount', e.target.value)}
                        placeholder="50"
                        min="0"
                        max="100"
                        className="form-input text-xs py-2"
                        style={{ width: 70 }}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <button
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length === 1}
                        className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-20"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </td>
                  </tr>
                  {rowErrors[row.id] && (
                    <tr>
                      <td />
                      <td colSpan={8} className="px-2 pb-2">
                        <div className="flex items-center gap-1.5 text-red-400 text-xs">
                          <FiAlertCircle size={12} />
                          {rowErrors[row.id]}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Add row button */}
          <button
            onClick={addRow}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-medium transition-all"
          >
            <FiPlus size={14} />
            Add Another Row
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 flex-shrink-0 bg-[#1a1728]">
          <p className="text-xs text-slate-500">{rows.length} product{rows.length !== 1 ? 's' : ''} ready to import</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Importing...</>
              ) : (
                <><FiUpload size={14} /> Import {rows.length} Products</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
