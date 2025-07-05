import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ 
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPrevNext = true,
  ...props 
}) => {
  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showEllipsis = totalPages > 5;

  return (
    <div className="flex items-center justify-center gap-1 mt-6" {...props}>
      {/* Previous Button */}
      {showPrevNext && (
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((pageNumber, index) => {
          const isActive = currentPage === pageNumber;
          
          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange && onPageChange(pageNumber)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
        
        {/* Ellipsis and last page if needed */}
        {showEllipsis && currentPage < totalPages - 2 && totalPages > 5 && (
          <>
            <span className="px-2 text-gray-500">...</span>
            <button
              type="button"
              onClick={() => onPageChange && onPageChange(totalPages)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors duration-200 ${
                currentPage === totalPages
                  ? 'bg-blue-600 text-white border border-blue-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      {showPrevNext && (
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Next page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4L10 8L6 12" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  showPrevNext: PropTypes.bool,
};

export default Pagination;