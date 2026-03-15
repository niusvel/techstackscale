import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://techstackscale.com';
    const dataDirectory = path.join(process.cwd(), 'data');

    // Obtenemos los nombres de los archivos de proveedores
    const filenames = fs.readdirSync(dataDirectory);
    const providerFiles = filenames.filter(f => f.endsWith('.json') && !f.includes('_summary'));

    // Generamos las URLs para cada proveedor
    const providerEntries = providerFiles.map((file) => ({
        url: `${baseUrl}/compare/${file.replace('.json', '')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Rutas estáticas principales
    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/compare`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...providerEntries,
    ];
}