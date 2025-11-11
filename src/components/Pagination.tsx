import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(totalItems / itemsPerPage));
  const navigate = useNavigate();

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
    navigate(`?page=${page}`);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-1 px-3 py-1 rounded-full ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-500 hover:text-white transition`}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className="mx-1 px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition"
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        &laquo;
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className="mx-1 px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition"
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;