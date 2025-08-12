# 🌍 Modern Multi-Language Calendar System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Bulchaa/modern-ethiopian-calendar.svg)](https://github.com/Bulchaa/modern-ethiopian-calendar/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Bulchaa/modern-ethiopian-calendar.svg)](https://github.com/Bulchaa/modern-ethiopian-calendar/network)
[![GitHub issues](https://img.shields.io/github/issues/Bulchaa/modern-ethiopian-calendar.svg)](https://github.com/Bulchaa/modern-ethiopian-calendar/issues)

A comprehensive, modern calendar system supporting multiple calendar types with beautiful UI across multiple programming languages and frameworks.

## ✨ Features

- 🌍 **Multi-Calendar Support** - Gregorian, Ethiopian (13 months), Islamic calendars
- 🗣️ **Multi-Language** - English, Amharic (አማርኛ), Afaan Oromo
- 🎨 **Modern UI** - Beautiful gradients, animations, responsive design
- 💻 **Multi-Platform** - HTML/JS, React, Next.js, Python, PHP implementations
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🔧 **Easy Integration** - Simple APIs and comprehensive documentation

## 🚀 Quick Start

### HTML/JavaScript
```html
<link rel="stylesheet" href="css/modern-calendar.css">
<script src="js/modern-calendar.js"></script>

<div id="calendar"></div>
<script>
  const calendar = new ModernCalendar('#calendar', {
    calendar: 'ethiopian',
    language: 'am',
    theme: 'modern'
  });
</script>
```

### React
```jsx
import ModernCalendar from './components/ModernCalendar';

function App() {
  return (
    <ModernCalendar 
      calendar="ethiopian" 
      language="am" 
      theme="modern" 
    />
  );
}
```

### Python
```python
from modern_calendar import ModernCalendar

calendar = ModernCalendar('ethiopian', 'am')
today = calendar.today()
print(calendar.format_date(today))
```

### PHP
```php
<?php
require_once 'ModernCalendar.php';

$calendar = new ModernCalendar('ethiopian', 'am');
echo $calendar->formatDate($calendar->today());
?>
```

## 📦 Installation

### Clone Repository
```bash
git clone https://github.com/Bulchaa/modern-ethiopian-calendar.git
cd modern-ethiopian-calendar
```

### NPM (Coming Soon)
```bash
npm install modern-calendar-system
```

### CDN (Coming Soon)
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Bulchaa/modern-ethiopian-calendar@main/css/datepicker.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Bulchaa/modern-ethiopian-calendar@main/css/modern-calendar.css">
<script src="https://cdn.jsdelivr.net/gh/Bulchaa/modern-ethiopian-calendar@main/js/modern-calendar.js"></script>
```

## 🌍 Supported Calendars

### Gregorian Calendar
Standard international calendar with 12 months

### Ethiopian Calendar
- 13 months (12 months of 30 days + Pagume)
- Pagume has 5 days (6 in leap years)
- 7-8 years behind Gregorian calendar

### Islamic Calendar
Lunar-based calendar with 12 months of alternating 29-30 days

## 🗣️ Supported Languages

- **English** - Full English support
- **Amharic (አማርኛ)** - Ethiopian language
- **Afaan Oromo** - Oromo language

## 🎨 Themes

- **Modern** - Default gradient theme
- **Dark** - Dark mode theme
- **Green** - Nature-inspired theme
- **Purple** - Royal purple theme
- **Orange** - Warm sunset theme

## 📁 Project Structure

```
modern-calendar-system/
├── html/                   # HTML/JS demo
├── react/                  # React components
├── nextjs/                 # Next.js implementation
├── python/                 # Python implementation
├── php/                    # PHP implementation
├── css/                    # Modern CSS styles
├── js/                     # Core JavaScript
├── docs/                   # Documentation
├── index.html              # Main demo page
└── README.md
```

## 🔧 Configuration Options

```javascript
{
  calendar: 'gregorian|ethiopian|islamic',
  language: 'en|am|oro',
  theme: 'modern|dark|green|purple|orange',
  firstDayOfWeek: 0, // 0=Sunday, 1=Monday
  onDateSelect: function(date) { },
  onMonthChange: function(date) { }
}
```

## 📖 Documentation

- **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Complete API reference
- **[Installation Guide](docs/INSTALLATION.md)** - Setup instructions
- **[Live Demo](https://yourusername.github.io/modern-calendar-system)** - Interactive examples

## 🧪 Examples

### Date Conversion
```javascript
// Convert June 12, 2017 to Ethiopian calendar
const gregorianDate = new Date(2017, 5, 12);
const ethiopianDate = gregorianToEthiopian(gregorianDate);
console.log(ethiopianDate); // {year: 2009, month: 10, day: 5}
```

### Multi-Calendar Display
```javascript
// Show same date in different calendars
const gregorianCal = new ModernCalendar('#gregorian', {
  calendar: 'gregorian',
  theme: 'modern'
});

const ethiopianCal = new ModernCalendar('#ethiopian', {
  calendar: 'ethiopian',
  language: 'am',
  theme: 'green'
});
```

### Event Handling
```javascript
const calendar = new ModernCalendar('#calendar', {
  onDateSelect: function(date) {
    console.log('Selected:', date);
    loadEventsForDate(date);
  }
});
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Clone repository
git clone https://github.com/Bulchaa/modern-ethiopian-calendar.git
cd modern-ethiopian-calendar

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

## 📞 Contact

- **GitHub**: [@Bulchaa](https://github.com/Bulchaa)
- **Issues**: [GitHub Issues](https://github.com/Bulchaa/modern-ethiopian-calendar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Bulchaa/modern-ethiopian-calendar/discussions)

## 🔗 Links

- **Live Demo**: https://oroetcal.qubeteck.com
- **Documentation**: https://Bulchaa.github.io/modern-ethiopian-calendar/docs
- **NPM Package**: https://www.npmjs.com/package/modern-calendar-system (Coming Soon)

## 📊 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers

## 🏆 Acknowledgments

- Original Ethiopian calendar implementation
- jQuery Calendars plugin inspiration
- Community contributors

---

**Made with qubeteck technology/bulcha abdi for the global community**