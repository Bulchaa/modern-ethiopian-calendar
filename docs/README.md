# Modern Calendar System Documentation

## Overview

The Modern Calendar System is a comprehensive, multi-language calendar solution that supports various calendar types (Gregorian, Ethiopian, Islamic) with modern, colorful UI across multiple programming languages and frameworks.

## Features

- 🌍 **Multi-Calendar Support**: Gregorian, Ethiopian, Islamic calendars
- 🎨 **Modern UI**: Beautiful, colorful, responsive design with animations
- 💻 **Multi-Platform**: HTML/JS, React, Next.js, Python, PHP implementations
- 🌐 **Multi-Language**: English, Amharic, Arabic support
- 📱 **Responsive**: Mobile-friendly design
- 🎯 **Easy Integration**: Simple APIs and components
- 🔧 **Customizable**: Themes, languages, and behaviors

## Quick Start Guide

### HTML/JavaScript Implementation

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/modern-calendar.css">
</head>
<body>
    <div id="calendar"></div>
    <div id="date-display"></div>
    
    <script src="js/modern-calendar.js"></script>
    <script>
        // Initialize calendar
        const calendar = new ModernCalendar('#calendar', {
            calendar: 'ethiopian',
            language: 'am',
            theme: 'modern',
            onDateSelect: function(date) {
                console.log('Selected:', date);
            }
        });
        
        // Initialize date display
        const dateDisplay = new DateDisplay('#date-display', {
            calendar: 'ethiopian',
            language: 'am'
        });
    </script>
</body>
</html>
```

### React Implementation

```jsx
import React, { useState } from 'react';
import ModernCalendar, { DateDisplay } from './components/ModernCalendar';

function App() {
    const [selectedDate, setSelectedDate] = useState(null);
    
    return (
        <div>
            <ModernCalendar
                calendar="ethiopian"
                language="am"
                theme="modern"
                onDateSelect={setSelectedDate}
            />
            
            {selectedDate && (
                <DateDisplay 
                    date={selectedDate}
                    calendar="ethiopian"
                    language="am"
                />
            )}
        </div>
    );
}
```

### Next.js Implementation

```jsx
import ModernCalendar from '../components/ModernCalendar';

export default function CalendarPage() {
    return (
        <div>
            <h1>My Calendar App</h1>
            <ModernCalendar
                calendar="gregorian"
                language="en"
                theme="modern"
            />
        </div>
    );
}
```

### Python Implementation

```python
from modern_calendar import ModernCalendar, DateDisplay
from datetime import datetime

# Initialize calendar
calendar = ModernCalendar('ethiopian', 'am')

# Get today's date
today = calendar.today()
print(f"Today: {calendar.format_date(today)}")

# Get date information
date_info = calendar.get_date_info(today)
print(f"Date Info: {date_info}")

# Use DateDisplay component
date_display = DateDisplay('ethiopian', 'am')
print(f"Formatted: {date_display.display_date()}")
```

### PHP Implementation

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

// Use DateDisplay component
$dateDisplay = new DateDisplay('ethiopian', 'am');
echo $dateDisplay->generateHtmlDisplay();
?>
```

## Configuration Options

### Calendar Types

- `gregorian`: Standard Gregorian calendar
- `ethiopian`: Ethiopian calendar (13 months)
- `islamic`: Islamic/Hijri calendar

### Languages

- `en`: English
- `am`: Amharic (አማርኛ)
- `ar`: Arabic (العربية)

### Themes

- `modern`: Default modern theme with gradients
- `dark`: Dark theme
- `green`: Green gradient theme
- `purple`: Purple gradient theme
- `orange`: Orange gradient theme

### Component Options

#### ModernCalendar Options

```javascript
{
    calendar: 'gregorian',        // Calendar type
    language: 'en',               // Language
    theme: 'modern',              // Theme
    showWeekNumbers: false,       // Show week numbers
    firstDayOfWeek: 0,           // First day of week (0=Sunday)
    onDateSelect: null,          // Date selection callback
    onMonthChange: null,         // Month change callback
    initialDate: null            // Initial selected date
}
```

#### DateDisplay Options

```javascript
{
    date: new Date(),            // Date to display
    calendar: 'gregorian',       // Calendar type
    language: 'en',              // Language
    format: 'full'               // Format type (full, short, medium)
}
```

## API Reference

### ModernCalendar Class

#### Methods

- `today()`: Get current date
- `formatDate(date, formatType)`: Format date according to calendar
- `getMonthCalendar(year, month)`: Get calendar grid for month
- `addDays(date, days)`: Add days to date
- `addMonths(date, months)`: Add months to date
- `isWeekend(date)`: Check if date is weekend
- `isHoliday(date)`: Check if date is holiday
- `getDateInfo(date)`: Get comprehensive date information

#### Events

- `onDateSelect(date)`: Fired when date is selected
- `onMonthChange(date)`: Fired when month changes

### DateDisplay Class

#### Methods

- `displayDate(date, formatType)`: Display formatted date
- `displayDateInfo(date)`: Display date information
- `setDate(date)`: Update displayed date
- `setCalendarType(type)`: Change calendar type

## Styling and Customization

### CSS Custom Properties

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    --success-color: #4facfe;
    --warning-color: #f6d365;
    --danger-color: #fa709a;
    --border-radius: 12px;
    --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
```

### Custom Themes

Create custom themes by extending the CSS:

```css
.theme-custom {
    --primary-color: #your-color;
    --secondary-color: #your-secondary-color;
}
```

### Responsive Breakpoints

- Desktop: > 768px
- Tablet: 481px - 768px
- Mobile: ≤ 480px

## Calendar Conversion

### Ethiopian Calendar

The Ethiopian calendar has 13 months:
- 12 months of 30 days each
- 1 month (Pagumē) of 5-6 days
- New Year starts on September 11 (Gregorian)
- 7-8 years behind Gregorian calendar

### Islamic Calendar

The Islamic calendar is lunar-based:
- 12 months of alternating 29-30 days
- Approximately 354 days per year
- Dates shift relative to Gregorian calendar

## Localization

### Adding New Languages

1. **JavaScript/React/Next.js**:
```javascript
const newLocale = {
    monthNames: ['Month1', 'Month2', ...],
    dayNames: ['Day1', 'Day2', ...],
    dayNamesShort: ['D1', 'D2', ...]
};
```

2. **Python**:
```python
class NewLocale(BaseLocale):
    def __init__(self):
        super().__init__()
        self.month_names = ['Month1', 'Month2', ...]
        self.day_names = ['Day1', 'Day2', ...]
```

3. **PHP**:
```php
$locales['new_lang'] = [
    'monthNames' => ['Month1', 'Month2', ...],
    'dayNames' => ['Day1', 'Day2', ...]
];
```

## Examples and Use Cases

### Date Picker Integration

```javascript
const datePicker = new ModernCalendar('#date-picker', {
    calendar: 'gregorian',
    onDateSelect: function(date) {
        document.getElementById('selected-date').value = 
            date.toISOString().split('T')[0];
    }
});
```

### Multi-Calendar Display

```javascript
// Show same date in different calendars
const gregorianCal = new ModernCalendar('#greg-cal', {
    calendar: 'gregorian',
    theme: 'modern'
});

const ethiopianCal = new ModernCalendar('#eth-cal', {
    calendar: 'ethiopian',
    theme: 'green'
});
```

### Event Calendar

```javascript
const eventCalendar = new ModernCalendar('#events', {
    calendar: 'gregorian',
    onDateSelect: function(date) {
        loadEventsForDate(date);
    }
});

function loadEventsForDate(date) {
    // Load and display events for selected date
    fetch(`/api/events?date=${date.toISOString()}`)
        .then(response => response.json())
        .then(events => displayEvents(events));
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Lazy loading for large date ranges
- Virtual scrolling for year views
- Optimized re-rendering in React components
- Minimal DOM manipulation in vanilla JS

## Troubleshooting

### Common Issues

1. **Calendar not displaying**: Check CSS imports
2. **Date conversion errors**: Verify calendar type spelling
3. **Language not working**: Ensure locale is supported
4. **Theme not applying**: Check CSS class names

### Debug Mode

Enable debug logging:

```javascript
const calendar = new ModernCalendar('#cal', {
    debug: true  // Enables console logging
});
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

- GitHub Issues: Report bugs and feature requests
- Documentation: Check this guide and inline comments
- Examples: See demo files in each implementation folder