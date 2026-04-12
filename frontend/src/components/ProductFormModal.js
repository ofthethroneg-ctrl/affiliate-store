import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUpload, FiLink, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import helpers from "../utils/helpers";
import api from "../utils/api";

// ✅ FIX ADDED HERE
const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Fitness"
];

const PLATFORMS = ['amazon', 'flipkart', 'meesho', 'other'];

const INITIAL_FORM = {
  productName: '',
  affiliateLink: '',
  category: '',
  price: '',
  originalPrice: '',
  discount: '',
  description: '',
  tags: '',
};

export default function ProductFormModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setForm({
        productName: product.productName || '',
        affiliateLink: product.affiliateLink || '',
        category: product.category || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        discount: product.discount || '',
        description: product.description || '',
        tags: (product.tags || []).join(', '),
      });
      setImagePreview(product.imageUrl || '');
    }
  }, [product]);

  const validate = () => {
    const newErrors = {};
    if (!form.productName.trim()) newErrors.productName = 'Product name is required';
    if (!form.affiliateLink.trim()) newErrors.affiliateLink = 'Affiliate link is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!isEdit && !imageFile) newErrors.image = 'Product image is required';
    return newErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== '') formData.append(key, form[key]);
      });
      if (imageFile) formData.append('image', imageFile);

      if (isEdit) {
        await api.put(`/products/${product._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product created successfully!');
      }

      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#1e1b2e] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#1e1b2e] z-10">
          <h2 className="font-semibold text-white">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Image Upload */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">
              Product Image {!isEdit && <span className="text-red-400">*</span>}
            </label>

            <div onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl cursor-pointer ${
                errors.image ? 'border-red-500' : 'border-white/10'
              }`}>

              {imagePreview ? (
                <img src={imagePreview} className="w-full h-40 object-cover rounded-xl" />
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <FiUpload size={24} />
                  <p>Upload Image</p>
                </div>
              )}
            </div>

            <input ref={fileInputRef} type="file" onChange={handleImageChange} hidden />
            {errors.image && <p className="text-red-400 text-xs">{errors.image}</p>}
          </div>

          {/* Product Name */}
          <input name="productName" value={form.productName} onChange={handleChange} placeholder="Product Name" className="form-input" />

          {/* Affiliate Link */}
          <input name="affiliateLink" value={form.affiliateLink} onChange={handleChange} placeholder="Affiliate Link" className="form-input" />

          {/* Category */}
          <select name="category" value={form.category} onChange={handleChange} className="form-input">
            <option value="">Select category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Submit */}
          <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
            {loading ? "Saving..." : "Save Product"}
          </button>

        </form>
      </div>
    </div>
  );
}