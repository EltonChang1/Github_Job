import { useEffect, useState } from 'react';
import { searchJobs } from '../services/githubJobs';

export function useJobsSearch(filters, page) {
  const [jobs, setJobs] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadJobs = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await searchJobs(filters, page);
        if (isActive) {
          setJobs(result.jobs);
          setHasMore(result.hasMore);
        }
      } catch {
        if (isActive) {
          setError('Could not load jobs right now.');
          setHasMore(false);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadJobs();

    return () => {
      isActive = false;
    };
  }, [filters, page]);

  return { jobs, hasMore, loading, error };
}
