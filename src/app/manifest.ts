import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
    const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
    const basePath = isGitHubPages ? '/FinTrackLite' : '';
    
    return {
        name: "FinTrack Lite",
        short_name: "FinTrack",
        description: "Pelacakan keuangan sederhana dengan wawasan AI.",
        start_url: basePath + '/',
        display: 'standalone',
        background_color: "#F9FAFB",
        theme_color: "#2A9DF4",
        scope: basePath + "/",
        categories: ["finance", "productivity"],
        lang: "id",
        dir: "ltr",
        orientation: "portrait-primary",
        icons: [
            {
                src: basePath + '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: basePath + '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        shortcuts: [
            {
                name: "Tambah Transaksi",
                short_name: "Tambah",
                description: "Tambah transaksi baru",
                url: basePath + "/?action=add",
                icons: [
                    {
                        src: basePath + "/icon-192x192.png",
                        sizes: "192x192"
                    }
                ]
            }
        ]
    }
}