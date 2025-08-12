import React, { useState, useEffect, useCallback } from 'react';
import './ModernCalendar.css';

const ModernCalendar = ({
  calendar = 'gregorian',
  language = 'en',
  theme = 'modern',
  showWeekNumbers = false,
  firstDayOfWeek = 0,
  onDateSelect = null,
  onMonthChange = null,
  initialDate = null
}) => {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [viewDate, setViewDate] = useState(initialDate || new Date());
  const [calendarType, setCalendarType] = useState(calendar);

  const getCalendarTitle = useCallback(() => {
    const titles = {
      gregorian: 'Modern Calendar',
      ethiopian: 'የኢትዮጵያ ዘመን አቆጣጠር',
      islamic: 'التقويم الإسلامي'
    };
    return titles[calendarType] || 'Modern Calendar';
  }, [calendarType]);

  const formatCurrentDate = useCallback(() => {
    const months = getMonthNames();
    const month = months[viewDate.getMonth()];
    const year = viewDate.getFullYear();
    
    if (calendarType === 'ethiopian') {
      return formatEthiopianDate(viewDate);
    }
    
    return `${month} ${year}`;
  }, [viewDate, calendarType, language]);

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
  
  const ethiopianToJD = (year, month, day) => {
    const jdEpoch = 1724220.5;
    if (year < 0) year++;
    return day + (month - 1) * 30 + (year - 1) * 365 + Math.floor(year / 4) + jdEpoch - 1;
  };
  
  const formatEthiopianDate = (date) => {
    const ethiopianMonths = [
      'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
    ];
    
    const ethDate = gregorianToEthiopian(date);
    return `${ethiopianMonths[ethDate.month - 1]} ${ethDate.year}`;
  };

  const getMonthNames = useCallback(() => {
    const monthNames = {
      en: ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December'],
      am: ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
           'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'],
      oro: ['Fuulbaana', 'Onkolooleessaa', 'Sadaasaa', 'Muddee', 'Ammajjii', 'Gurraandhala',
            'Bitooteessaa', 'Ebla', 'Caamsaa', 'Waxabajjii', 'Adoolessa', 'Hagayya', 'Qaamee']
    };
    return monthNames[language] || monthNames.en;
  }, [language]);

  const getDayNames = useCallback(() => {
    const dayNames = {
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      am: ['እሑድ', 'ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'],
      oro: ['Wiixata', 'Kibxata', 'Roobii', 'Khamisa', 'Jimaata', 'Sanbata', 'Dilbata']
    };
    return dayNames[language] || dayNames.en;
  }, [language]);

  const renderWeekdays = () => {
    const dayNames = getDayNames();
    const reorderedDays = [...dayNames.slice(firstDayOfWeek), ...dayNames.slice(0, firstDayOfWeek)];
    
    return reorderedDays.map((day, index) => (
      <div key={index} className="weekday">{day}</div>
    ));
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    
    const dayOfWeek = (firstDay.getDay() - firstDayOfWeek + 7) % 7;
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    const days = [];
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = isSameDay(currentDate, currentDate);
      const isSelected = selectedDate && isSameDay(currentDate, selectedDate);
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      
      const classes = [
        'day',
        !isCurrentMonth && 'other-month',
        isToday && 'today',
        isSelected && 'selected',
        isWeekend && 'weekend'
      ].filter(Boolean).join(' ');
      
      days.push(
        <div
          key={i}
          className={classes}
          onClick={() => handleDateSelect(currentDate)}
        >
          {currentDate.getDate()}
        </div>
      );
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const previousMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
    if (onMonthChange) {
      onMonthChange(newDate);
    }
  };

  const nextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
    if (onMonthChange) {
      onMonthChange(newDate);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setViewDate(today);
    setSelectedDate(today);
    if (onDateSelect) {
      onDateSelect(today);
    }
  };

  const handleCalendarTypeChange = (e) => {
    setCalendarType(e.target.value);
  };

  return (
    <div className={`modern-calendar theme-${theme} calendar-animate`}>
      <div className="calendar-header">
        <h2 className="calendar-title">{getCalendarTitle()}</h2>
        <div className="calendar-nav">
          <button className="nav-btn prev-btn" onClick={previousMonth}>‹</button>
          <div className="current-date">{formatCurrentDate()}</div>
          <button className="nav-btn next-btn" onClick={nextMonth}>›</button>
        </div>
      </div>
      
      <div className="calendar-body">
        <div className="weekdays">
          {renderWeekdays()}
        </div>
        <div className="days-grid">
          {renderDays()}
        </div>
      </div>
      
      <div className="calendar-footer">
        <select 
          className="calendar-type-selector" 
          value={calendarType}
          onChange={handleCalendarTypeChange}
        >
          <option value="gregorian">Gregorian</option>
          <option value="ethiopian">Ethiopian</option>
          <option value="islamic">Islamic</option>
        </select>
        <button className="today-btn" onClick={goToToday}>Today</button>
      </div>
    </div>
  );
};

export const DateDisplay = ({
  date = new Date(),
  calendar = 'gregorian',
  language = 'en',
  format = 'full'
}) => {
  const formatDate = (inputDate) => {
    if (calendar === 'ethiopian') {
      return formatEthiopianDate(inputDate);
    }
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    const formatted = inputDate.toLocaleDateString(language, options);
    const parts = formatted.split(', ');
    
    return {
      main: parts.slice(1).join(', '),
      details: parts[0]
    };
  };

  const formatEthiopianDate = (inputDate) => {
    const ethiopianMonths = [
      'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ'
    ];
    
    const ethiopianDays = ['እሑድ', 'ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
    
    const year = inputDate.getFullYear() - 7;
    const month = ethiopianMonths[inputDate.getMonth()];
    const day = inputDate.getDate();
    const weekday = ethiopianDays[inputDate.getDay()];
    
    return {
      main: `${day} ${month} ${year}`,
      details: weekday
    };
  };

  const formatted = formatDate(date);

  return (
    <div className="date-display">
      <div className="date-display-main">{formatted.main}</div>
      <div className="date-display-details">{formatted.details}</div>
    </div>
  );
};

export default ModernCalendar;