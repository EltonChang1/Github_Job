// Utility for managing applied jobs in localStorage

const STORAGE_KEY = 'github_job_applied_jobs';

export function getAppliedJobs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addAppliedJob(job) {
  const applied = getAppliedJobs();
  
  // Don't add duplicates
  if (applied.some(j => j.id === job.id)) {
    return applied;
  }
  
  const jobWithDate = {
    ...job,
    appliedAt: new Date().toISOString(),
  };
  
  const updated = [jobWithDate, ...applied];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeAppliedJob(jobId) {
  const applied = getAppliedJobs();
  const updated = applied.filter(j => j.id !== jobId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isJobApplied(jobId) {
  const applied = getAppliedJobs();
  return applied.some(j => j.id === jobId);
}
