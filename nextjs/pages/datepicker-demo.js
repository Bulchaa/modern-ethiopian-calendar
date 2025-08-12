import { useState } from 'react';
import Head from 'next/head';
import ModernDatePicker from '../components/ModernDatePicker';

export default function DatePickerDemo() {
  const [selectedDates, setSelectedDates] = useState({});
  const [formData, setFormData] = useState({});

  const handleDateSelect = (type) => (date, formatted) => {
    setSelectedDates(prev => ({
      ...prev,
      [type]: { date, formatted }
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    setFormData(data);
  };

  return (
    <>
      <Head>
        <title>DatePicker Demo - Modern Calendar System</title>
        <meta name="description" content="Next.js DatePicker demo with Ethiopian, Gregorian, and Islamic calendars" />
      </Head>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1>🌍 Modern DatePicker Demo</h1>
          <p>Next.js implementation with multi-calendar support</p>
        </header>

        <section style={{ marginBottom: '40px' }}>
          <h2>📅 Basic DatePickers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
              <h3>Gregorian Calendar</h3>
              <ModernDatePicker
                calendar="gregorian"
                language="en"
                theme="modern"
                placeholder="Select Gregorian date..."
                onSelect={handleDateSelect('gregorian')}
              />
              {selectedDates.gregorian && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
                  <strong>Selected:</strong> {selectedDates.gregorian.formatted}<br />
                  <strong>Date Object:</strong> {selectedDates.gregorian.date.toLocaleDateString()}
                </div>
              )}
            </div>

            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
              <h3>Ethiopian Calendar (አማርኛ)</h3>
              <ModernDatePicker
                calendar="ethiopian"
                language="am"
                theme="green"
                placeholder="የኢትዮጵያ ቀን ይምረጡ..."
                onSelect={handleDateSelect('ethiopian')}
              />
              {selectedDates.ethiopian && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
                  <strong>የተመረጠ ቀን:</strong> {selectedDates.ethiopian.formatted}<br />
                  <strong>Gregorian:</strong> {selectedDates.ethiopian.date.toLocaleDateString()}
                </div>
              )}
            </div>

            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
              <h3>Islamic Calendar</h3>
              <ModernDatePicker
                calendar="islamic"
                language="en"
                theme="purple"
                placeholder="Select Islamic date..."
                onSelect={handleDateSelect('islamic')}
              />
              {selectedDates.islamic && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
                  <strong>Selected:</strong> {selectedDates.islamic.formatted}<br />
                  <strong>Gregorian:</strong> {selectedDates.islamic.date.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2>📋 Form Integration</h2>
          <form onSubmit={handleFormSubmit} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Birth Date (Gregorian):</label>
                <ModernDatePicker
                  name="birth_date"
                  calendar="gregorian"
                  language="en"
                  theme="modern"
                  placeholder="Select birth date..."
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ethiopian Date:</label>
                <ModernDatePicker
                  name="ethiopian_date"
                  calendar="ethiopian"
                  language="am"
                  theme="green"
                  placeholder="የኢትዮጵያ ቀን ይምረጡ..."
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name..."
                  style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px' }}
                />
              </div>
            </div>

            <button type="submit" style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Submit Form
            </button>
          </form>

          {Object.keys(formData).length > 0 && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <h3>Form Results:</h3>
              <pre style={{ background: '#e9ecef', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          )}
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2>💻 Code Examples</h2>
          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h3>Basic Usage</h3>
            <pre style={{ background: '#2d3748', color: '#e2e8f0', padding: '15px', borderRadius: '8px', overflow: 'auto' }}>
{`import ModernDatePicker from '../components/ModernDatePicker';

function MyComponent() {
  const handleDateSelect = (date, formatted) => {
    console.log('Selected:', formatted);
  };

  return (
    <ModernDatePicker
      calendar="ethiopian"
      language="am"
      theme="green"
      onSelect={handleDateSelect}
    />
  );
}`}
            </pre>

            <h3>Ethiopian Calendar with Amharic</h3>
            <pre style={{ background: '#2d3748', color: '#e2e8f0', padding: '15px', borderRadius: '8px', overflow: 'auto' }}>
{`<ModernDatePicker
  calendar="ethiopian"
  language="am"
  theme="green"
  format="dd/mm/yyyy"
  placeholder="የኢትዮጵያ ቀን ይምረጡ..."
  onSelect={(date, formatted) => {
    console.log('Ethiopian date:', formatted);
  }}
/>`}
            </pre>
          </div>
        </section>

        <footer style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #ddd', marginTop: '40px' }}>
          <p>Modern Calendar System - Next.js Implementation</p>
          <p>Supports Ethiopian, Gregorian, and Islamic calendars with accurate date conversion</p>
        </footer>
      </div>
    </>
  );
}