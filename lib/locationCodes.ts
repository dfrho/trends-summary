export const stateCodes: { [key: string]: string } = {
  'AL': 'US-AL', 'AK': 'US-AK', 'AZ': 'US-AZ', 'AR': 'US-AR', 'CA': 'US-CA',
  'CO': 'US-CO', 'CT': 'US-CT', 'DE': 'US-DE', 'FL': 'US-FL', 'GA': 'US-GA',
  'HI': 'US-HI', 'ID': 'US-ID', 'IL': 'US-IL', 'IN': 'US-IN', 'IA': 'US-IA',
  'KS': 'US-KS', 'KY': 'US-KY', 'LA': 'US-LA', 'ME': 'US-ME', 'MD': 'US-MD',
  'MA': 'US-MA', 'MI': 'US-MI', 'MN': 'US-MN', 'MS': 'US-MS', 'MO': 'US-MO',
  'MT': 'US-MT', 'NE': 'US-NE', 'NV': 'US-NV', 'NH': 'US-NH', 'NJ': 'US-NJ',
  'NM': 'US-NM', 'NY': 'US-NY', 'NC': 'US-NC', 'ND': 'US-ND', 'OH': 'US-OH',
  'OK': 'US-OK', 'OR': 'US-OR', 'PA': 'US-PA', 'RI': 'US-RI', 'SC': 'US-SC',
  'SD': 'US-SD', 'TN': 'US-TN', 'TX': 'US-TX', 'UT': 'US-UT', 'VT': 'US-VT',
  'VA': 'US-VA', 'WA': 'US-WA', 'WV': 'US-WV', 'WI': 'US-WI', 'WY': 'US-WY'
}

export const reverseStateCodes: { [key: string]: string } = Object.fromEntries(
  Object.entries(stateCodes).map(([key, value]) => [value, key])
)