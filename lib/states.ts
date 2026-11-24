export interface StateTile {
  code: string;
  name: string;
  /** 1-based column and row in the 11-column tile map */
  col: number;
  row: number;
}

// Every state gets an equal-size tile, placed roughly where it sits on a map.
export const STATES: StateTile[] = [
  { code: 'AK', name: 'Alaska', col: 1, row: 1 },
  { code: 'ME', name: 'Maine', col: 11, row: 1 },
  { code: 'WI', name: 'Wisconsin', col: 7, row: 2 },
  { code: 'VT', name: 'Vermont', col: 10, row: 2 },
  { code: 'NH', name: 'New Hampshire', col: 11, row: 2 },
  { code: 'WA', name: 'Washington', col: 1, row: 3 },
  { code: 'ID', name: 'Idaho', col: 2, row: 3 },
  { code: 'MT', name: 'Montana', col: 3, row: 3 },
  { code: 'ND', name: 'North Dakota', col: 4, row: 3 },
  { code: 'MN', name: 'Minnesota', col: 5, row: 3 },
  { code: 'IL', name: 'Illinois', col: 6, row: 3 },
  { code: 'MI', name: 'Michigan', col: 7, row: 3 },
  { code: 'NY', name: 'New York', col: 9, row: 3 },
  { code: 'MA', name: 'Massachusetts', col: 10, row: 3 },
  { code: 'RI', name: 'Rhode Island', col: 11, row: 3 },
  { code: 'OR', name: 'Oregon', col: 1, row: 4 },
  { code: 'NV', name: 'Nevada', col: 2, row: 4 },
  { code: 'WY', name: 'Wyoming', col: 3, row: 4 },
  { code: 'SD', name: 'South Dakota', col: 4, row: 4 },
  { code: 'IA', name: 'Iowa', col: 5, row: 4 },
  { code: 'IN', name: 'Indiana', col: 6, row: 4 },
  { code: 'OH', name: 'Ohio', col: 7, row: 4 },
  { code: 'PA', name: 'Pennsylvania', col: 8, row: 4 },
  { code: 'NJ', name: 'New Jersey', col: 9, row: 4 },
  { code: 'CT', name: 'Connecticut', col: 10, row: 4 },
  { code: 'CA', name: 'California', col: 1, row: 5 },
  { code: 'UT', name: 'Utah', col: 2, row: 5 },
  { code: 'CO', name: 'Colorado', col: 3, row: 5 },
  { code: 'NE', name: 'Nebraska', col: 4, row: 5 },
  { code: 'MO', name: 'Missouri', col: 5, row: 5 },
  { code: 'KY', name: 'Kentucky', col: 6, row: 5 },
  { code: 'WV', name: 'West Virginia', col: 7, row: 5 },
  { code: 'VA', name: 'Virginia', col: 8, row: 5 },
  { code: 'MD', name: 'Maryland', col: 9, row: 5 },
  { code: 'DE', name: 'Delaware', col: 10, row: 5 },
  { code: 'AZ', name: 'Arizona', col: 2, row: 6 },
  { code: 'NM', name: 'New Mexico', col: 3, row: 6 },
  { code: 'KS', name: 'Kansas', col: 4, row: 6 },
  { code: 'AR', name: 'Arkansas', col: 5, row: 6 },
  { code: 'TN', name: 'Tennessee', col: 6, row: 6 },
  { code: 'NC', name: 'North Carolina', col: 7, row: 6 },
  { code: 'SC', name: 'South Carolina', col: 8, row: 6 },
  { code: 'OK', name: 'Oklahoma', col: 4, row: 7 },
  { code: 'LA', name: 'Louisiana', col: 5, row: 7 },
  { code: 'MS', name: 'Mississippi', col: 6, row: 7 },
  { code: 'AL', name: 'Alabama', col: 7, row: 7 },
  { code: 'GA', name: 'Georgia', col: 8, row: 7 },
  { code: 'HI', name: 'Hawaii', col: 1, row: 8 },
  { code: 'TX', name: 'Texas', col: 4, row: 8 },
  { code: 'FL', name: 'Florida', col: 9, row: 8 },
];

export const STATES_BY_NAME = [...STATES].sort((a, b) =>
  a.name.localeCompare(b.name)
);

export function stateName(code: string): string {
  return STATES.find((s) => s.code === code)?.name ?? 'United States';
}
