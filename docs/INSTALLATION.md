# Installation Guide

## Prerequisites

### For HTML/JavaScript
- Modern web browser
- Web server (optional, for local development)

### For React
- Node.js 14+
- npm or yarn

### For Next.js
- Node.js 14+
- npm or yarn

### For Python
- Python 3.7+
- pip

### For PHP
- PHP 7.4+
- Web server (Apache/Nginx)

## Installation Instructions

### HTML/JavaScript

1. **Download Files**
   ```bash
   # Copy the following files to your project:
   css/modern-calendar.css
   js/modern-calendar.js
   ```

2. **Include in HTML**
   ```html
   <link rel="stylesheet" href="path/to/modern-calendar.css">
   <script src="path/to/modern-calendar.js"></script>
   ```

3. **Initialize**
   ```html
   <div id="my-calendar"></div>
   <script>
       const calendar = new ModernCalendar('#my-calendar');
   </script>
   ```

### React

1. **Install Dependencies**
   ```bash
   npm install react react-dom
   # or
   yarn add react react-dom
   ```

2. **Copy Component Files**
   ```bash
   # Copy to your src/components/ directory:
   ModernCalendar.jsx
   ModernCalendar.css
   ```

3. **Import and Use**
   ```jsx
   import ModernCalendar from './components/ModernCalendar';
   
   function App() {
       return <ModernCalendar />;
   }
   ```

### Next.js

1. **Create Next.js App**
   ```bash
   npx create-next-app@latest my-calendar-app
   cd my-calendar-app
   ```

2. **Copy Component Files**
   ```bash
   # Copy to components/ directory:
   components/ModernCalendar.js
   components/ModernCalendar.module.css
   ```

3. **Use in Pages**
   ```jsx
   import ModernCalendar from '../components/ModernCalendar';
   
   export default function Home() {
       return <ModernCalendar />;
   }
   ```

### Python

1. **Install Python Package**
   ```bash
   # Copy modern_calendar.py to your project
   # Or install via pip (if published):
   pip install modern-calendar-system
   ```

2. **Import and Use**
   ```python
   from modern_calendar import ModernCalendar
   
   calendar = ModernCalendar('gregorian', 'en')
   print(calendar.format_date(calendar.today()))
   ```

### PHP

1. **Copy PHP Files**
   ```bash
   # Copy to your PHP project:
   ModernCalendar.php
   ```

2. **Include and Use**
   ```php
   <?php
   require_once 'ModernCalendar.php';
   
   $calendar = new ModernCalendar('gregorian', 'en');
   echo $calendar->formatDate($calendar->today());
   ?>
   ```

## CDN Installation (HTML/JavaScript)

For quick setup, you can use CDN links:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/your-repo/modern-calendar-system/css/modern-calendar.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/your-repo/modern-calendar-system/js/modern-calendar.js"></script>
```

## Package Manager Installation

### npm (for React/Next.js projects)

```bash
# If published to npm:
npm install modern-calendar-system

# Then import:
import { ModernCalendar } from 'modern-calendar-system';
```

### Composer (for PHP projects)

```bash
# If published to Packagist:
composer require your-vendor/modern-calendar-system

# Then use:
require_once 'vendor/autoload.php';
use ModernCalendar\ModernCalendar;
```

### pip (for Python projects)

```bash
# If published to PyPI:
pip install modern-calendar-system

# Then import:
from modern_calendar import ModernCalendar
```

## Development Setup

### Clone Repository

```bash
git clone https://github.com/your-repo/modern-calendar-system.git
cd modern-calendar-system
```

### HTML/JavaScript Development

```bash
# Serve files locally
python -m http.server 8000
# or
npx serve .

# Open browser to http://localhost:8000/html/
```

### React Development

```bash
cd react/
npm install
npm start
```

### Next.js Development

```bash
cd nextjs/
npm install
npm run dev
```

### Python Development

```bash
cd python/
python modern_calendar.py
```

### PHP Development

```bash
cd php/
php -S localhost:8000
# Open browser to http://localhost:8000/ModernCalendar.php
```

## Configuration

### Environment Variables

Create `.env` file for configuration:

```env
# Default calendar type
DEFAULT_CALENDAR=gregorian

# Default language
DEFAULT_LANGUAGE=en

# Default theme
DEFAULT_THEME=modern

# Enable debug mode
DEBUG=false
```

### Build Configuration

#### Webpack (for custom builds)

```javascript
// webpack.config.js
module.exports = {
    entry: './src/modern-calendar.js',
    output: {
        filename: 'modern-calendar.min.js',
        library: 'ModernCalendar',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};
```

#### Rollup (alternative bundler)

```javascript
// rollup.config.js
import css from 'rollup-plugin-css-only';

export default {
    input: 'src/modern-calendar.js',
    output: {
        file: 'dist/modern-calendar.js',
        format: 'umd',
        name: 'ModernCalendar'
    },
    plugins: [
        css({ output: 'modern-calendar.css' })
    ]
};
```

## Testing Installation

### HTML/JavaScript Test

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/modern-calendar.css">
</head>
<body>
    <div id="test-calendar"></div>
    <script src="js/modern-calendar.js"></script>
    <script>
        const calendar = new ModernCalendar('#test-calendar');
        console.log('Calendar initialized successfully!');
    </script>
</body>
</html>
```

### React Test

```jsx
import React from 'react';
import { render } from '@testing-library/react';
import ModernCalendar from './ModernCalendar';

test('renders calendar', () => {
    render(<ModernCalendar />);
    // Add assertions
});
```

### Python Test

```python
from modern_calendar import ModernCalendar

def test_calendar():
    calendar = ModernCalendar()
    today = calendar.today()
    assert today is not None
    print("Python calendar test passed!")

if __name__ == "__main__":
    test_calendar()
```

### PHP Test

```php
<?php
require_once 'ModernCalendar.php';

$calendar = new ModernCalendar();
$today = $calendar->today();

if ($today) {
    echo "PHP calendar test passed!\n";
} else {
    echo "PHP calendar test failed!\n";
}
?>
```

## Troubleshooting Installation

### Common Issues

1. **CSS not loading**
   - Check file paths
   - Verify web server is serving CSS files
   - Check browser console for 404 errors

2. **JavaScript errors**
   - Ensure modern browser support
   - Check for conflicting libraries
   - Verify script loading order

3. **React/Next.js build errors**
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Verify import paths

4. **Python import errors**
   - Check Python version (3.7+)
   - Verify file paths
   - Install missing dependencies

5. **PHP errors**
   - Check PHP version (7.4+)
   - Verify file permissions
   - Check error logs

### Debug Mode

Enable debug mode to troubleshoot:

```javascript
const calendar = new ModernCalendar('#calendar', {
    debug: true
});
```

### Browser Console

Check browser console for errors:
- Press F12 to open developer tools
- Look for red error messages
- Check Network tab for failed requests

### Version Compatibility

| Component | Minimum Version |
|-----------|----------------|
| Node.js   | 14.0.0         |
| React     | 16.8.0         |
| Next.js   | 10.0.0         |
| Python    | 3.7.0          |
| PHP       | 7.4.0          |

## Next Steps

After successful installation:

1. Read the [API Documentation](README.md)
2. Check out [Examples](EXAMPLES.md)
3. Customize [Themes and Styling](STYLING.md)
4. Learn about [Calendar Conversion](CONVERSION.md)

## Support

If you encounter issues:

1. Check this installation guide
2. Review the troubleshooting section
3. Search existing GitHub issues
4. Create a new issue with:
   - Your environment details
   - Error messages
   - Steps to reproduce