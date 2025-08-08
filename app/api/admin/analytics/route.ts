import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsData } from '@/app/lib/google-analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '30daysAgo';
    const endDate = searchParams.get('endDate') || 'today';

    const analyticsData = await getAnalyticsData(startDate, endDate);

    if (!analyticsData) {
      return NextResponse.json(
        { error: 'No se pudieron obtener los datos de Analytics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: analyticsData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en API de Analytics:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
