import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(totalItems / itemsPerPage));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setLoading(true);
    setError(null);
    axios.get(`/api/items?page=${page}&limit=${itemsPerPage}`)
      .then(response => {
        onPageChange(page);
      })
      .catch(err => {
        setError('Failed to load data. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          aria-label={`Go to page ${i}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center mt-4">
      {loading && <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status" aria-label="Loading"></div>}
      {error && <div className="text-red-500">{error}</div>}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        aria-label="Previous page"
      >
        Previous
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;