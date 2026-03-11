import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string, provider: string }> }): Promise<Metadata> {
    const { locale, provider } = await params;
    const t = await getTranslations({ locale, namespace: 'ProviderMetadata' });
    const name = provider.charAt(0).toUpperCase() + provider.slice(1);

    return {
        title: t('title', { name }),
        description: t('description', { name }),
        alternates: {
            canonical: `https://techstackscale.vercel.app/${locale}/cloud/${provider}`,
            languages: {
                'es-ES': `https://techstackscale.vercel.app/es/cloud/${provider}`,
                'en-US': `https://techstackscale.vercel.app/en/cloud/${provider}`,
                'fr-FR': `https://techstackscale.vercel.app/fr/cloud/${provider}`,
            },
        },
    };
}

export default async function ProviderPage({ params }: { params: Promise<{ locale: string, provider: string }> }) {
    const { locale, provider } = await params;
    const t = await getTranslations({ locale, namespace: 'ProviderPage' });

    // 1. Intentar leer el archivo JSON del proveedor
    const filePath = path.join(process.cwd(), 'data', `${provider}.json`);

    if (!fs.existsSync(filePath)) {
        notFound(); // Si el archivo no existe, enviamos a 404
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <span className="mr-2">←</span> {t('back_to_comparison')}
                </Link>

                {/* Encabezado con Logo y Nombre */}
                <header className="mb-12 border-b border-slate-800 pb-8">
                    <h1 className="text-4xl font-bold mb-4">{data.name}</h1>
                    <p className="text-xl text-slate-400">{t('analysis_subtitle', { name: data.name })}</p>
                </header>

                {/* Sección del Veredicto (SEO GOLD) */}
                <section className="mb-12 bg-slate-900/50 p-6 rounded-xl border border-blue-500/30">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">{t('our_verdict')}</h2>
                    <p className="leading-relaxed text-lg italic">"{data.verdicts[locale]}"</p>
                </section>

                {/* Lista completa de Planes */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">{t('available_plans')}</h2>
                    <div className="flex flex-wrap gap-3 mt-3">
                        {data.plans.map((plan: any, index: number) => (
                            <div key={index} className="bg-slate-900 w-full p-6 rounded-lg flex justify-between items-center border border-slate-800 hover:border-blue-500/50 transition-all group">
                                <div>
                                    <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">{plan.name}</h3>
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {plan.features
                                            .filter((feature: any) => feature.enabled)
                                            .map((feature: any, fIndex: number) => {
                                                return (
                                                    <span
                                                        key={fIndex}
                                                        className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50"
                                                    >
                                                        {t(`features.${feature.key}`, { value: feature.value })}
                                                    </span>
                                                );
                                            })}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-mono font-bold text-green-400">{plan.price}</span>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">{t('per_month')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}