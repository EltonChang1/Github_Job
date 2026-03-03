import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import JobsList from './components/JobsList';
import Pagination from './components/Pagination';
import JobDetail from './components/JobDetail';
import { useJobsSearch } from './hooks/useJobsSearch';
import { useQueryParams } from './hooks/useQueryParams';

function JobSearch() {
  const { filters, setFilters, page, setPage } = useQueryParams();

  const { jobs, hasMore, loading, error } = useJobsSearch(filters, page);

  const handleSearch = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  return (
    <main className="container">
      <header className="header">
        <h1>GitHub Jobs Clone</h1>
        <p>Search flow + pagination-ready structure</p>
      </header>

      <SearchForm
        filters={filters}
        onSearch={handleSearch}
      />

      <JobsList
        jobs={jobs}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
