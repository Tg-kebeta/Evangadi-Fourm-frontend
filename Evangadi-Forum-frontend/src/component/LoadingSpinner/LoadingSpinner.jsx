import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = '', 
  fullScreen = false,
  overlay = false 
}) => {
  const sizeClasses = {
    small: 'spinner-sm',
    medium: 'spinner-md',
    large: 'spinner-lg'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    success: 'spinner-success',
    danger: 'spinner-danger',
    warning: 'spinner-warning',
    light: 'spinner-light',
    dark: 'spinner-dark'
  };

  const spinnerContent = (
    <div className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
      <div className="spinner-container">
        <div className="spinner-border" role="status" aria-hidden="true">
          <span className="sr-only">Loading...</span>
        </div>
        {text && <div className="spinner-text">{text}</div>}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {spinnerContent}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="loading-overlay">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

// Button Loading Spinner Component
export const ButtonSpinner = ({ loading = false, children, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Inline Loading Spinner for small operations
export const InlineSpinner = ({ size = 'small', color = 'primary' }) => {
  return (
    <span className={`inline-spinner ${size === 'small' ? 'spinner-sm' : 'spinner-md'} ${color === 'primary' ? 'spinner-primary' : 'spinner-secondary'}`}>
      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </span>
  );
};

// Page Loading Component
export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="page-loader">
      <div className="page-loader-content">
        <LoadingSpinner size="large" text={message} />
      </div>
    </div>
  );
};

// Card Loading Component
export const CardLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="card-loader">
      <div className="card-loader-content">
        <LoadingSpinner size="medium" text={message} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
