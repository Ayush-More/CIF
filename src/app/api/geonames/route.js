import { NextResponse } from 'next/server';

const GEONAMES_USERNAME = 'aditydevx';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postalCode = searchParams.get('postalCode');
  const country = searchParams.get('country');

  if (!postalCode || !country) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `http://api.geonames.org/postalCodeSearchJSON?postalcode=${postalCode}&country=${country}&maxRows=1&username=${GEONAMES_USERNAME}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GeoNames API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 