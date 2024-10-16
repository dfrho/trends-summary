'use client';

import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

interface USStateMapProps {
  onStateSelect: (stateCode: string, stateName: string) => void;
  selectedState: string | null;
  isLocked: boolean;
}

const stateNameToCode: { [key: string]: string } = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

export function USStateMap({
  onStateSelect,
  selectedState,
  isLocked,
}: USStateMapProps) {
  const handleStateClick = (geo: any) => {
    if (isLocked) return;

    const stateName = geo.properties?.name || '';
    const stateCode = stateNameToCode[stateName] || '';

    console.log(`Clicked state: ${stateCode} - ${stateName}`);

    if (stateCode && stateName) {
      onStateSelect(`US-${stateCode}`, stateName);
    } else {
      console.error('State code or name is undefined', geo.properties);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ComposableMap projection="geoAlbersUsa" className="w-full h-auto">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              const stateCode = stateNameToCode[stateName];
              const isSelected = `US-${stateCode}` === selectedState;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleStateClick(geo)}
                  style={{
                    default: {
                      fill: isSelected
                        ? 'hsl(var(--color-map-selected))'
                        : 'hsl(var(--color-map-fill))',
                      stroke: 'hsl(var(--color-map-stroke))',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    hover: {
                      fill: isLocked
                        ? isSelected
                          ? 'hsl(var(--color-map-selected))'
                          : 'hsl(var(--color-map-fill))'
                        : 'hsl(var(--color-map-hover))',
                      stroke: 'hsl(var(--color-map-stroke))',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                    },
                    pressed: {
                      fill: 'hsl(var(--color-map-pressed))',
                      stroke: 'hsl(var(--color-map-stroke))',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
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
