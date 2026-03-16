import { getTranslations } from 'next-intl/server';
import fs from 'fs';
import path from 'path';
import CalculatorClient from './CalculatorClient';
import { Link } from '@/i18n/routing';

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Calculator' });

    // 1. Cargamos todos los proveedores de la carpeta /data
    const dataDirectory = path.join(process.cwd(), 'data');
    const filenames = fs.readdirSync(dataDirectory);

    const allProviders = filenames
        .filter((file) => file.endsWith('.json') && !file.includes('_summary_'))
        .map((file) => {
            const filePath = path.join(dataDirectory, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            return {
                id: file.replace('.json', ''),
                ...data
            };
        });

    return (
        <div className="min-h-screen">
            <div className="bg-background rounded-b-[0.5rem] mb-10 shadow-2xl">
                <header className="max-w-7xl mx-auto px-4 pt-10 pb-10 flex">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                        >
                            <span className="mr-2">←</span> {t('back_to_comparison')}
                        </Link>
                    </div>
                    <div className="text-center w-full">
                        <h1 className="text-2xl font-extrabold mb-6 tracking-tight text-white">
                            {t('title')}
                        </h1>
                        <p className="text-l text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
                            {t('subtitle')}
                        </p>
                    </div>
                </header>
            </div>

            <main className="bg-metallic min-h-screen bg-slate-950 text-white p-6 md:p-12">
                <div className="max-w-5xl mx-auto">

                    {/* Pasamos los datos al componente de cliente para la interactividad */}
                    <CalculatorClient
                        providers={allProviders}
                        locale={locale}
                    />
                </div>
            </main>
        </div>
    );
}