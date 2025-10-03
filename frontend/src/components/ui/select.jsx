import React from 'react';

// Simple Select Component
export const Select = ({ value, onValueChange, children, className = '', placeholder, ...props }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
};

// Simple Select Item
export const SelectItem = ({ value, children, ...props }) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
};

// For compatibility - these don't do anything but prevent errors
export const SelectTrigger = ({ children, ...props }) => <div {...props}>{children}</div>;
export const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectGroup = ({ children }) => <>{children}</>;
export const SelectLabel = ({ children, className = '' }) => (
  <span className={`text-sm text-gray-500 ${className}`}>{children}</span>
);
export const SelectSeparator = ({ className = '' }) => (
  <hr className={`border-gray-200 ${className}`} />
);
export const SelectScrollUpButton = () => null;
export const SelectScrollDownButton = () => null;
