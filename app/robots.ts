import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://techstackscale.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api'], // Protegemos tu panel Data Forger y rutas internas
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}