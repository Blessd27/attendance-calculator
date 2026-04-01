import React from 'react';

const CalculatorInput = ({ label, value, onChange, min, helpText }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type="number"
        className="input-field"
        placeholder={`Enter ${label.toLowerCase()}`}
        value={value}
        onChange={onChange}
        min={min || 0}
      />
      {helpText && <span className="text-sm">{helpText}</span>}
    </div>
  );
};

export default CalculatorInput;
