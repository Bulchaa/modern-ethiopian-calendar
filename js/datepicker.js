/**
 * Modern Calendar DatePicker - Input field integration
 */

class ModernDatePicker {
  constructor(input, options = {}) {
    this.input = typeof input === 'string' ? document.querySelector(input) : input;
    this.options = {
      calendar: options.calendar || 'gregorian',
      language: options.language || 'en',
      theme: options.theme || 'modern',
      format: options.format || 'yyyy-mm-dd',
      placeholder: options.placeholder || 'Select date...',
      closeOnSelect: options.closeOnSelect !== false,
      showIcon: options.showIcon !== false,
      position: options.position || 'bottom',
      onSelect: options.onSelect || null,
      ...options
    };
    
    this.isOpen = false;
    this.calendar = null;
    this.popup = null;
    
    this.init();
  }
  
  init() {
    this.setupInput();
    this.createPopup();
    this.attachEvents();
  }
  
  setupInput() {
    this.input.setAttribute('readonly', 'readonly');
    this.input.placeholder = this.options.placeholder;
    this.input.classList.add('modern-datepicker-input');
    
    if (this.options.showIcon) {
      this.createIcon();
    }
  }
  
  createIcon() {
    const wrapper = document.createElement('div');
    wrapper.className = 'datepicker-wrapper';
    
    const icon = document.createElement('span');
    icon.className = 'datepicker-icon';
    icon.innerHTML = '📅';
    
    this.input.parentNode.insertBefore(wrapper, this.input);
    wrapper.appendChild(this.input);
    wrapper.appendChild(icon);
    
    icon.addEventListener('click', () => this.toggle());
  }
  
  createPopup() {
    this.popup = document.createElement('div');
    this.popup.className = 'datepicker-popup';
    this.popup.style.display = 'none';
    document.body.appendChild(this.popup);
    
    this.calendar = new ModernCalendar(this.popup, {
      ...this.options,
      onDateSelect: (date) => this.selectDate(date)
    });
  }
  
  attachEvents() {
    this.input.addEventListener('click', () => this.show());
    this.input.addEventListener('focus', () => this.show());
    
    document.addEventListener('click', (e) => {
      if (!this.popup.contains(e.target) && e.target !== this.input) {
        this.hide();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.hide();
      }
    });
  }
  
  show() {
    if (this.isOpen) return;
    
    this.positionPopup();
    this.popup.style.display = 'block';
    this.popup.classList.add('datepicker-show');
    this.isOpen = true;
  }
  
  hide() {
    if (!this.isOpen) return;
    
    this.popup.classList.remove('datepicker-show');
    setTimeout(() => {
      this.popup.style.display = 'none';
    }, 200);
    this.isOpen = false;
  }
  
  toggle() {
    this.isOpen ? this.hide() : this.show();
  }
  
  positionPopup() {
    const inputRect = this.input.getBoundingClientRect();
    const popupRect = this.popup.getBoundingClientRect();
    
    let top = inputRect.bottom + window.scrollY + 5;
    let left = inputRect.left + window.scrollX;
    
    // Adjust if popup goes off screen
    if (left + popupRect.width > window.innerWidth) {
      left = window.innerWidth - popupRect.width - 10;
    }
    
    if (top + popupRect.height > window.innerHeight + window.scrollY) {
      top = inputRect.top + window.scrollY - popupRect.height - 5;
    }
    
    this.popup.style.position = 'absolute';
    this.popup.style.top = `${top}px`;
    this.popup.style.left = `${left}px`;
    this.popup.style.zIndex = '9999';
  }
  
  selectDate(date) {
    const formattedDate = this.formatDate(date);
    this.input.value = formattedDate;
    
    // Update selected date display
    this.updateSelectedDisplay(date);
    
    // Trigger change event
    const event = new Event('change', { bubbles: true });
    this.input.dispatchEvent(event);
    
    if (this.options.onSelect) {
      this.options.onSelect(date, formattedDate);
    }
    
    if (this.options.closeOnSelect) {
      this.hide();
    }
  }
  
  updateSelectedDisplay(date) {
    // Update any selected date display in the calendar
    const selectedDisplay = this.popup.querySelector('.selected-date-display');
    if (selectedDisplay) {
      const displayText = this.getDisplayText(date);
      selectedDisplay.innerHTML = displayText;
    }
  }
  
  getDisplayText(date) {
    if (this.options.calendar === 'ethiopian') {
      const ethDate = this.calendar.gregorianToEthiopian(date);
      const monthNames = this.calendar.getMonthNames();
      return `${ethDate.day} ${monthNames[ethDate.month - 1]} ${ethDate.year}`;
    } else if (this.options.calendar === 'islamic') {
      const islamicDate = this.calendar.gregorianToIslamic(date);
      const monthNames = this.calendar.getMonthNames();
      return `${islamicDate.day} ${monthNames[islamicDate.month - 1]} ${islamicDate.year}`;
    } else {
      return date.toLocaleDateString(this.options.language === 'am' ? 'am-ET' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
  
  formatDate(date) {
    const format = this.options.format;
    
    if (this.options.calendar === 'ethiopian') {
      const ethDate = this.calendar.gregorianToEthiopian(date);
      return format
        .replace('yyyy', ethDate.year)
        .replace('mm', String(ethDate.month).padStart(2, '0'))
        .replace('dd', String(ethDate.day).padStart(2, '0'));
    } else if (this.options.calendar === 'islamic') {
      const islamicDate = this.calendar.gregorianToIslamic(date);
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
  }
  
  setValue(date) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    this.calendar.setDate(date);
    this.selectDate(date);
  }
  
  getValue() {
    return this.input.value;
  }
  
  getDate() {
    return this.input.value ? new Date(this.input.value) : null;
  }
  
  destroy() {
    if (this.popup) {
      this.popup.remove();
    }
    this.input.classList.remove('modern-datepicker-input');
    this.input.removeAttribute('readonly');
  }
}

// Auto-initialize datepickers
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-datepicker]').forEach(input => {
    const options = JSON.parse(input.dataset.datepicker || '{}');
    new ModernDatePicker(input, options);
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModernDatePicker;
}

if (typeof window !== 'undefined') {
  window.ModernDatePicker = ModernDatePicker;
}