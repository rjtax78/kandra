import React from 'react';

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-48">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-gray-200"></div>
    </div>
  );
}
