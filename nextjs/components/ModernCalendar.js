import { useState, useEffect, useCallback } from 'react';
import styles from './ModernCalendar.module.css';

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

  const formatEthiopianDate = (date) => {
    const ethiopianMonths = [
      'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
    ];
    
    const gregorianYear = date.getFullYear();
    const ethiopianYear = gregorianYear - 7;
    const monthIndex = date.getMonth();
    
    return `${ethiopianMonths[monthIndex]} ${ethiopianYear}`;
  };

  const getMonthNames = useCallback(() => {
    const monthNames = {
      en: ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December'],
      am: ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
           'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ']
    };
    return monthNames[language] || monthNames.en;
  }, [language]);

  const getDayNames = useCallback(() => {
    const dayNames = {
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      am: ['እሑድ', 'ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ']
    };
    return dayNames[language] || dayNames.en;
  }, [language]);

  const renderWeekdays = () => {
    const dayNames = getDayNames();
    const reorderedDays = [...dayNames.slice(firstDayOfWeek), ...dayNames.slice(0, firstDayOfWeek)];
    
    return reorderedDays.map((day, index) => (
      <div key={index} className={styles.weekday}>{day}</div>
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
      
      const dayClasses = [
        styles.day,
        !isCurrentMonth && styles.otherMonth,
        isToday && styles.today,
        isSelected && styles.selected,
        isWeekend && styles.weekend
      ].filter(Boolean).join(' ');
      
      days.push(
        <div
          key={i}
          className={dayClasses}
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
    <div className={`${styles.modernCalendar} ${styles[`theme${theme.charAt(0).toUpperCase() + theme.slice(1)}`]} ${styles.calendarAnimate}`}>
      <div className={styles.calendarHeader}>
        <h2 className={styles.calendarTitle}>{getCalendarTitle()}</h2>
        <div className={styles.calendarNav}>
          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={previousMonth}>‹</button>
          <div className={styles.currentDate}>{formatCurrentDate()}</div>
          <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextMonth}>›</button>
        </div>
      </div>
      
      <div className={styles.calendarBody}>
        <div className={styles.weekdays}>
          {renderWeekdays()}
        </div>
        <div className={styles.daysGrid}>
          {renderDays()}
        </div>
      </div>
      
      <div className={styles.calendarFooter}>
        <select 
          className={styles.calendarTypeSelector} 
          value={calendarType}
          onChange={handleCalendarTypeChange}
        >
          <option value="gregorian">Gregorian</option>
          <option value="ethiopian">Ethiopian</option>
          <option value="islamic">Islamic</option>
        </select>
        <button className={styles.todayBtn} onClick={goToToday}>Today</button>
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
    <div className={styles.dateDisplay}>
      <div className={styles.dateDisplayMain}>{formatted.main}</div>
      <div className={styles.dateDisplayDetails}>{formatted.details}</div>
    </div>
  );
};

export default ModernCalendar;