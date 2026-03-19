import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://techstackscale.com';
    const locales = ['es', 'en', 'fr'];
    const dataDirectory = path.join(process.cwd(), 'data');

    const filenames = fs.readdirSync(dataDirectory);
    const providerFiles = filenames.filter(f => f.endsWith('.json') && !f.includes('_summary'));

    const providerEntries = locales.flatMap((locale) =>
        providerFiles.map((file) => ({
            url: `${baseUrl}/${locale}/cloud/${file.replace('.json', '')}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    );

    const calculatorEntries = locales.flatMap((locale) => ({
        url: `${baseUrl}/${locale}/calculator`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    const compareEntries = locales.flatMap((locale) => ({
        url: `${baseUrl}/${locale}/compare`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    const homeEntries = locales.flatMap((locale) => ({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
    }));

    const dockerGuideEntries = locales.flatMap((locale) => ({
        url: `${baseUrl}/${locale}/guides/install-docker`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.5,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1.0,
        },
        ...homeEntries,
        ...calculatorEntries,
        ...compareEntries,
        ...providerEntries,
        ...dockerGuideEntries,
    ];
}