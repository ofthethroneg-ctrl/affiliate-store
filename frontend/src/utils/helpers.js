export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Fitness',
  'Books',
  'Toys & Games',
  'Automotive',
  'Health',
  'Grocery',
  'Jewellery',
  'Other'
];

export const PLATFORMS = ['amazon', 'flipkart', 'meesho', 'other'];

export const formatPrice = (price) => {
  if (!price) return null;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toString() || '0';
};

export const getPlatformColor = (platform) => {
  const colors = {
    amazon: 'bg-yellow-500 text-black',
    flipkart: 'bg-blue-600 text-white',
    meesho: 'bg-pink-500 text-white',
    other: 'bg-gray-600 text-white',
  };
  return colors[platform] || colors.other;
};

export const getPlatformLabel = (platform) => {
  const labels = { amazon: 'Amazon', flipkart: 'Flipkart', meesho: 'Meesho', other: 'Shop Now' };
  return labels[platform] || 'Shop Now';
};

// Deep link handler for mobile
export const handleAffiliateClick = async (product, api) => {
  try {
    const res = await api.get(`/products/${product._id}/click`);
    const { affiliateLink, platform } = res.data;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      const deepLinks = {
        amazon: `amazon://dp/${extractAmazonId(affiliateLink)}`,
        flipkart: `flipkart://browse?url=${encodeURIComponent(affiliateLink)}`,
        meesho: `meesho://open?url=${encodeURIComponent(affiliateLink)}`,
      };

      const deepLink = deepLinks[platform];
      if (deepLink) {
        const timeout = setTimeout(() => {
          window.open(affiliateLink, '_blank');
        }, 1500);

        window.location.href = deepLink;
        window.addEventListener('blur', () => clearTimeout(timeout), { once: true });
        return;
      }
    }

    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.error('Click tracking error:', err);
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
  }
};

const extractAmazonId = (url) => {
  const match = url.match(/\/dp\/([A-Z0-9]+)/i);
  return match ? match[1] : '';
};
