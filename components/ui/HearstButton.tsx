import React from 'react';
import { HEARST_COLORS } from '../../config/colors.config';

export interface HearstButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function HearstButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: HearstButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: `bg-black text-white hover:bg-green-500 focus:ring-green-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    outline: `border-2 border-black text-black hover:bg-black hover:text-white focus:ring-black ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
