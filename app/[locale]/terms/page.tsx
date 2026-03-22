import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Terms' });

    return {
        title: `${t('title')} | TechStackScale`,
        description: t('section2_text').substring(0, 150) + '...',
        alternates: {
            canonical: `https://techstackscale.com/${locale}/terms`,
            languages: {
                'es': 'https://techstackscale.com/es/terms',
                'en': 'https://techstackscale.com/en/terms',
                'fr': 'https://techstackscale.com/fr/terms',
                'x-default': 'https://techstackscale.com/es/terms',
            },
        },
    };
}

export default function TermsPage() {
    const t = useTranslations('Terms');

    return (
        <main className="min-h-screen bg-background text-white p-8 pt-32 pb-20">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">
                    {t('title')}<span className="text-cyan">.</span>
                </h1>
                <p className="text-slate-400 text-sm mb-10">{t('last_updated')}</p>

                <div className="space-y-8 leading-relaxed">
                    {[1, 2, 3, 4].map((num) => (
                        <section key={num}>
                            <h2 className="text-2xl font-semibold mb-6">
                                {/* @ts-ignore - Evitamos el warning de TypeScript por la key dinámica */}
                                {t(`section${num}_title`)}
                            </h2>
                            <p className="text-slate-300">
                                {/* @ts-ignore */}
                                {t(`section${num}_text`)}
                            </p>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}