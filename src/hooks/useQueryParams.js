import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { INITIAL_FILTERS } from '../constants';

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Read from URL on mount
  useEffect(() => {
    const description = searchParams.get('description') || '';
    const location = searchParams.get('location') || '';
    const fullTimeOnly = searchParams.get('fullTimeOnly') === 'true';
    const pageNum = parseInt(searchParams.get('page') || '1', 10);

    setFilters({ description, location, fullTimeOnly });
    setPage(Math.max(1, pageNum));
    setIsInitialized(true);
  }, []);

  // Write to URL when state changes
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (filters.description) params.set('description', filters.description);
    if (filters.location) params.set('location', filters.location);
    if (filters.fullTimeOnly) params.set('fullTimeOnly', 'true');
    if (page > 1) params.set('page', String(page));

    setSearchParams(params, { replace: true });
  }, [filters, page, isInitialized, setSearchParams]);

  return {
    filters,
    setFilters,
    page,
    setPage,
  };
}
