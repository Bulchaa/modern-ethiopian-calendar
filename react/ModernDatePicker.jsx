import React, { useState, useRef, useEffect } from 'react';
import ModernCalendar from './ModernCalendar';

const ModernDatePicker = ({
  calendar = 'gregorian',
  language = 'en',
  theme = 'modern',
  format = 'yyyy-mm-dd',
  placeholder = 'Select date...',
  value = '',
  onChange = null,
  onSelect = null,
  className = '',
  disabled = false,
  required = false,
  name = '',
  id = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const popupRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    if (selectedDate) {
      const formatted = formatDate(selectedDate);
      setInputValue(formatted);
    }
  }, [selectedDate, calendar, format]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const formatDate = (date) => {
    if (calendar === 'ethiopian') {
      const ethDate = gregorianToEthiopian(date);
      return format
        .replace('yyyy', ethDate.year)
        .replace('mm', String(ethDate.month).padStart(2, '0'))
        .replace('dd', String(ethDate.day).padStart(2, '0'));
    } else if (calendar === 'islamic') {
      const islamicDate = gregorianToIslamic(date);
      return format
        .replace('yyyy', islamicDate.year)
        .replace('mm', String(islamicDate.month).padStart(2, '0'))
        .replace('dd', String(islamicDate.day).padStart(2, '0'));
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return format
        .replace('yyyy', year)
        .replace('mm', month)
        .replace('dd', day);
    }
  };

  const gregorianToEthiopian = (date) => {
    const jdEpoch = 1724220.5;
    const jd = gregorianToJD(date);
    const c = Math.floor(jd) + 0.5 - jdEpoch;
    let year = Math.floor((c - Math.floor((c + 366) / 1461)) / 365) + 1;
    if (year <= 0) year--;
    const yearStart = ethiopianToJD(year, 1, 1);
    const dayOfYear = Math.floor(jd) + 0.5 - yearStart + 1;
    const month = Math.floor((dayOfYear - 1) / 30) + 1;
    const day = dayOfYear - (month - 1) * 30;
    return { year, month, day };
  };

  const gregorianToIslamic = (date) => {
    const islamicEpoch = new Date(622, 6, 16);
    const daysDiff = Math.floor((date - islamicEpoch) / (1000 * 60 * 60 * 24));
    const islamicYear = Math.floor(daysDiff / 354.37) + 1;
    const dayOfYear = daysDiff - Math.floor((islamicYear - 1) * 354.37);
    const islamicMonth = Math.floor(dayOfYear / 29.53) + 1;
    const islamicDay = Math.floor(dayOfYear - (islamicMonth - 1) * 29.53) + 1;
    return { year: islamicYear, month: Math.min(islamicMonth, 12), day: Math.min(islamicDay, 30) };
  };

  const gregorianToJD = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDate();
    if (year < 0) year++;
    if (month < 3) {
      month += 12;
      year--;
    }
    const a = Math.floor(year / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
  };

  const ethiopianToJD = (year, month, day) => {
    const jdEpoch = 1724220.5;
    if (year < 0) year++;
    return day + (month - 1) * 30 + (year - 1) * 365 + Math.floor(year / 4) + jdEpoch - 1;
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const formatted = formatDate(date);
    setInputValue(formatted);
    setIsOpen(false);

    if (onChange) {
      onChange({
        target: {
          name: name,
          value: formatted
        }
      });
    }

    if (onSelect) {
      onSelect(date, formatted);
    }
  };

  const getPopupStyle = () => {
    if (!inputRef.current) return {};

    const inputRect = inputRef.current.getBoundingClientRect();
    const popupHeight = 400; // Approximate popup height

    let top = inputRect.bottom + window.scrollY + 5;
    let left = inputRect.left + window.scrollX;

    // Adjust if popup goes off screen
    if (left + 350 > window.innerWidth) {
      left = window.innerWidth - 350 - 10;
    }

    if (top + popupHeight > window.innerHeight + window.scrollY) {
      top = inputRect.top + window.scrollY - popupHeight - 5;
    }

    return {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999
    };
  };

  return (
    <div className="modern-datepicker-wrapper">
      <div className="datepicker-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onClick={handleInputClick}
          onFocus={handleInputClick}
          readOnly
          disabled={disabled}
          required={required}
          name={name}
          id={id}
          className={`modern-datepicker-input ${className}`}
        />
        <span className="datepicker-icon" onClick={handleInputClick}>
          📅
        </span>
      </div>

      {isOpen && (
        <div
          ref={popupRef}
          className="datepicker-popup datepicker-show"
          style={getPopupStyle()}
        >
          <ModernCalendar
            ref={calendarRef}
            calendar={calendar}
            language={language}
            theme={theme}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>
      )}
    </div>
  );
};

export default ModernDatePicker;