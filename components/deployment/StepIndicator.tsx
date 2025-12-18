import React from 'react';

export interface StepIndicatorProps {
  number: number;
  title: string;
  active: boolean;
  completed: boolean;
}

export default function StepIndicator({ number, title, active, completed }: StepIndicatorProps) {
  return (
    <div className="flex items-center">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
        completed ? 'bg-green-500 text-white' :
        active ? 'bg-black text-white ring-4 ring-green-500/30' :
        'bg-gray-200 text-gray-500'
      }`}>
        {completed ? '✓' : number}
      </div>
      <div className="ml-3">
        <div className={`text-sm font-medium ${
          active ? 'text-black' : completed ? 'text-green-600' : 'text-gray-500'
        }`}>
          {title}
        </div>
      </div>
    </div>
  );
}
