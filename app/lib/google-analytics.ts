import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Tipos para los datos de Analytics
export interface AnalyticsData {
  totalUsers: number;
  totalSessions: number;
  totalPageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  usersByCountry: Array<{
    country: string;
    users: number;
  }>;
  dailyUsers: Array<{
    date: string;
    users: number;
  }>;
}

// Configuración de Google Analytics
const GOOGLE_ANALYTICS_PROPERTY_ID = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

let analyticsDataClient: BetaAnalyticsDataClient | null = null;

// Inicializar cliente de Google Analytics
function initializeAnalyticsClient() {
  if (!analyticsDataClient && GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY) {
    try {
      analyticsDataClient = new BetaAnalyticsDataClient({
        credentials: {
          client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: GOOGLE_PRIVATE_KEY,
        },
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'default-project',
      });
    } catch (error) {
      console.error('Error inicializando Google Analytics client:', error);
    }
  }
  return analyticsDataClient;
}

// Función para obtener datos básicos de Analytics
export async function getAnalyticsData(
  startDate: string = '30daysAgo',
  endDate: string = 'today'
): Promise<AnalyticsData | null> {
  try {
    const client = initializeAnalyticsClient();
    
    if (!client || !GOOGLE_ANALYTICS_PROPERTY_ID) {
      console.warn('Google Analytics no configurado correctamente');
      return getMockAnalyticsData();
    }

    // Obtener métricas básicas
    const [basicMetrics] = await client.runReport({
      property: `properties/${GOOGLE_ANALYTICS_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' }
      ],
    });

    // Obtener páginas más visitadas
    const [topPages] = await client.runReport({
      property: `properties/${GOOGLE_ANALYTICS_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    });

    // Obtener usuarios por país
    const [usersByCountry] = await client.runReport({
      property: `properties/${GOOGLE_ANALYTICS_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 10,
    });

    // Obtener usuarios diarios (últimos 7 días)
    const [dailyUsers] = await client.runReport({
      property: `properties/${GOOGLE_ANALYTICS_PROPERTY_ID}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    // Procesar los datos
    const basicRow = basicMetrics.rows?.[0];
    const totalUsers = parseInt(basicRow?.metricValues?.[0]?.value || '0');
    const totalSessions = parseInt(basicRow?.metricValues?.[1]?.value || '0');
    const totalPageviews = parseInt(basicRow?.metricValues?.[2]?.value || '0');
    const bounceRate = parseFloat(basicRow?.metricValues?.[3]?.value || '0');
    const avgSessionDuration = parseFloat(basicRow?.metricValues?.[4]?.value || '0');

    const topPagesData = topPages.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0')
    })) || [];

    const usersByCountryData = usersByCountry.rows?.map(row => ({
      country: row.dimensionValues?.[0]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0')
    })) || [];

    const dailyUsersData = dailyUsers.rows?.map(row => ({
      date: row.dimensionValues?.[0]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0')
    })) || [];

    return {
      totalUsers,
      totalSessions,
      totalPageviews,
      bounceRate,
      avgSessionDuration,
      topPages: topPagesData,
      usersByCountry: usersByCountryData,
      dailyUsers: dailyUsersData,
    };

  } catch (error) {
    console.error('Error obteniendo datos de Google Analytics:', error);
    return getMockAnalyticsData();
  }
}

// Datos mock para cuando Google Analytics no está configurado
function getMockAnalyticsData(): AnalyticsData {
  return {
    totalUsers: 1234,
    totalSessions: 1567,
    totalPageviews: 2890,
    bounceRate: 45.6,
    avgSessionDuration: 125.4,
    topPages: [
      { path: '/', views: 456 },
      { path: '/cursos', views: 234 },
      { path: '/admin', views: 123 },
      { path: '/inscripcion', views: 89 },
      { path: '/blog', views: 67 }
    ],
    usersByCountry: [
      { country: 'Colombia', users: 567 },
      { country: 'México', users: 234 },
      { country: 'Argentina', users: 123 },
      { country: 'España', users: 89 },
      { country: 'Chile', users: 67 }
    ],
    dailyUsers: [
      { date: '20250128', users: 45 },
      { date: '20250129', users: 52 },
      { date: '20250130', users: 38 },
      { date: '20250131', users: 67 },
      { date: '20250201', users: 78 },
      { date: '20250202', users: 61 },
      { date: '20250203', users: 84 }
    ]
  };
}

// Hook para usar en componentes React
export function useAnalyticsData() {
  return {
    getAnalyticsData,
    getMockAnalyticsData
  };
}
