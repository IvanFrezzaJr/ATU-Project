import { Link } from 'wouter-preact';
import styles from '../styles/Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
    return (
        <div class={styles.pagination}>
            {/* Previous Link */}
            <Link 
                href={`?page=${currentPage - 1}`} 
                class={currentPage === 1 ? styles.disabled : ''}
            >
                <a>&lt; Previous</a>
            </Link>

            {/* Page number Links */}
            {[...Array(totalPages)].map((_, index) => (
                <Link key={index} href={`?page=${index + 1}`} class={currentPage === index + 1 ? styles.active : ''}>
                    <a>{index + 1}</a>
                </Link>
            ))}

            {/* Next Link */}
            <Link 
                href={`?page=${currentPage + 1}`} 
                class={currentPage === totalPages ? styles.disabled : ''}
            >
                <a>Next &gt;</a>
            </Link>
        </div>
    );
};

export default Pagination;
