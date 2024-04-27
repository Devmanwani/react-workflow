// pages/api/logData.js


import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    // Type-safe access to request body
    try {
      const dataArray = await req.json();

      // Log the data
      console.log('Received data:', dataArray);

      // Respond with a success message
      return NextResponse.json({ message: 'Data received successfully' })
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json({ message: 'Invalid request body' });
    }
  } 
}
