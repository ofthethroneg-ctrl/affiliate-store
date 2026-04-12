import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useProducts({ page = 1, limit = 12, category = 'all', search = '', sort = '-createdAt', active = true } = {}) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        sort,
        active: active ? 'true' : 'false',
        ...(category !== 'all' && { category }),
        ...(search && { q: search }),
      };
      const res = await api.get('/products', { params });
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, limit, category, search, sort, active]);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, pagination, loading, error, refetch: fetch };
}
