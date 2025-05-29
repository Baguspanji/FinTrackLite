import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "FinTrack Lite",
        short_name: "FinTrack",
        description: "Pelacakan keuangan sederhana dengan wawasan AI.",
        start_url: '/',
        display: 'standalone',
        background_color: "#F9FAFB",
        theme_color: "#2A9DF4",
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}