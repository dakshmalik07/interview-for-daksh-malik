import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ 
  placeholder = 'Select option',
  options = [],
  value,
  onChange,
  leftIcon,
  rightIcon = '/images/img_arrowdown.svg',
  disabled = false,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange && onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full sm:w-auto flex items-center gap-2 pl-9 pr-3 py-1 text-dropdown-1 font-helvetica font-medium text-sm sm:text-base leading-5 text-left bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
        {...props}
      >
        {leftIcon && (
          <img 
            src={leftIcon} 
            alt="" 
            className="absolute left-3 w-4 h-4"
          />
        )}
        <span className="flex-1 truncate">
          {value || placeholder}
        </span>
        {rightIcon && (
          <img 
            src={rightIcon} 
            alt="" 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-auto">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t last:rounded-b"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  placeholder: PropTypes.string,
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Dropdown;