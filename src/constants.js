export const PAGE_SIZE = 15;

export const INITIAL_FILTERS = {
  description: '',
  location: '',
  fullTimeOnly: false,
  categories: ['software', 'data-science', 'ml'], // Filter to tech jobs only
};

export const JOB_CATEGORIES = [
  { id: 'software', label: 'Software Engineering / CS' },
  { id: 'data-science', label: 'Data Science' },
  { id: 'ml', label: 'Machine Learning / AI' },
];
