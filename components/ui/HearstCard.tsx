import React from 'react';

export interface HearstCardProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export default function HearstCard({
  children,
  isSelected = false,
  onClick,
  className = '',
  hoverable = true
}: HearstCardProps) {
  const baseClasses = 'bg-white rounded-lg shadow-md transition-all duration-300';
  const hoverClasses = hoverable ? 'hover:shadow-xl hover:border-green-500' : '';
  const selectedClasses = isSelected ? 'border-4 border-green-500 shadow-xl' : 'border border-gray-200';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${selectedClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
