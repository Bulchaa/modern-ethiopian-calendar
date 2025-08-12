# 🚀 Developer Guide - Modern Calendar System

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Installation](#installation)
- [API Reference](#api-reference)
- [DatePicker Usage](#datepicker-usage)
- [Implementation Examples](#implementation-examples)
- [Calendar Types](#calendar-types)
- [Localization](#localization)
- [Themes](#themes)
- [Contributing](#contributing)

## 🚀 Quick Start

### GitHub Repository
```bash
git clone https://github.com/yourusername/modern-calendar-system.git
cd modern-calendar-system
```

### CDN Links (Coming Soon)
```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/yourusername/modern-calendar-system/css/modern-calendar.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/yourusername/modern-calendar-system/js/modern-calendar.js"></script>
```

## 📦 Installation

### HTML/JavaScript
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/modern-calendar.css">
</head>
<body>
    <div id="calendar"></div>
    <script src="js/modern-calendar.js"></script>
    <script>
        const calendar = new ModernCalendar('#calendar', {
            calendar: 'ethiopian',
            language: 'am',
            theme: 'modern'
        });
    </script>
</body>
</html>
```

### React
```bash
npm install react react-dom
```

```jsx
import React from 'react';
import ModernCalendar from './components/ModernCalendar';

function App() {
    return (
        <div>
            <ModernCalendar 
                calendar="ethiopian"
                language="am"
                theme="modern"
                onDateSelect={(date) => console.log('Selected:', date)}
            />
        </div>
    );
}

export default App;
```

### Next.js
```bash
npx create-next-app@latest my-calendar-app
cd my-calendar-app
```

```jsx
// pages/index.js
import ModernCalendar from '../components/ModernCalendar';

export default function Home() {
    return (
        <div>
            <h1>My Calendar App</h1>
            <ModernCalendar calendar="gregorian" />
        </div>
    );
}
```

### Python
```bash
pip install datetime
```

```python
from modern_calendar import ModernCalendar, DateDisplay

# Initialize calendar
calendar = ModernCalendar('ethiopian', 'am')

# Get today's date
today = calendar.today()
formatted = calendar.format_date(today)
print(f"Today: {formatted}")

# Date operations
future_date = calendar.add_days(today, 30)
print(f"30 days from now: {calendar.format_date(future_date)}")
```

### PHP
```php
<?php
require_once 'ModernCalendar.php';

// Initialize calendar
$calendar = new ModernCalendar('ethiopian', 'am');

// Get today's date
$today = $calendar->today();
echo "Today: " . $calendar->formatDate($today) . "\n";

// Generate HTML calendar
echo $calendar->generateHtmlCalendar(2024, 1);
?>
```

## 📚 API Reference

### ModernCalendar Class

#### Constructor Options
```javascript
const calendar = new ModernCalendar(selector, options);
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `calendar` | string | 'gregorian' | Calendar type: 'gregorian', 'ethiopian', 'islamic' |
| `language` | string | 'en' | Language: 'en', 'am', 'oro' |
| `theme` | string | 'modern' | Theme: 'modern', 'dark', 'green', 'purple', 'orange' |
| `firstDayOfWeek` | number | 0 | First day of week (0=Sunday, 1=Monday) |
| `onDateSelect` | function | null | Callback when date is selected |
| `onMonthChange` | function | null | Callback when month changes |

#### Methods

##### `setDate(date)`
Set the selected date
```javascript
calendar.setDate(new Date(2024, 0, 15));
```

##### `getSelectedDate()`
Get the currently selected date
```javascript
const selected = calendar.getSelectedDate();
```

##### `setTheme(theme)`
Change the calendar theme
```javascript
calendar.setTheme('green');
```

##### `setCalendarType(type)`
Change the calendar type
```javascript
calendar.setCalendarType('ethiopian');
```

##### `destroy()`
Remove the calendar from DOM
```javascript
calendar.destroy();
```

### ModernDatePicker Class

#### Constructor Options
```javascript
const datepicker = new ModernDatePicker(input, options);
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `calendar` | string | 'gregorian' | Calendar type |
| `language` | string | 'en' | Language code |
| `theme` | string | 'modern' | Theme name |
| `format` | string | 'yyyy-mm-dd' | Date format |
| `placeholder` | string | 'Select date...' | Input placeholder |
| `closeOnSelect` | boolean | true | Close popup on date selection |
| `showIcon` | boolean | true | Show calendar icon |
| `onSelect` | function | null | Callback when date is selected |

#### Methods

##### `setValue(date)`
Set the datepicker value
```javascript
datepicker.setValue(new Date());
datepicker.setValue('2024-01-15');
```

##### `getValue()`
Get the formatted string value
```javascript
const value = datepicker.getValue(); // '2024-01-15'
```

##### `getDate()`
Get the Date object
```javascript
const date = datepicker.getDate(); // Date object
```

##### `show()` / `hide()` / `toggle()`
Control popup visibility
```javascript
datepicker.show();
datepicker.hide();
datepicker.toggle();
```

### DateDisplay Class

#### Constructor
```javascript
const display = new DateDisplay(selector, options);
```

#### Methods

##### `setDate(date)`
Update the displayed date
```javascript
display.setDate(new Date());
```

##### `setCalendarType(type)`
Change the calendar type
```javascript
display.setCalendarType('ethiopian');
```

## 📅 DatePicker Usage

### Basic DatePicker
```html
<input type="text" id="datepicker">
<script>
  new ModernDatePicker('#datepicker');
</script>
```

### Ethiopian DatePicker
```html
<input type="text" id="ethiopian-date">
<script>
  new ModernDatePicker('#ethiopian-date', {
    calendar: 'ethiopian',
    language: 'am',
    theme: 'green',
    format: 'dd/mm/yyyy'
  });
</script>
```

### Auto-Initialize with Data Attributes
```html
<input type="text" 
       data-datepicker='{"calendar":"ethiopian","language":"am"}'
       placeholder="Select Ethiopian date">
```

### Form Integration
```html
<form id="myForm">
  <label>Birth Date:</label>
  <input type="text" name="birthdate" id="birth-date" required>
  
  <label>Join Date:</label>
  <input type="text" name="joindate" id="join-date" required>
  
  <button type="submit">Submit</button>
</form>

<script>
  new ModernDatePicker('#birth-date', {
    format: 'yyyy-mm-dd',
    onSelect: (date, formatted) => {
      console.log('Birth date selected:', formatted);
    }
  });
  
  new ModernDatePicker('#join-date', {
    format: 'yyyy-mm-dd'
  });
  
  document.getElementById('myForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Form data:', Object.fromEntries(formData));
  });
</script>
```

### Date Range Picker
```html
<div class="date-range">
  <input type="text" id="start-date" placeholder="Start date">
  <span>to</span>
  <input type="text" id="end-date" placeholder="End date">
</div>

<script>
  const startPicker = new ModernDatePicker('#start-date', {
    onSelect: (date) => {
      // Set minimum date for end picker
      endPicker.calendar.options.minDate = date;
    }
  });
  
  const endPicker = new ModernDatePicker('#end-date', {
    onSelect: (date) => {
      // Set maximum date for start picker
      startPicker.calendar.options.maxDate = date;
    }
  });
</script>
```

### Programmatic Control
```javascript
const datepicker = new ModernDatePicker('#my-input');

// Set today's date
datepicker.setValue(new Date());

// Set specific date
datepicker.setValue('2024-12-25');

// Get current value
const value = datepicker.getValue();
const dateObj = datepicker.getDate();

// Show/hide programmatically
datepicker.show();
datepicker.hide();

// Destroy when done
datepicker.destroy();
```

### Validation Example
```html
<div class="form-group">
  <label>Select Date:</label>
  <input type="text" id="validated-date" required>
  <div class="error-message" id="date-error"></div>
</div>

<script>
  const datepicker = new ModernDatePicker('#validated-date', {
    onSelect: (date, formatted) => {
      // Validate date
      const today = new Date();
      const errorDiv = document.getElementById('date-error');
      
      if (date > today) {
        errorDiv.textContent = 'Date cannot be in the future';
        errorDiv.style.color = 'red';
      } else {
        errorDiv.textContent = '';
      }
    }
  });
</script>
```

### CSS Customization
```css
/* Custom datepicker styles */
.modern-datepicker-input {
  border: 2px solid #your-color;
  border-radius: 10px;
}

.modern-datepicker-input:focus {
  border-color: #your-focus-color;
  box-shadow: 0 0 0 3px rgba(your-color, 0.1);
}

.datepicker-icon {
  color: #your-icon-color;
}

/* Ethiopian datepicker theme */
.ethiopian-datepicker .modern-datepicker-input {
  border-color: #11998e;
}
```

## 🌍 Calendar Types

### Gregorian Calendar
- Standard international calendar
- 12 months with varying days
- Leap year every 4 years (with exceptions)

```javascript
const gregorian = new ModernCalendar('#cal', {
    calendar: 'gregorian'
});
```

### Ethiopian Calendar
- 13 months (12 months of 30 days + Pagume)
- Pagume has 5 days (6 in leap years)
- 7-8 years behind Gregorian calendar
- New Year on September 11 (Gregorian)

```javascript
const ethiopian = new ModernCalendar('#cal', {
    calendar: 'ethiopian',
    language: 'am'
});
```

### Islamic Calendar
- Lunar-based calendar
- 12 months of alternating 29-30 days
- Approximately 354 days per year

```javascript
const islamic = new ModernCalendar('#cal', {
    calendar: 'islamic',
    language: 'ar'
});
```

## 🗣️ Localization

### Supported Languages

#### English (en)
```javascript
{
    language: 'en',
    monthNames: ['January', 'February', ...],
    dayNames: ['Sunday', 'Monday', ...]
}
```

#### Amharic (am) - አማርኛ
```javascript
{
    language: 'am',
    monthNames: ['መስከረም', 'ጥቅምት', ...],
    dayNames: ['እሑድ', 'ሰኞ', ...]
}
```

#### Afaan Oromo (oro)
```javascript
{
    language: 'oro',
    monthNames: ['Fuulbaana', 'Onkolooleessaa', ...],
    dayNames: ['Wiixata', 'Kibxata', ...]
}
```

### Adding New Languages

#### JavaScript
```javascript
// Add to getMonthNames() and getDayNames() methods
const monthNames = {
    en: [...],
    am: [...],
    oro: [...],
    newLang: ['Month1', 'Month2', ...] // Add your language
};
```

#### Python
```python
class NewLanguageLocale(BaseLocale):
    def __init__(self):
        super().__init__()
        self.month_names = ['Month1', 'Month2', ...]
        self.day_names = ['Day1', 'Day2', ...]

# Register in ModernCalendar
self.languages['newLang'] = NewLanguageLocale()
```

## 🎨 Themes

### Available Themes

#### Modern (Default)
```css
--primary-color: #667eea;
--secondary-color: #764ba2;
--accent-color: #f093fb;
```

#### Dark
```css
--primary-color: #2c3e50;
--secondary-color: #34495e;
--accent-color: #e74c3c;
```

#### Green
```css
--primary-color: #11998e;
--secondary-color: #38ef7d;
--accent-color: #06d6a0;
```

#### Purple
```css
--primary-color: #8e44ad;
--secondary-color: #9b59b6;
--accent-color: #e056fd;
```

#### Orange
```css
--primary-color: #ff6348;
--secondary-color: #ff7675;
--accent-color: #fdcb6e;
```

### Creating Custom Themes

#### CSS
```css
.theme-custom {
    --primary-color: #your-primary;
    --secondary-color: #your-secondary;
    --accent-color: #your-accent;
    --success-color: #your-success;
    --warning-color: #your-warning;
}
```

#### JavaScript
```javascript
calendar.setTheme('custom');
```

## 🔧 Advanced Usage

### Event Handling
```javascript
const calendar = new ModernCalendar('#calendar', {
    onDateSelect: function(date) {
        console.log('Date selected:', date);
        // Load events for this date
        loadEvents(date);
    },
    onMonthChange: function(date) {
        console.log('Month changed:', date);
        // Update month-specific data
        updateMonthData(date);
    }
});
```

### Multi-Calendar Display
```javascript
// Gregorian Calendar
const gregorianCal = new ModernCalendar('#gregorian', {
    calendar: 'gregorian',
    theme: 'modern'
});

// Ethiopian Calendar
const ethiopianCal = new ModernCalendar('#ethiopian', {
    calendar: 'ethiopian',
    language: 'am',
    theme: 'green'
});

// Sync calendars
gregorianCal.options.onDateSelect = function(date) {
    ethiopianCal.setDate(date);
};
```

### Date Conversion Utilities
```javascript
// Convert Gregorian to Ethiopian
function gregorianToEthiopian(date) {
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
}
```

## 🧪 Testing

### Unit Tests
```javascript
// Test Ethiopian calendar conversion
const testDate = new Date(2017, 5, 12); // June 12, 2017
const ethDate = gregorianToEthiopian(testDate);
console.assert(ethDate.year === 2009, 'Ethiopian year should be 2009');
console.assert(ethDate.month === 10, 'Ethiopian month should be 10 (Sene)');
```

### Integration Tests
```javascript
// Test calendar initialization
const calendar = new ModernCalendar('#test-calendar', {
    calendar: 'ethiopian',
    language: 'am'
});

// Verify calendar is rendered
const calendarElement = document.querySelector('#test-calendar .modern-calendar');
console.assert(calendarElement !== null, 'Calendar should be rendered');

// Test datepicker
const datepicker = new ModernDatePicker('#test-input');
datepicker.setValue('2024-01-15');
console.assert(datepicker.getValue() === '2024-01-15', 'DatePicker value should be set');
``` calendarElement = document.querySelector('#test-calendar .modern-calendar');
console.assert(calendarElement !== null, 'Calendar should be rendered');
```

## 🚀 Performance Optimization

### Lazy Loading
```javascript
// Load calendar only when needed
function loadCalendar() {
    if (!window.calendarLoaded) {
        const calendar = new ModernCalendar('#calendar');
        window.calendarLoaded = true;
    }
}

// Load on user interaction
document.getElementById('show-calendar').addEventListener('click', loadCalendar);
```

### Memory Management
```javascript
// Destroy calendar when not needed
function cleanup() {
    if (window.calendar) {
        window.calendar.destroy();
        window.calendar = null;
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
```

## 🤝 Contributing

### Development Setup
```bash
# Clone repository
git clone https://github.com/yourusername/modern-calendar-system.git
cd modern-calendar-system

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Code Style
- Use ES6+ features
- Follow JSDoc comments
- Maintain consistent indentation
- Use meaningful variable names

### Pull Request Process
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

## 🆘 Support

- **GitHub Issues**: [Report bugs](https://github.com/yourusername/modern-calendar-system/issues)
- **Documentation**: [Full docs](https://github.com/yourusername/modern-calendar-system/docs)
- **Examples**: [Live examples](https://yourusername.github.io/modern-calendar-system)

## 🔗 Links

- **GitHub Repository**: https://github.com/yourusername/modern-calendar-system
- **Live Demo**: https://yourusername.github.io/modern-calendar-system
- **NPM Package**: https://www.npmjs.com/package/modern-calendar-system
- **Documentation**: https://modern-calendar-system.readthedocs.io