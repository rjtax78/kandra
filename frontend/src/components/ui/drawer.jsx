import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export const Drawer = ({ open, onClose, children, className = '' }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Trigger animation after render
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Remove from DOM after animation completes
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [open]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Subtle backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isAnimating ? 'opacity-10' : 'opacity-0'
        } pointer-events-none`}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pointer-events-none">
        <div className={`pointer-events-auto w-screen max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl transform transition-all duration-300 ease-out ${
          isAnimating ? 'translate-x-0 scale-100' : 'translate-x-full scale-95'
        } ${className}`}>
          <div className={`flex h-full flex-col bg-white shadow-2xl border-l border-gray-200 transition-all duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DrawerHeader = ({ children, className = '' }) => (
  <div className={`bg-blue-600 px-6 py-4 flex-shrink-0 ${className}`}>
    {children}
  </div>
);

export const DrawerTitle = ({ children, onClose, className = '' }) => (
  <div className="flex items-center justify-between">
    <h2 className={`text-lg font-medium text-white transition-opacity duration-200 ${className}`}>
      {children}
    </h2>
    {onClose && (
      <button
        onClick={onClose}
        className="rounded-md p-2 text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
      >
        <X className="h-5 w-5" />
      </button>
    )}
  </div>
);

export const DrawerContent = ({ children, className = '' }) => (
  <div className={`flex-1 overflow-y-auto ${className}`}>
    <div className="px-6 py-6">
      {children}
    </div>
  </div>
);

export const DrawerFooter = ({ children, className = '' }) => (
  <div className={`bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0 ${className}`}>
    {children}
  </div>
);
