import React from 'react';

export interface HearstPanelProps {
  children: React.ReactNode;
  position?: 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  width?: string;
  className?: string;
}

export default function HearstPanel({
  children,
  position = 'right',
  width = '400px',
  className = ''
}: HearstPanelProps) {
  const positionClasses = {
    left: 'top-0 left-0 h-full',
    right: 'top-0 right-0 h-full',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4'
  };

  const isFullHeight = position === 'left' || position === 'right';

  return (
    <div 
      className={`fixed ${positionClasses[position]} bg-white border-2 border-green-500 rounded-lg shadow-2xl z-40 ${className}`}
      style={{ width: isFullHeight ? width : 'auto', maxWidth: isFullHeight ? width : '500px' }}
    >
      {children}
    </div>
  );
}
