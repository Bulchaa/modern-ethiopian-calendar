import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/DatePicker.module.css';

// Dynamically import calendar to avoid SSR issues
const ModernCalendar = dynamic(() => import('./ModernCalendar'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading calendar...</div>
});

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
  id = '',
  autoClose = true,
  showIcon = true,
  position = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [inputValue, setInputValue] = useState('');
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  
  const inputRef = useRef(null);
  const popupRef = useRef(null);
  const calendarRef = useRef(null);

  // Format date according to calendar type
  const formatDate = useCallback((date) => {
    if (!date) return '';
    
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
  }, [calendar, format]);

  // Ethiopian calendar conversion
  const gregorianToEthiopian = useCallback((date) => {
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
  }, []);

  const gregorianToIslamic = useCallback((date) => {
    const islamicEpoch = new Date(622, 6, 16);
    const daysDiff = Math.floor((date - islamicEpoch) / (1000 * 60 * 60 * 24));
    const islamicYear = Math.floor(daysDiff / 354.37) + 1;
    const dayOfYear = daysDiff - Math.floor((islamicYear - 1) * 354.37);
    const islamicMonth = Math.floor(dayOfYear / 29.53) + 1;
    const islamicDay = Math.floor(dayOfYear - (islamicMonth - 1) * 29.53) + 1;
    return { year: islamicYear, month: Math.min(islamicMonth, 12), day: Math.min(islamicDay, 30) };
  }, []);

  const gregorianToJD = useCallback((date) => {
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
  }, []);

  const ethiopianToJD = useCallback((year, month, day) => {
    const jdEpoch = 1724220.5;
    if (year < 0) year++;
    return day + (month - 1) * 30 + (year - 1) * 365 + Math.floor(year / 4) + jdEpoch - 1;
  }, []);

  // Update input value when selected date changes
  useEffect(() => {
    if (selectedDate) {
      const formatted = formatDate(selectedDate);
      setInputValue(formatted);
    }
  }, [selectedDate, formatDate]);

  // Handle outside clicks
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
        inputRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Calculate popup position
  const calculatePosition = useCallback(() => {
    if (!inputRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const popupHeight = 400; // Approximate popup height
    const popupWidth = 350; // Approximate popup width

    let top = inputRect.bottom + window.scrollY + 5;
    let left = inputRect.left + window.scrollX;

    // Adjust if popup goes off screen
    if (left + popupWidth > window.innerWidth) {
      left = window.innerWidth - popupWidth - 10;
    }

    if (top + popupHeight > window.innerHeight + window.scrollY) {
      top = inputRect.top + window.scrollY - popupHeight - 5;
    }

    setPopupPosition({ top, left });
  }, []);

  const handleInputClick = () => {
    if (!disabled) {
      calculatePosition();
      setIsOpen(true);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const formatted = formatDate(date);
    setInputValue(formatted);

    if (autoClose) {
      setIsOpen(false);
    }

    // Trigger callbacks
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

  const getDisplayText = (date) => {
    if (!date) return '';
    
    if (calendar === 'ethiopian') {
      const ethDate = gregorianToEthiopian(date);
      const monthNames = getMonthNames();
      const dayNames = getDayNames();
      const dayName = dayNames[date.getDay()];
      return `${dayName}, ${ethDate.day} ${monthNames[ethDate.month - 1]} ${ethDate.year}`;
    } else if (calendar === 'islamic') {
      const islamicDate = gregorianToIslamic(date);
      const monthNames = getMonthNames();
      const dayNames = getDayNames();
      const dayName = dayNames[date.getDay()];
      return `${dayName}, ${islamicDate.day} ${monthNames[islamicDate.month - 1]} ${islamicDate.year}`;
    } else {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const locale = language === 'am' ? 'am-ET' : 'en-US';
      return date.toLocaleDateString(locale, options);
    }
  };

  const getMonthNames = () => {
    const monthNames = {
      en: ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December'],
      am: ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
           'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'],
      oro: ['Fuulbaana', 'Onkolooleessaa', 'Sadaasaa', 'Muddee', 'Ammajjii', 'Gurraandhala',
            'Bitooteessaa', 'Ebla', 'Caamsaa', 'Waxabajjii', 'Adoolessa', 'Hagayya', 'Qaamee']
    };
    return monthNames[language] || monthNames.en;
  };

  const getDayNames = () => {
    const dayNames = {
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      am: ['እሑድ', 'ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'],
      oro: ['Wiixata', 'Kibxata', 'Roobii', 'Khamisa', 'Jimaata', 'Sanbata', 'Dilbata']
    };
    return dayNames[language] || dayNames.en;
  };

  return (
    <div className={`${styles.datepickerWrapper} ${className}`}>
      <div className={styles.inputWrapper}>
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
          className={`${styles.datepickerInput} ${disabled ? styles.disabled : ''}`}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label={placeholder}
        />
        {showIcon && (
          <span 
            className={styles.datepickerIcon} 
            onClick={handleInputClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleInputClick();
              }
            }}
          >
            📅
          </span>
        )}
      </div>

      {isOpen && (
        <div
          ref={popupRef}
          className={`${styles.datepickerPopup} ${styles.show}`}
          style={{
            position: 'fixed',
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            zIndex: 9999
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Date picker"
        >
          <ModernCalendar
            ref={calendarRef}
            calendar={calendar}
            language={language}
            theme={theme}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
          
          {selectedDate && (
            <div className={styles.selectedDateDisplay}>
              <div className={styles.selectedDateText}>
                {getDisplayText(selectedDate)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModernDatePicker;