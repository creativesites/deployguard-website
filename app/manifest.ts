import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DeployGuard OS',
    short_name: 'DeployGuard',
    description:
      'The intelligent workforce management platform for private security companies in Africa.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#1e3a5f',
    icons: [
      {
        src: '/deployguard.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/images/deployguard-small.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/deployguard-small.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['business', 'productivity', 'utilities'],
    lang: 'en',
    orientation: 'portrait-primary',
  }
}
