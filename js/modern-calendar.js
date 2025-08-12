/**
 * Modern Calendar System - JavaScript Implementation
 * Supports multiple calendar types with modern UI
 */

class ModernCalendar {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      calendar: options.calendar || 'gregorian',
      language: options.language || 'en',
      theme: options.theme || 'modern',
      showWeekNumbers: options.showWeekNumbers || false,
      firstDayOfWeek: options.firstDayOfWeek || 0,
      onDateSelect: options.onDateSelect || null,
      onMonthChange: options.onMonthChange || null,
      ...options
    };
    
    this.currentDate = new Date();
    this.selectedDate = null;
    this.viewDate = new Date();
    
    this.init();
  }
  
  init() {
    this.container.className = `modern-calendar theme-${this.options.theme} calendar-animate`;
    this.render();
    this.attachEvents();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="calendar-header">
        <h2 class="calendar-title">${this.getCalendarTitle()}</h2>
        <div class="calendar-nav">
          <button class="nav-btn prev-btn" data-action="prev">‹</button>
          <div class="current-date">${this.formatCurrentDate()}</div>
          <button class="nav-btn next-btn" data-action="next">›</button>
        </div>
      </div>
      <div class="calendar-body">
        <div class="weekdays">
          ${this.renderWeekdays()}
        </div>
        <div class="days-grid">
          ${this.renderDays()}
        </div>
      </div>
      <div class="selected-date-display">
        <div class="selected-date-text">Select a date</div>
      </div>
      <div class="calendar-footer">
        <select class="calendar-type-selector">
          <option value="gregorian">Gregorian</option>
          <option value="ethiopian">Ethiopian</option>
          <option value="islamic">Islamic</option>
        </select>
        <select class="language-selector" style="margin-left: 10px;">
          <option value="en">English</option>
          <option value="am">አማርኛ</option>
          <option value="oro">Afaan Oromo</option>
        </select>
        <button class="today-btn" data-action="today">Today</button>
      </div>
    `;
    
    // Set selected calendar type
    const selector = this.container.querySelector('.calendar-type-selector');
    selector.value = this.options.calendar;
  }
  
  getCalendarTitle() {
    const titles = {
      gregorian: 'Modern Calendar',
      ethiopian: 'የኢትዮጵያ ዘመን አቆጣጠር',
      islamic: 'التقويم الإسلامي'
    };
    return titles[this.options.calendar] || 'Modern Calendar';
  }
  
  formatCurrentDate() {
    const months = this.getMonthNames();
    const month = months[this.viewDate.getMonth()];
    const year = this.viewDate.getFullYear();
    
    if (this.options.calendar === 'ethiopian') {
      return this.formatEthiopianDate(this.viewDate);
    }
    
    return `${month} ${year}`;
  }
  
  formatEthiopianDate(date) {
    const ethiopianMonths = [
      'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
    ];
    
    // Convert Gregorian to Ethiopian using proper algorithm
    const ethDate = this.gregorianToEthiopian(date);
    return `${ethiopianMonths[ethDate.month - 1]} ${ethDate.year}`;
  }
  
  gregorianToEthiopian(date) {
    // Ethiopian calendar epoch: August 29, 8 CE (Gregorian)
    const jdEpoch = 1724220.5;
    const jd = this.gregorianToJD(date);
    const c = Math.floor(jd) + 0.5 - jdEpoch;
    let year = Math.floor((c - Math.floor((c + 366) / 1461)) / 365) + 1;
    if (year <= 0) year--;
    const yearStart = this.ethiopianToJD(year, 1, 1);
    const dayOfYear = Math.floor(jd) + 0.5 - yearStart + 1;
    const month = Math.floor((dayOfYear - 1) / 30) + 1;
    const day = dayOfYear - (month - 1) * 30;
    return { year, month, day };
  }
  
  ethiopianToJD(year, month, day) {
    const jdEpoch = 1724220.5;
    if (year < 0) year++;
    return day + (month - 1) * 30 + (year - 1) * 365 + Math.floor(year / 4) + jdEpoch - 1;
  }
  
  gregorianToJD(date) {
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
  }
  
  getMonthNames() {
    const monthNames = {
      en: ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December'],
      am: ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
           'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'],
      oro: ['Fuulbaana', 'Onkolooleessaa', 'Sadaasaa', 'Muddee', 'Ammajjii', 'Gurraandhala',
            'Bitooteessaa', 'Ebla', 'Caamsaa', 'Waxabajjii', 'Adoolessa', 'Hagayya', 'Qaamee']
    };
    return monthNames[this.options.language] || monthNames.en;
  }
  
  getDayNames() {
    const dayNames = {
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      am: ['እሑድ', 'ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'],
      oro: ['Wiixata', 'Kibxata', 'Roobii', 'Khamisa', 'Jimaata', 'Sanbata', 'Dilbata']
    };
    return dayNames[this.options.language] || dayNames.en;
  }
  
  renderWeekdays() {
    const dayNames = this.getDayNames();
    const firstDay = this.options.firstDayOfWeek;
    const reorderedDays = [...dayNames.slice(firstDay), ...dayNames.slice(0, firstDay)];
    
    return reorderedDays.map(day => 
      `<div class="weekday">${day}</div>`
    ).join('');
  }
  
  renderDays() {
    if (this.options.calendar === 'ethiopian') {
      return this.renderEthiopianDays();
    }
    
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    
    const dayOfWeek = (firstDay.getDay() - this.options.firstDayOfWeek + 7) % 7;
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = this.isSameDay(currentDate, today);
      const isSelected = this.selectedDate && this.isSameDay(currentDate, this.selectedDate);
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      
      const classes = [
        'day',
        !isCurrentMonth && 'other-month',
        isToday && 'today',
        isSelected && 'selected',
        isWeekend && 'weekend'
      ].filter(Boolean).join(' ');
      
      days.push(`
        <div class="${classes}" data-date="${currentDate.toISOString().split('T')[0]}">
          ${currentDate.getDate()}
        </div>
      `);
    }
    
    return days.join('');
  }
  
  renderEthiopianDays() {
    const ethDate = this.gregorianToEthiopian(this.viewDate);
    const daysInMonth = ethDate.month === 13 ? (this.isEthiopianLeapYear(ethDate.year) ? 6 : 5) : 30;
    const firstDayJD = this.ethiopianToJD(ethDate.year, ethDate.month, 1);
    const firstDayGregorian = this.jdToGregorian(firstDayJD);
    const startDate = new Date(firstDayGregorian.year, firstDayGregorian.month - 1, firstDayGregorian.day);
    
    const dayOfWeek = (startDate.getDay() - this.options.firstDayOfWeek + 7) % 7;
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    const days = [];
    const today = new Date();
    const todayEth = this.gregorianToEthiopian(today);
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const currentEth = this.gregorianToEthiopian(currentDate);
      
      const isCurrentMonth = currentEth.month === ethDate.month && currentEth.year === ethDate.year;
      const isToday = this.isSameDay(currentDate, today);
      const isSelected = this.selectedDate && this.isSameDay(currentDate, this.selectedDate);
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      
      const classes = [
        'day',
        !isCurrentMonth && 'other-month',
        isToday && 'today',
        isSelected && 'selected',
        isWeekend && 'weekend'
      ].filter(Boolean).join(' ');
      
      days.push(`
        <div class="${classes}" data-date="${currentDate.toISOString().split('T')[0]}">
          ${isCurrentMonth ? currentEth.day : ''}
        </div>
      `);
    }
    
    return days.join('');
  }
  
  isEthiopianLeapYear(year) {
    return year % 4 === 3;
  }
  
  jdToGregorian(jd) {
    const z = Math.floor(jd + 0.5);
    const a = Math.floor((z - 1867216.25) / 36524.25);
    const aa = z + 1 + a - Math.floor(a / 4);
    const b = aa + 1524;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);
    const day = b - d - Math.floor(e * 30.6001);
    const month = e - (e > 13.5 ? 13 : 1);
    let year = c - (month > 2.5 ? 4716 : 4715);
    if (year <= 0) year--;
    return { year, month, day };
  }
  
  isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }
  
  attachEvents() {
    this.container.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      const date = e.target.dataset.date;
      
      if (action === 'prev') {
        this.previousMonth();
      } else if (action === 'next') {
        this.nextMonth();
      } else if (action === 'today') {
        this.goToToday();
      } else if (date) {
        this.selectDate(new Date(date));
      }
    });
    
    this.container.addEventListener('change', (e) => {
      if (e.target.classList.contains('calendar-type-selector')) {
        this.options.calendar = e.target.value;
        this.render();
      } else if (e.target.classList.contains('language-selector')) {
        this.options.language = e.target.value;
        this.render();
      }
    });
  }
  
  previousMonth() {
    this.viewDate.setMonth(this.viewDate.getMonth() - 1);
    this.render();
    if (this.options.onMonthChange) {
      this.options.onMonthChange(this.viewDate);
    }
  }
  
  nextMonth() {
    this.viewDate.setMonth(this.viewDate.getMonth() + 1);
    this.render();
    if (this.options.onMonthChange) {
      this.options.onMonthChange(this.viewDate);
    }
  }
  
  goToToday() {
    this.viewDate = new Date();
    this.selectedDate = new Date();
    this.render();
    if (this.options.onDateSelect) {
      this.options.onDateSelect(this.selectedDate);
    }
  }
  
  selectDate(date) {
    this.selectedDate = date;
    this.updateSelectedDateDisplay(date);
    this.render();
    if (this.options.onDateSelect) {
      this.options.onDateSelect(date);
    }
  }
  
  updateSelectedDateDisplay(date) {
    const display = this.container.querySelector('.selected-date-display .selected-date-text');
    if (display) {
      const displayText = this.getSelectedDateText(date);
      display.innerHTML = displayText;
    }
  }
  
  getSelectedDateText(date) {
    if (this.options.calendar === 'ethiopian') {
      const ethDate = this.gregorianToEthiopian(date);
      const monthNames = this.getMonthNames();
      const dayNames = this.getDayNames();
      const dayName = dayNames[date.getDay()];
      return `<strong>${dayName}</strong><br>${ethDate.day} ${monthNames[ethDate.month - 1]} ${ethDate.year}`;
    } else if (this.options.calendar === 'islamic') {
      const islamicDate = this.gregorianToIslamic(date);
      const monthNames = this.getMonthNames();
      const dayNames = this.getDayNames();
      const dayName = dayNames[date.getDay()];
      return `<strong>${dayName}</strong><br>${islamicDate.day} ${monthNames[islamicDate.month - 1]} ${islamicDate.year}`;
    } else {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const locale = this.options.language === 'am' ? 'am-ET' : 'en-US';
      return date.toLocaleDateString(locale, options);
    }
  }
  
  gregorianToIslamic(date) {
    // Simplified Islamic calendar conversion
    const islamicEpoch = new Date(622, 6, 16); // July 16, 622 CE
    const daysDiff = Math.floor((date - islamicEpoch) / (1000 * 60 * 60 * 24));
    const islamicYear = Math.floor(daysDiff / 354.37) + 1;
    const dayOfYear = daysDiff - Math.floor((islamicYear - 1) * 354.37);
    const islamicMonth = Math.floor(dayOfYear / 29.53) + 1;
    const islamicDay = Math.floor(dayOfYear - (islamicMonth - 1) * 29.53) + 1;
    return { year: islamicYear, month: Math.min(islamicMonth, 12), day: Math.min(islamicDay, 30) };
  }
  
  // Public API methods
  getSelectedDate() {
    return this.selectedDate;
  }
  
  setDate(date) {
    this.selectedDate = date;
    this.viewDate = new Date(date);
    this.render();
  }
  
  setTheme(theme) {
    this.options.theme = theme;
    this.container.className = `modern-calendar theme-${theme} calendar-animate`;
  }
  
  setCalendarType(type) {
    this.options.calendar = type;
    this.render();
  }
  
  destroy() {
    this.container.innerHTML = '';
    this.container.className = '';
  }
}

// Date Display Component
class DateDisplay {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      calendar: options.calendar || 'gregorian',
      language: options.language || 'en',
      format: options.format || 'full',
      ...options
    };
    
    this.date = options.date || new Date();
    this.render();
  }
  
  render() {
    const formatted = this.formatDate(this.date);
    this.container.innerHTML = `
      <div class="date-display">
        <div class="date-display-main">${formatted.main}</div>
        <div class="date-display-details">${formatted.details}</div>
      </div>
    `;
  }
  
  formatDate(date) {
    if (this.options.calendar === 'ethiopian') {
      return this.formatEthiopianDate(date);
    }
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    const formatted = date.toLocaleDateString(this.options.language, options);
    const parts = formatted.split(', ');
    
    return {
      main: parts.slice(1).join(', '),
      details: parts[0]
    };
  }
  
  formatEthiopianDate(date) {
    // Simplified Ethiopian date formatting
    const ethiopianMonths = [
      'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሳስ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ'
    ];
    
    const ethiopianDays = ['እሑድ', 'ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
    
    const year = date.getFullYear() - 7; // Simplified conversion
    const month = ethiopianMonths[date.getMonth()];
    const day = date.getDate();
    const weekday = ethiopianDays[date.getDay()];
    
    return {
      main: `${day} ${month} ${year}`,
      details: weekday
    };
  }
  
  setDate(date) {
    this.date = date;
    this.render();
  }
  
  setCalendarType(type) {
    this.options.calendar = type;
    this.render();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModernCalendar, DateDisplay };
}

// Global registration
if (typeof window !== 'undefined') {
  window.ModernCalendar = ModernCalendar;
  window.DateDisplay = DateDisplay;
}