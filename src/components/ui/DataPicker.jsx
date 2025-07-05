import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DatePicker = ({ 
  placeholder = 'All time',
  value,
  onChange,
  onDateRangeChange,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2021, 0, 1)); // January 2021
  const [selectedRange, setSelectedRange] = useState('All time');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  const timeRanges = [
    'All time',
    'Past week',
    'Past month', 
    'Past 3 months',
    'Past 6 months',
    'Past year',
    'Past 2 years'
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Initialize with "All time" on first load
  useEffect(() => {
    if (onDateRangeChange) {
      onDateRangeChange(null); // null means no date filtering (all time)
    }
  }, []);

  // Calculate date range based on selection
  const getDateRange = (range) => {
    if (range === 'All time') {
      return null; // Return null for "All time" to indicate no filtering
    }

    const now = new Date();
    const endDate = new Date(now);
    let startDate = new Date(now);

    switch (range) {
      case 'Past week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'Past month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'Past 3 months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'Past 6 months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'Past year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'Past 2 years':
        startDate.setFullYear(now.getFullYear() - 2);
        break;
      default:
        startDate = customStartDate || startDate;
        endDate = customEndDate || endDate;
    }

    return { startDate, endDate };
  };

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    const dateRange = getDateRange(range);
    
    if (onChange) onChange(range);
    if (onDateRangeChange) onDateRangeChange(dateRange);
    
    setIsOpen(false);
  };

  const handleDateClick = (day, monthOffset = 0) => {
    if (!day) return;
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, day);
    
    if (!customStartDate || (customStartDate && customEndDate)) {
      // Start new selection
      setCustomStartDate(clickedDate);
      setCustomEndDate(null);
    } else if (customStartDate && !customEndDate) {
      // Set end date
      const endDate = clickedDate;
      const startDate = customStartDate;
      
      if (endDate >= startDate) {
        setCustomEndDate(endDate);
        setSelectedRange('Custom Range');
        
        const dateRange = { startDate, endDate };
        if (onChange) onChange('Custom Range');
        if (onDateRangeChange) onDateRangeChange(dateRange);
        
        setIsOpen(false);
      } else {
        // If end date is before start date, make it the new start date
        setCustomStartDate(endDate);
        setCustomEndDate(null);
      }
    }
  };

  const isDateInRange = (day, monthOffset = 0) => {
    if (!day || !customStartDate) return false;
    
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, day);
    
    if (customEndDate) {
      return checkDate >= customStartDate && checkDate <= customEndDate;
    } else {
      return checkDate.getTime() === customStartDate.getTime();
    }
  };

  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const nextMonth = months[(currentDate.getMonth() + 1) % 12];
  const nextYear = currentDate.getMonth() === 11 ? currentYear + 1 : currentYear;

  const currentMonthDays = getDaysInMonth(currentYear, currentDate.getMonth());
  const nextMonthDays = getDaysInMonth(nextYear, (currentDate.getMonth() + 1) % 12);

  return (
    <>
      <div className="relative w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 pl-9 pr-3 py-1 text-sm leading-5 text-left bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none transition-colors duration-200"
          {...props}
        >
          <Calendar className="absolute left-3 w-4 h-4 text-gray-500" />
          <span className="flex-1 font-medium text-gray-700">
            {selectedRange}
          </span>
          <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Overlay Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex">
              {/* Left sidebar with time ranges */}
              <div className="w-40 border-r border-gray-200 p-4">
                <div className="space-y-1">
                  {timeRanges.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => handleRangeSelect(range)}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors ${
                        selectedRange === range ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar section */}
              <div className="flex-1 p-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="text-lg font-medium">
                    {currentMonth} {currentYear}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Two-month calendar view */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Current Month */}
                  <div>
                    <div className="text-center font-medium mb-2 text-gray-700">
                      {currentMonth} {currentYear}
                    </div>
                    
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {currentMonthDays.map((day, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDateClick(day, 0)}
                          className={`
                            h-8 w-8 text-sm rounded hover:bg-gray-100 transition-colors flex items-center justify-center
                            ${day ? 'text-gray-700 cursor-pointer' : 'text-transparent cursor-default'}
                            ${isDateInRange(day, 0) ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                          `}
                          disabled={!day}
                        >
                          {day || ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Next Month */}
                  <div>
                    <div className="text-center font-medium mb-2 text-gray-700">
                      {nextMonth} {nextYear}
                    </div>
                    
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {nextMonthDays.map((day, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDateClick(day, 1)}
                          className={`
                            h-8 w-8 text-sm rounded hover:bg-gray-100 transition-colors flex items-center justify-center
                            ${day ? 'text-gray-700 cursor-pointer' : 'text-transparent cursor-default'}
                            ${isDateInRange(day, 1) ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                          `}
                          disabled={!day}
                        >
                          {day || ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DatePicker;