import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://techstackscale.vercel.app';
    const locales = ['es', 'en', 'fr'];
    const dataDirectory = path.join(process.cwd(), 'data');
    const filenames = fs.readdirSync(dataDirectory);
    const providers = filenames
        .filter((file) => file.endsWith('.json'))
        .map((file) => file.replace('.json', ''));

    const staticRoutes = locales.flatMap((locale) => [
        {
            url: `${baseUrl}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
    ]);

    const providerRoutes = locales.flatMap((locale) =>
        providers.map((provider) => ({
            url: `${baseUrl}/${locale}/cloud/${provider}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    );

    return [...staticRoutes, ...providerRoutes];
}