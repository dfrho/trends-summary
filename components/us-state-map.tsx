'use client';

import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

interface USStateMapProps {
  onStateSelect: (stateCode: string, stateName: string) => void;
}

export function USStateMap({ onStateSelect }: USStateMapProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateCode = geo.properties.iso_3166_2 || '';
              const stateName = geo.properties.name || '';
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    console.log(`Clicked state: ${stateCode} - ${stateName}`);
                    onStateSelect(stateCode, stateName);
                  }}
                  style={{
                    default: { fill: '#D6D6DA', outline: 'none' },
                    hover: { fill: '#F53', outline: 'none' },
                    pressed: { fill: '#E42', outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
