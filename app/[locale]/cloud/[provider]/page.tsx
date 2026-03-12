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

import ProviderSummary from '../../components/ProviderSummary';

export default async function ProviderPage({ params }: { params: Promise<{ locale: string, provider: string }> }) {
    const { locale, provider } = await params;
    const t = await getTranslations({ locale, namespace: 'ProviderPage' });
    const tpc = await getTranslations({ locale, namespace: 'PriceCard' });

    const filePath = path.join(process.cwd(), 'data', `${provider}.json`);

    if (!fs.existsSync(filePath)) {
        notFound();
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    return (
        <main className="min-h-screen bg-background text-white p-8">
            <div className="max-w-4xl mx-auto">

                <header className="mb-8 flex justify-between sticky top-16 pt-6 -mt-6 z-10 bg-background/95 backdrop-blur-sm shadow-[0_10px_20px_-10px_rgba(0,43,54,1)] pb-4">
                    <Link
                        href="/"
                        className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                    >
                        <span className="mr-2">←</span> {t('back_to_comparison')}
                    </Link>
                    <h1 className="text-4xl font-bold mb-4">{provider.toUpperCase()}</h1>
                </header>

                <ProviderSummary provider={provider} locale={locale} />

                <section>
                    <h2 className="text-2xl font-semibold mb-6">{t('available_plans')}</h2>
                    <div className="flex flex-wrap gap-3 mt-3">
                        {data.plans.map((plan: any, index: number) => (
                            <a
                                key={index}
                                href={data.affiliate_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`bg-white/5 w-full p-6 rounded-lg flex justify-between items-center border hover:border-cyan/50 transition-all group cursor-pointer ${plan.is_best_seller ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/10'}`}
                            >
                                <div>
                                    <div className="flex items-center gap-2 justify-between align-center">
                                        <h3 className="font-bold text-xl text-white group-hover:text-cyan transition-colors">
                                            {plan.name}
                                        </h3>
                                        {plan.is_best_seller && <span className="ml-3 text-[10px] font-black tracking-widest uppercase bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">{tpc('best_value')}</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {plan.features
                                            .filter((feature: any) => feature.enabled)
                                            .map((feature: any, fIndex: number) => {
                                                return (
                                                    <span
                                                        key={fIndex}
                                                        className="text-sm text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10"
                                                    >
                                                        {t(`features.${feature.key}`, { value: feature.value })}
                                                    </span>
                                                );
                                            })}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-mono font-bold text-cyan drop-shadow-[0_0_8px_rgba(42,161,152,0.3)]">
                                        {plan.currency === 'USD' ? '$' : ''}{Number(plan.price).toFixed(2)}{plan.currency !== 'USD' ? '€' : ''}
                                    </span>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">{t('per_month')}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}