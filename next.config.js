/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600, // 1 hora
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Optimizaciones de rendimiento mejoradas
  experimental: {
    optimizePackageImports: [
      '@google-analytics/data',
      'firebase/auth',
      'firebase/firestore',
      'react-hot-toast'
    ],
    // Usar Turbopack en desarrollo para builds más rápidos
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Headers para mejor caching y seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Configuración de build optimizada
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Configuración para evitar problemas de permisos en desarrollo
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Configuración optimizada para mejor rendimiento  
  poweredByHeader: false,
  webpack: (config, { isServer, dev, webpack }) => {
    // Configurar polyfills para el navegador
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert/'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        'process/browser': require.resolve('process/browser'),
      };
      
      // Definir variables globales para el navegador
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(process.env),
          global: 'globalThis',
          self: 'globalThis'
        })
      );
    }

    // Optimizaciones de producción mejoradas
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            firebase: {
              test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
              name: 'firebase',
              chunks: 'all',
              enforce: true,
              priority: 30,
            },
            analytics: {
              test: /[\\/]node_modules[\\/]@google-analytics[\\/]/,
              name: 'analytics',
              chunks: 'all',
              enforce: true,
              priority: 25,
            },
            ui: {
              test: /[\\/]app[\\/](ui|components)[\\/]/,
              name: 'ui-components',
              chunks: 'all',
              priority: 20,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react-vendor',
              chunks: 'all',
              priority: 15,
            },
          },
        },
      };
    }

    return config;
  }
};

module.exports = nextConfig;