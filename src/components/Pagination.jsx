function Pagination({ pagination, onPageChange }) {
  if (!pagination || Object.keys(pagination).length === 0) {
    return null;
  }
  
  const { total_pages, current_page, has_pre, has_next } = pagination;

  function handlePageClick(e) {
    e.preventDefault();
    if (e.target.tagName === 'A') {
      const page = e.target.dataset.page;
      onPageChange(page);
    }
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center" onClick={handlePageClick}>
        <li className={`page-item ${!has_pre ? 'disabled' : ''}`}>
          <a className="page-link" href="#" data-page={current_page - 1} aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {Array.from({ length: total_pages }, (_, i) => (
          <li className={`page-item ${i + 1 === current_page ? 'active' : ''}`} key={i}>
            <a className="page-link" href="#" data-page={i + 1}>{i + 1}</a>
          </li>
        ))}
        <li className={`page-item ${!has_next ? 'disabled' : ''}`}>
          <a className="page-link" href="#" data-page={current_page + 1} aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;