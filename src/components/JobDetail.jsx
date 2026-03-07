import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { addAppliedJob, isJobApplied } from '../utils/appliedJobs';

function JobDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (job) {
      setApplied(isJobApplied(job.id));
    }
  }, [job]);

  const handleApply = () => {
    if (job) {
      addAppliedJob(job);
      setApplied(true);
    }
  };

  if (!job) {
    return (
      <div className="container">
        <div className="panel error">
          <p>Job not found. The detail page requires navigation from the job list.</p>
          <button onClick={() => navigate('/')}>Back to search</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to results
      </button>

      <article className="panel job-detail">
        <header className="job-detail-header">
          <div>
            <h1>{job.title}</h1>
            <p className="company-name">{job.company}</p>
          </div>
          <button 
            onClick={handleApply}
            disabled={applied}
            className={applied ? 'btn-applied btn-large' : 'btn-primary btn-large'}
          >
            {applied ? '✓ Applied' : 'Mark as Applied'}
          </button>
        </header>

        <div className="job-detail-meta">
          <div className="meta-item">
            <strong>Type:</strong> {job.type || 'Not specified'}
          </div>
          <div className="meta-item">
            <strong>Location:</strong> {job.location || 'Not specified'}
          </div>
          {job.salary && (
            <div className="meta-item">
              <strong>Salary:</strong> {job.salary}
            </div>
          )}
          {job.source && (
            <div className="meta-item">
              <strong>Source:</strong> <span className="source-badge">{job.source}</span>
            </div>
          )}
        </div>

        <div className="job-detail-actions">
          <a href={job.url} target="_blank" rel="noreferrer" className="apply-button">
            View Job Posting →
          </a>
        </div>

        {job.description && (
          <section className="job-description">
            <h2>Description</h2>
            <div className="markdown-content">
              <ReactMarkdown>{job.description}</ReactMarkdown>
            </div>
          </section>
        )}

        {job.how_to_apply && (
          <section className="job-description">
            <h2>How to Apply</h2>
            <div className="markdown-content">
              <ReactMarkdown>{job.how_to_apply}</ReactMarkdown>
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

export default JobDetail;
