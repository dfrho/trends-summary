'use client';

import React from 'react';
import { stateCodes } from '@/lib/locationCodes';

interface USStateMapProps {
  onStateSelect: (stateCode: string, stateName: string) => void;
}

export function USStateMap({ onStateSelect }: USStateMapProps) {
  const handleStateClick = (stateCode: string, stateName: string) => {
    onStateSelect(stateCode, stateName);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Select a State</h2>
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-auto border border-gray-300"
      >
        {Object.entries(stateCodes).map(([stateCode, fullCode]) => (
          <path
            key={stateCode}
            d={`M ${Math.random() * 800} ${Math.random() * 400} L ${
              Math.random() * 800
            } ${Math.random() * 400} L ${Math.random() * 800} ${
              Math.random() * 400
            } Z`}
            fill="white"
            stroke="black"
            onClick={() => handleStateClick(fullCode, stateCode)}
            className="cursor-pointer hover:fill-gray-200"
          />
        ))}
      </svg>
    </div>
  );
}
