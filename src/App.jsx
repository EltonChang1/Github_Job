import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useMemo } from 'react';
import SearchForm from './components/SearchForm';
import JobsList from './components/JobsList';
import Pagination from './components/Pagination';
import JobDetail from './components/JobDetail';
import AppliedJobs from './components/AppliedJobs';
import { useJobsSearch } from './hooks/useJobsSearch';
import { useQueryParams } from './hooks/useQueryParams';

function JobSearch() {
  const { filters, setFilters, page, setPage } = useQueryParams();
  const [sortBy, setSortBy] = useState('relevance');

  const { jobs, hasMore, loading, error } = useJobsSearch(filters, page);

  const handleSearch = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const sortedJobs = useMemo(() => {
    const jobsCopy = [...jobs];
    
    switch (sortBy) {
      case 'date':
        return jobsCopy.sort((a, b) => 
          new Date(b.publication_date || 0) - new Date(a.publication_date || 0)
        );
      case 'company':
        return jobsCopy.sort((a, b) => 
          a.company.localeCompare(b.company)
        );
      case 'title':
        return jobsCopy.sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      default:
        return jobsCopy; // relevance - keep original order
    }
  }, [jobs, sortBy]);

  return (
    <main className="container">
      <header className="header">
        <h1>Job Search Tool</h1>
        <p>Find Computer Science, Data Science, and ML opportunities</p>
      </header>

      <SearchForm
        filters={filters}
        onSearch={handleSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <JobsList
        jobs={sortedJobs}
        loading={loading}
        error={error}
      />

      <Pagination
        page={page}
        onNext={() => setPage((current) => current + 1)}
        onPrev={() => setPage((current) => Math.max(1, current - 1))}
        canGoPrev={page > 1}
        canGoNext={hasMore}
      />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobSearch />} />
        <Route path="/job/:id" element={<JobDetail />} />
        <Route path="/applied" element={<AppliedJobs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
