import React, { useState, useEffect } from 'react';
import './index.css';
import CalculatorInput from './components/CalculatorInput';
import ResultsCard from './components/ResultsCard';

function App() {
  const [conducted, setConducted] = useState('');
  const [attended, setAttended] = useState('');
  const [target, setTarget] = useState(75);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode classes on root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  // Handle inputs safely
  const handleNumChange = (setter) => (e) => {
    const val = e.target.value;
    if (val === '') {
      setter('');
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) setter(num);
  };

  const handleReset = () => {
    setConducted('');
    setAttended('');
    setTarget(75);
  };

  // Logic Calculations
  const cNum = typeof conducted === 'number' ? conducted : 0;
  const aNum = typeof attended === 'number' ? attended : 0;
  
  let percentage = 0;
  let bunkable = -1;
  let required = -1;
  const isInvalid = aNum > cNum;

  if (cNum > 0 && !isInvalid) {
    percentage = (aNum / cNum) * 100;
    
    // Formula for bunk: floor((attended - (target%/100 * total)) / (target%/100))
    // Formula for required: ceil((target% * total - 100 * attended) / (100 - target%))
    if (percentage >= target) {
      bunkable = Math.floor((aNum - (target / 100 * cNum)) / (target / 100));
    } else {
      required = Math.ceil((target * cNum - 100 * aNum) / (100 - target));
    }
  }

  // Icons for theme
  const SunIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  );

  const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="title">Attendance Calculator</h1>
        <button className="theme-btn" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Toggle dark mode">
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <div className="card-body">
        {/* Input Form */}
        <div className="flex flex-col gap-4">
          <CalculatorInput 
            label="Total Classes Conducted" 
            value={conducted} 
            onChange={handleNumChange(setConducted)}
          />
          
          <CalculatorInput 
            label="Classes Attended" 
            value={attended} 
            onChange={handleNumChange(setAttended)} 
            helpText={isInvalid ? <span className="text-warning">Attended cannot be greater than Total!</span> : null}
          />

          <div className="input-group">
            <label>Target Percentage</label>
            <select 
              className="input-field" 
              value={target} 
              onChange={(e) => setTarget(Number(e.target.value))}
            >
              {[65, 70, 75, 80, 85, 90].map(val => (
                <option key={val} value={val}>{val}%</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {!isInvalid && (
          <>
            <ResultsCard 
              percentage={percentage} 
              target={target} 
              bunkable={bunkable} 
              required={required}
              total={cNum}
              attended={aNum}
            />
          </>
        )}

        <div className="flex justify-between items-center mt-4">
          <button className="reset-btn" onClick={handleReset}>Reset Data</button>
        </div>
      </div>
    </div>
  );
}

export default App;
