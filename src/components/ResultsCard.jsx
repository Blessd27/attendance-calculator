import React, { useState, useEffect } from 'react';

// A simple hook to animate numbers
const useAnimatedNumber = (value, duration = 400) => {
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = current;
    const change = value - startValue;
    
    // Don't animate if it's identical or a tiny difference
    if (change === 0) return;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(startValue + change * easeProgress);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  return current;
};

const ResultsCard = ({ percentage, target, bunkable, required, total, attended }) => {
  const animPercentage = useAnimatedNumber(percentage);
  
  // Choose color and message
  const isHealthy = percentage >= target;
  const isDanger = percentage < target;
  
  let statusColorClass = 'text-primary';
  if (isHealthy && bunkable >= 0) statusColorClass = 'text-success';
  if (isDanger) statusColorClass = 'text-warning';

  let funMessage = "You're all set! 📚";
  if (total === 0) {
    funMessage = "Enter some classes to begin 🎓";
  } else if (percentage === 100) {
    funMessage = "Perfect score! Nerd alert 🤓";
  } else if (isHealthy) {
    if (bunkable > 0) funMessage = `You can safely miss ${bunkable} class${bunkable > 1 ? 'es' : ''}. Keep it balanced! ⚖️`;
    else funMessage = "You are exactly on target! Don't miss the next one ⚠️";
  } else if (isDanger) {
    if (required > 5) funMessage = "Bro you might need to pray to pass 🙏";
    else funMessage = `Please attend your next ${required} class${required > 1 ? 'es' : ''} to reach ${target}% 🏃‍♂️`;
  }

  return (
    <div className="status-box">
      <div className={`percentage-display ${statusColorClass}`}>
        {Number.isNaN(animPercentage) ? 0 : animPercentage.toFixed(2)}%
      </div>
      
      <div className="progress-rail">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${Math.min(100, Math.max(0, percentage))}%`,
            backgroundColor: isHealthy ? 'var(--success-color)' : 'var(--warning-color)'
          }}
        />
      </div>

      <div className="status-message mt-4">
        {total === 0 && <span className="status-sub">Waiting for input...</span>}
        
        {total > 0 && isHealthy && (
          <div>Status: You can bunk <span className="text-success">{bunkable}</span> more classes</div>
        )}
        
        {total > 0 && isDanger && (
          <div>Status: You need to attend <span className="text-warning">{required}</span> more classes</div>
        )}
      </div>

      <div className="status-sub" style={{ marginTop: '0.5rem', fontWeight: 500 }}>
        {funMessage}
      </div>
    </div>
  );
};

export default ResultsCard;
