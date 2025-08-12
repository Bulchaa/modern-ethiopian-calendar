import React, { useState } from 'react';
import ModernCalendar, { DateDisplay } from './ModernCalendar';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('modern');
  const [currentCalendar, setCurrentCalendar] = useState('gregorian');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const themes = ['modern', 'dark', 'green', 'purple', 'orange'];
  const calendars = [
    { value: 'gregorian', label: 'Gregorian' },
    { value: 'ethiopian', label: 'Ethiopian' }
    
  ];
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'am', label: 'አማርኛ' },
    { value: 'or', label: 'Oromo' }
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleMonthChange = (date) => {
    console.log('Month changed to:', date);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>🌍 Modern Calendar System - React</h1>
        <p>Interactive calendar components with multi-language support</p>
      </div>

      <div className="controls-panel">
        <div className="control-group">
          <label>Theme:</label>
          <select 
            value={currentTheme} 
            onChange={(e) => setCurrentTheme(e.target.value)}
          >
            {themes.map(theme => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Calendar:</label>
          <select 
            value={currentCalendar} 
            onChange={(e) => setCurrentCalendar(e.target.value)}
          >
            {calendars.map(cal => (
              <option key={cal.value} value={cal.value}>
                {cal.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Language:</label>
          <select 
            value={currentLanguage} 
            onChange={(e) => setCurrentLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="demo-grid">
        <div className="demo-section">
          <h3>📅 Interactive Calendar</h3>
          <ModernCalendar
            calendar={currentCalendar}
            language={currentLanguage}
            theme={currentTheme}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
          />
          
          {selectedDate && (
            <div className="selected-date-info">
              <h4>Selected Date:</h4>
              <DateDisplay 
                date={selectedDate}
                calendar={currentCalendar}
                language={currentLanguage}
              />
            </div>
          )}
        </div>

        <div className="demo-section">
          <h3>🇪🇹 Ethiopian Calendar</h3>
          <ModernCalendar
            calendar="ethiopian"
            language="am"
            theme="green"
            onDateSelect={(date) => console.log('Ethiopian date selected:', date)}
          />
        </div>

        <div className="demo-section">
          <h3>📊 Date Display Components</h3>
          <DateDisplay 
            date={new Date()}
            calendar="gregorian"
            language="en"
          />
          <DateDisplay 
            date={new Date()}
            calendar="ethiopian"
            language="am"
          />
        </div>

        <div className="demo-section">
          <h3>🎨 Theme Showcase</h3>
          <div className="theme-grid">
            {themes.map(theme => (
              <div key={theme} className="theme-item">
                <h4>{theme.charAt(0).toUpperCase() + theme.slice(1)}</h4>
                <ModernCalendar
                  calendar="gregorian"
                  language="en"
                  theme={theme}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;