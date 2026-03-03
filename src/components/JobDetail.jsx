import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function JobDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;

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
          <h1>{job.title}</h1>
          <p className="company-name">{job.company}</p>
        </header>

        <div className="job-detail-meta">
          <div className="meta-item">
            <strong>Type:</strong> {job.type || 'Not specified'}
          </div>
          <div className="meta-item">
            <strong>Location:</strong> {job.location || 'Not specified'}
          </div>
        </div>

        <div className="job-detail-actions">
          <a href={job.url} target="_blank" rel="noreferrer" className="apply-button">
            Apply Now →
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
      </article>
    </div>
  );
}

export default JobDetail;
