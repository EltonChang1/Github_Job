import { PAGE_SIZE } from '../constants';

// Helper to clean HTML and make descriptions human-readable
const cleanDescription = (description) => {
  if (!description) return '';
  
  let cleaned = description;
  
  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, ' ');
  
  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Remove control characters and non-printable characters
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Check if description is mostly garbage (high ratio of non-alphanumeric)
  const alphanumeric = cleaned.replace(/[^a-zA-Z0-9]/g, '').length;
  const total = cleaned.length;
  if (total > 0 && alphanumeric / total < 0.5) {
    return ''; // Likely garbage
  }
  
  return cleaned;
};

// Helper to validate job quality
const isValidJob = (job) => {
  // Must have basic fields
  if (!job.title || !job.company) return false;
  
  // Title should be reasonable length
  if (job.title.length > 200 || job.title.length < 3) return false;
  
  // Company name should be reasonable
  if (job.company.length > 100 || job.company.length < 2) return false;
  
  // Description should exist and be readable
  const cleanedDesc = cleanDescription(job.description);
  if (!cleanedDesc || cleanedDesc.length < 50) return false;
  
  // Check for spam indicators
  const spamWords = /\b(click here|buy now|free money|earn \$\$\$|work from home scam)\b/i;
  if (spamWords.test(job.title) || spamWords.test(cleanedDesc)) return false;
  
  return true;
};

const SAMPLE_JOBS = [
  {
    id: 'sample-1',
    title: 'Senior Machine Learning Engineer',
    company: 'AI Innovations Inc',
    type: 'Full Time',
    location: 'Remote',
    url: 'https://github.com',
    salary: '$140k - $180k',
    category: 'ml',
    description: '## About the role\n\nWe are looking for a talented ML Engineer to build cutting-edge AI models...',
  },
  {
    id: 'sample-2',
    title: 'Data Scientist',
    company: 'Analytics Labs',
    type: 'Full Time',
    location: 'New York',
    url: 'https://github.com',
    salary: '$120k - $160k',
    category: 'data-science',
    description: '## Job Description\n\nJoin our team as a Data Scientist to analyze complex datasets and drive insights...',
  },
  {
    id: 'sample-3',
    title: 'Full Stack Software Engineer',
    company: 'Tech Startup Inc',
    type: 'Full Time',
    location: 'San Francisco, CA',
    url: 'https://github.com',
    salary: '$100k - $150k',
    category: 'software',
    description: '## What you will do\n\nBuild scalable web applications using modern technologies...',
  },
  {
    id: 'sample-4',
    title: 'Computer Vision Engineer',
    company: 'Vision AI Corp',
    type: 'Full Time',
    location: 'Remote',
    url: 'https://github.com',
    salary: '$130k - $170k',
    category: 'ml',
    description: '## Role\n\nDevelop state-of-the-art computer vision models for real-world applications...',
  },
  {
    id: 'sample-5',
    title: 'Backend Software Engineer',
    company: 'Cloud Services Ltd',
    type: 'Full Time',
    location: 'Austin, TX',
    url: 'https://github.com',
    salary: '$110k - $145k',
    category: 'software',
    description: '## About Us\n\nBuild distributed systems and microservices at scale...',
  },
  {
    id: 'sample-6',
    title: 'Data Engineer',
    company: 'Big Data Solutions',
    type: 'Full Time',
    location: 'Remote',
    url: 'https://github.com',
    salary: '$115k - $155k',
    category: 'data-science',
    description: '## Position\n\nDesign and maintain data pipelines for large-scale analytics...',
  },
];

const normalizeJob = (job, source = 'unknown') => {
  const cleanedDescription = cleanDescription(job.description || '');
  
  return {
    id: String(job.id || crypto.randomUUID()),
    title: (job.title || 'Untitled role').trim(),
    company: (job.company_name || job.company || 'Unknown company').trim(),
    type: job.job_type || job.type || 'Full Time',
    location: job.candidate_required_location || job.location || 'Remote',
    url: job.url || job.apply_url || 'https://github.com',
    description: cleanedDescription,
    how_to_apply: job.how_to_apply || '',
    salary: job.salary || '',
    publication_date: job.publication_date || job.created_at || new Date().toISOString(),
    tags: job.tags || [],
    category: job.category || inferCategory({ ...job, description: cleanedDescription }),
    source: source, // Track where the job came from
  };
};

const inferCategory = (job) => {
  const text = `${job.title || ''} ${job.description || ''} ${(job.tags || []).join(' ')}`.toLowerCase();
  
  // Machine Learning / AI keywords
  if (text.match(/\b(machine learning|ml|deep learning|ai|artificial intelligence|neural network|nlp|computer vision|pytorch|tensorflow)\b/i)) {
    return 'ml';
  }
  
  // Data Science keywords
  if (text.match(/\b(data scien|data analy|data engineer|big data|analytics|tableau|power bi|sql|pandas|numpy|statistics)\b/i)) {
    return 'data-science';
  }
  
  // Software Engineering keywords (default for tech jobs)
  if (text.match(/\b(software|developer|engineer|frontend|backend|full stack|web|mobile|devops|cloud|javascript|python|java|react|node)\b/i)) {
    return 'software';
  }
  
  return null; // Will be filtered out
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

  // Only show CS/DS/ML jobs - filter out jobs without a valid category
  const hasValidCategory = job.category && ['software', 'data-science', 'ml'].includes(job.category);
  if (!hasValidCategory) return false;

  // Filter by selected categories
  const matchesCategory = (filters.categories && filters.categories.length > 0)
    ? filters.categories.includes(job.category)
    : true;

  return matchesDescription && matchesLocation && matchesType && matchesCategory;
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

// Fetch jobs from Remotive API
async function fetchRemotiveJobs(searchTerm) {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    
    const response = await fetch(`https://remotive.com/api/remote-jobs?${params}`);
    if (!response.ok) throw new Error('Remotive API failed');
    
    const data = await response.json();
    if (!Array.isArray(data.jobs)) return [];
    
    return data.jobs
      .map(job => normalizeJob(job, 'remotive'))
      .filter(isValidJob);
  } catch (error) {
    console.warn('Remotive API error:', error.message);
    return [];
  }
}

// Fetch jobs from Arbeitnow API (free, no auth)
async function fetchArbeitnowJobs(searchTerm) {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    
    const response = await fetch(`https://www.arbeitnow.com/api/job-board-api?${params}`);
    if (!response.ok) throw new Error('Arbeitnow API failed');
    
    const data = await response.json();
    if (!Array.isArray(data.data)) return [];
    
    return data.data
      .map(job => normalizeJob({
        id: job.slug,
        title: job.title,
        company: job.company_name,
        location: job.location,
        type: job.job_types?.[0] || 'Full Time',
        url: job.url,
        description: job.description,
        created_at: job.created_at,
        tags: job.tags || [],
      }, 'arbeitnow'))
      .filter(isValidJob);
  } catch (error) {
    console.warn('Arbeitnow API error:', error.message);
    return [];
  }
}

// Fetch jobs from The Muse API (free tier)
async function fetchTheMuseJobs(searchTerm) {
  try {
    const params = new URLSearchParams({
      page: '0',
      descending: 'true',
    });
    if (searchTerm) params.set('category', searchTerm);
    
    const response = await fetch(`https://www.themuse.com/api/public/jobs?${params}`);
    if (!response.ok) throw new Error('The Muse API failed');
    
    const data = await response.json();
    if (!Array.isArray(data.results)) return [];
    
    return data.results
      .map(job => normalizeJob({
        id: job.id,
        title: job.name,
        company: job.company?.name || 'Unknown',
        location: job.locations?.[0]?.name || 'Remote',
        type: job.type || 'Full Time',
        url: job.refs?.landing_page || '',
        description: job.contents || '',
        publication_date: job.publication_date,
        tags: job.categories?.map(c => c.name) || [],
      }, 'themuse'))
      .filter(isValidJob);
  } catch (error) {
    console.warn('The Muse API error:', error.message);
    return [];
  }
}

// Deduplicate jobs by title + company (similar jobs from different sources)
function deduplicateJobs(jobs) {
  const seen = new Map();
  const unique = [];
  
  for (const job of jobs) {
    const key = `${job.title.toLowerCase().trim()}_${job.company.toLowerCase().trim()}`;
    
    if (!seen.has(key)) {
      seen.set(key, true);
      unique.push(job);
    }
  }
  
  return unique;
}

// Main search function - aggregates from all sources
export async function searchJobs(filters, page) {
  const searchTerm = filters.description || '';
  
  try {
    // Fetch from all sources in parallel
    const [remotive, arbeitnow, themuse] = await Promise.all([
      fetchRemotiveJobs(searchTerm),
      fetchArbeitnowJobs(searchTerm),
      fetchTheMuseJobs(searchTerm),
    ]);
    
    // Merge all jobs
    let allJobs = [...remotive, ...arbeitnow, ...themuse];
    
    // Deduplicate
    allJobs = deduplicateJobs(allJobs);
    
    // Apply client-side filters
    const filtered = allJobs.filter((job) => matchesFilters(job, filters));
    
    // Sort by publication date (newest first)
    filtered.sort((a, b) => 
      new Date(b.publication_date || 0) - new Date(a.publication_date || 0)
    );
    
    // If we got results, return them
    if (filtered.length > 0) {
      return paginateJobs(filtered, page);
    }
    
    // Fallback to sample jobs if no results
    throw new Error('No jobs found from APIs');
    
  } catch (error) {
    console.warn('All APIs failed, using sample jobs:', error.message);
    
    // Fallback to sample jobs
    const fallback = SAMPLE_JOBS
      .map(job => normalizeJob(job, 'sample'))
      .filter((job) => matchesFilters(job, filters));

    return paginateJobs(fallback, page);
  }
}
