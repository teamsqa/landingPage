import { NextResponse } from 'next/server';

// Root API route handler
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'TeamsQA API',
    version: '1.0.0'
  });
}