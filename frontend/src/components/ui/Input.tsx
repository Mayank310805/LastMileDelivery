import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && (
          <label className="input-label">
            {label}
          </label>
        )}
        <div className="input-container">
          {icon && (
            <div className="input-icon">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`form-input ${icon ? 'has-icon' : ''} ${error ? 'is-error' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="input-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
