import styles from '../styles/Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const range: number[] = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div class={styles.pagination}>
      <button
        class={currentPage === 1 ? styles.disabled : ''}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt; Previous
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          class={currentPage === page ? styles.active : ''}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => goToPage(currentPage + 1)}
        class={currentPage === totalPages ? styles.disabled : ''}
        disabled={currentPage === totalPages}
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
