import React from 'react';

export default function Card({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      {title && <h3 className="font-semibold text-lg">{title}</h3>}
      {subtitle && <div className="text-sm text-gray-500 mb-2">{subtitle}</div>}
      <div>{children}</div>
    </div>
  );
}
