import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAppliedJobs, removeAppliedJob } from '../utils/appliedJobs';

function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [sortBy, setSortBy] = useState('date'); // date, company, title
  const navigate = useNavigate();

  useEffect(() => {
    setAppliedJobs(getAppliedJobs());
  }, []);

  const handleRemove = (jobId) => {
    const updated = removeAppliedJob(jobId);
    setAppliedJobs(updated);
  };

  const getSortedJobs = () => {
    const jobs = [...appliedJobs];
    
    switch (sortBy) {
      case 'date':
        return jobs.sort((a, b) => 
          new Date(b.appliedAt) - new Date(a.appliedAt)
        );
      case 'company':
        return jobs.sort((a, b) => 
          a.company.localeCompare(b.company)
        );
      case 'title':
        return jobs.sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      default:
        return jobs;
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const sortedJobs = getSortedJobs();

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Job Search
      </button>

      <header className="applied-header">
        <h1>Applied Jobs ({appliedJobs.length})</h1>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Application Date</option>
            <option value="company">Company Name</option>
            <option value="title">Job Title</option>
          </select>
        </div>
      </header>

      {sortedJobs.length === 0 ? (
        <section className="panel">
          <p>You haven't applied to any jobs yet.</p>
          <Link to="/" className="btn-primary">Search Jobs</Link>
        </section>
      ) : (
        <section className="applied-jobs-list">
          {sortedJobs.map((job) => (
            <article key={job.id} className="applied-job-card">
              <div className="applied-job-header">
                <div>
                  <Link 
                    to={`/job/${job.id}`} 
                    state={{ job }} 
                    className="job-title-link"
                  >
                    <h3>{job.title}</h3>
                  </Link>
                  <p className="company-name">{job.company}</p>
                </div>
                <button 
                  onClick={() => handleRemove(job.id)}
                  className="remove-button"
                  title="Remove from applied list"
                >
                  ✕
                </button>
              </div>

              <div className="applied-job-meta">
                <span className="badge">{job.type || 'N/A'}</span>
                <span className="location">{job.location || 'Unknown'}</span>
                {job.salary && (
                  <span className="salary">{job.salary}</span>
                )}
              </div>

              <div className="applied-date">
                Applied on {formatDate(job.appliedAt)}
              </div>

              <div className="applied-job-actions">
                <Link 
                  to={`/job/${job.id}`} 
                  state={{ job }}
                  className="btn-secondary"
                >
                  View Details
                </Link>
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-primary"
                >
                  View Application →
                </a>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default AppliedJobs;
