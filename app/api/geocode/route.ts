import { NextResponse } from 'next/server'
import { stateCodes } from '@/lib/locationCodes'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    const data = await response.json()

    let location = 'US' // Default to US

    if (data.address && data.address.country === 'United States') {
      if (data.address.state) {
        const stateCode = Object.keys(stateCodes).find(key => stateCodes[key].toLowerCase() === data.address.state.toLowerCase())
        location = stateCode ? `US-${stateCode}` : 'US'
      }
    }

    return NextResponse.json({ location })
  } catch (error) {
    console.error('Error geocoding:', error)
    return NextResponse.json({ error: 'Failed to geocode location' }, { status: 500 })
  }
}