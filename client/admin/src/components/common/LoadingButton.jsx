import React from 'react';

const LoadingButton = ({ 
  isLoading, 
  onClick, 
  children, 
  className = '', 
  disabled = false,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center gap-2 ${className} ${
        isLoading || disabled ? 'opacity-75 cursor-not-allowed' : ''
      }`}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

export default LoadingButton;