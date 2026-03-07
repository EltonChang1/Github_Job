import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { addAppliedJob, isJobApplied } from '../utils/appliedJobs';

function JobCard({ job, onApplied }) {
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    setApplied(isJobApplied(job.id));
  }, [job.id]);

  const handleApply = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addAppliedJob(job);
    setApplied(true);
    if (onApplied) onApplied();
  };

  return (
    <article className="job-card">
      <div>
        <Link to={`/job/${job.id}`} state={{ job }} className="job-title-link">
          <h3>{job.title}</h3>
        </Link>
        <p className="muted">{job.company}</p>
      </div>

      <div className="job-meta">
        <span className="badge">{job.type || 'N/A'}</span>
        <span>{job.location || 'Unknown location'}</span>
        {job.salary && (
          <span className="salary-badge">{job.salary}</span>
        )}
        {job.source && (
          <span className="source-badge">{job.source}</span>
        )}
      </div>

      {job.url && (
        <a 
          href={job.url} 
          target="_blank" 
          rel="noreferrer"
          className="job-link"
        >
          View job posting →
        </a>
      )}

      <div className="job-card-actions">
        <Link to={`/job/${job.id}`} state={{ job }} className="btn-secondary">
          View Details
        </Link>
        <button 
          onClick={handleApply}
          disabled={applied}
          className={applied ? 'btn-applied' : 'btn-primary'}
        >
          {applied ? '✓ Applied' : 'Mark as Applied'}
        </button>
      </div>
    </article>
  );
}

export default JobCard;
