import { Link } from 'react-router-dom';

function JobCard({ job }) {
  return (
    <article className="job-card">
      <div>
        <Link to={`/job/${job.id}`} state={{ job }} className="job-title-link">
          <h3>{job.title}</h3>
        </Link>
        <p className="muted">{job.company}</p>
      </div>

      <div className="job-meta">
        <span>{job.type || 'N/A'}</span>
        <span>{job.location || 'Unknown location'}</span>
      </div>

      <Link to={`/job/${job.id}`} state={{ job }} className="view-details-link">
        View details →
      </Link>
    </article>
  );
}

export default JobCard;
