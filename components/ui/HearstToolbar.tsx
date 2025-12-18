import React from 'react';

export interface HearstToolbarProps {
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function HearstToolbar({ title, children, actions }: HearstToolbarProps) {
  return (
    <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b-4 border-green-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Titre */}
          {title && (
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">{title}</h1>
            </div>
          )}
          
          {/* Actions personnalisées */}
          {children && (
            <div className="flex items-center gap-3">
              {children}
            </div>
          )}
          
          {/* Actions supplémentaires */}
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
