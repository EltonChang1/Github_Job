function Pagination({ page, onNext, onPrev, canGoPrev, canGoNext }) {
  return (
    <footer className="pagination">
      <button onClick={onPrev} disabled={!canGoPrev}>
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={onNext} disabled={!canGoNext}>
        Next
      </button>
    </footer>
  );
}

export default Pagination;
