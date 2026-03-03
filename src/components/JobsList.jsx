import JobCard from './JobCard';

function JobsList({ jobs, loading, error }) {
  if (loading) {
    return <section className="panel">Loading jobs...</section>;
  }

  if (error) {
    return <section className="panel error">{error}</section>;
  }

  if (jobs.length === 0) {
    return <section className="panel">No jobs found for this search.</section>;
  }

  return (
    <section className="jobs-grid">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </section>
  );
}

export default JobsList;
