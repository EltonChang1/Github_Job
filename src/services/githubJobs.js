import { PAGE_SIZE } from '../constants';

const SAMPLE_JOBS = [
  {
    id: 'sample-1',
    title: 'Frontend Engineer',
    company: 'Demo Corp',
    type: 'Full Time',
    location: 'Remote',
    url: 'https://github.com',
  },
  {
    id: 'sample-2',
    title: 'React Developer',
    company: 'Example Labs',
    type: 'Contract',
    location: 'New York',
    url: 'https://github.com',
  },
];

const normalizeJob = (job) => ({
  id: String(job.id || crypto.randomUUID()),
  title: job.title || 'Untitled role',
  company: job.company_name || job.company || 'Unknown company',
  type: job.job_type || job.type || '',
  location: job.candidate_required_location || job.location || '',
  url: job.url || 'https://github.com',
  description: job.description || '',
});

const toQuery = (filters) => {
  const params = new URLSearchParams();
  if (filters.description) params.set('search', filters.description);
  return params.toString();
};

const matchesFilters = (job, filters) => {
  const descriptionHaystack = `${job.title} ${job.company}`.toLowerCase();
  const locationHaystack = (job.location || '').toLowerCase();
  const typeHaystack = (job.type || '').toLowerCase();

  const matchesDescription = filters.description
    ? descriptionHaystack.includes(filters.description.toLowerCase())
    : true;

  const matchesLocation = filters.location
    ? locationHaystack.includes(filters.location.toLowerCase())
    : true;

  const matchesType = filters.fullTimeOnly
    ? typeHaystack.includes('full')
    : true;

  return matchesDescription && matchesLocation && matchesType;
};

const paginateJobs = (jobs, page) => {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageJobs = jobs.slice(start, end);

  return {
    jobs: pageJobs,
    hasMore: end < jobs.length,
  };
};

export async function searchJobs(filters, page) {
  const query = toQuery(filters);
  const endpoint = `https://remotive.com/api/remote-jobs?${query}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    const data = await response.json();
    if (!Array.isArray(data.jobs)) {
      throw new Error('Invalid jobs response');
    }

    const normalized = data.jobs
      .map(normalizeJob)
      .filter((job) => matchesFilters(job, filters));

    return paginateJobs(normalized, page);
  } catch {
    const fallback = SAMPLE_JOBS
      .map(normalizeJob)
      .filter((job) => matchesFilters(job, filters));

    return paginateJobs(fallback, page);
  }
}
