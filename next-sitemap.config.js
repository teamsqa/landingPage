module.exports = {
    siteUrl: 'https://teamsqa.com',
    generateRobotsTxt: true,
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
        },
        {
          userAgent: '*',
          allow: '/playground',
        },
      ],
      additionalSitemaps: [
        'https://teamsqa.com/sitemap.xml',
      ],
    },
    additionalPaths: async (config) => [
      await config.transform(config, '/playground'),
    ],
    changefreq: 'weekly',
    priority: {
      '/playground': 0.9,
      '/': 1.0,
      '/blog': 0.8,
      '/cursos': 0.9,
    },
    exclude: [
      '/admin',
      '/admin/*',
      '/api/*',
      '/404',
    ],
  };