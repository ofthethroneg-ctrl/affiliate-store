import React, { useState } from 'react';
import { FiShoppingBag, FiExternalLink } from 'react-icons/fi';
import { formatPrice, getPlatformColor, getPlatformLabel } from '../utils/helpers';

const ProductCard = ({ product }) => {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ FIX: Handle image URL properly (local + production)
  const getImageUrl = (url) => {
    if (!url) return "";

    // If already full URL (Cloudinary / Amazon / etc.)
    if (url.startsWith("http")) return url;

    // Backend base URL
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    return `${BASE_URL}${url}`;
  };

  // ✅ BUY BUTTON LOGIC
  const onBuyNow = () => {
    setLoading(true);

    let link = product.affiliateLink;

    // 🔥 Fix Flipkart short links
    if (link && link.includes("dl.flipkart.com")) {
      link = link.replace("dl.flipkart.com/dl", "www.flipkart.com");
    }

    console.log("Opening link:", link);

    setTimeout(() => {
      window.location.href = link;
      setLoading(false);
    }, 300);
  };

  return (
    <div className="product-card group relative bg-[#1e1b2e] rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-300">

      {/* Discount badge */}
      {product.discount && (
        <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{product.discount}%
        </div>
      )}

      {/* Platform badge */}
      <div className={`absolute top-3 right-3 z-10 text-xs font-bold px-2 py-1 rounded-full capitalize ${getPlatformColor(product.platform)}`}>
        {getPlatformLabel(product.platform)}
      </div>

      {/* Image */}
      <div className="relative overflow-hidden bg-[#151322] aspect-square">
        {!imgError ? (
          <img
            src={getImageUrl(product.imageUrl)}   // ✅ FIXED HERE
            alt={product.productName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <FiShoppingBag size={48} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">

        {/* Category */}
        <p className="text-xs text-orange-400/80 font-medium mb-1 uppercase tracking-wide">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2 mb-3 min-h-[2.5rem]">
          {product.productName}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          {product.price && (
            <span className="text-lg font-bold text-white">
              {formatPrice(product.price)}
            </span>
          )}
          {product.originalPrice && product.originalPrice !== product.price && (
            <span className="text-sm text-slate-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Buy Now Button */}
        <button
          onClick={onBuyNow}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FiExternalLink size={14} />
              Buy Now
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default ProductCard;