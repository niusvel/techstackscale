import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://techstackscale.vercel.app';
    const locales = ['es', 'en', 'fr'];

    const routes = locales.flatMap((locale) => [
        {
            url: `${baseUrl}/${locale}`,
            lastModified: new Date(),
            priority: 1,
        },
    ]);

    return routes;
}