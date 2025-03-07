import { NextResponse } from 'next/server';

// Admin API route handler
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'TeamsQA Admin API',
    version: '1.0.0'
  });
}