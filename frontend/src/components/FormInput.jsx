import React from 'react';

export default function FormInput({ label, type='text', value, onChange, placeholder }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}
