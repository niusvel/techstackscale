import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Cookies' });
    return {
        title: `${t('title')} | TechStackScale`,
        description: t('intro'),
        alternates: {
            canonical: `https://techstackscale.com/${locale}/cookies`,
            languages: {
                'es': 'https://techstackscale.com/es/cookies',
                'en': 'https://techstackscale.com/en/cookies',
                'fr': 'https://techstackscale.com/fr/cookies',
                'x-default': 'https://techstackscale.com/es/cookies',
            },
        },
    };
}

export default function CookiesPage() {
    const t = useTranslations('Cookies');

    return (
        <main className="min-h-screen bg-background text-white p-8 pt-32 pb-20">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">
                    {t('title')}<span className="text-cyan">.</span>
                </h1>
                <p className="text-slate-400 text-sm mb-10">{t('last_updated')}</p>

                <div className="space-y-8 leading-relaxed">
                    <p>{t('intro')}</p>

                    <section>
                        <h2 className="text-2xl font-semibold mb-6">{t('what_are_title')}</h2>
                        <p className="text-slate-300">{t('what_are_text')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-6">{t('types_title')}</h2>
                        {/* 2. MEJORAMOS LA VISUALIZACIÓN DE LA LISTA */}
                        <ul className="list-disc pl-5 space-y-3 text-slate-300">
                            <li><strong className="text-white">Cookies Técnicas:</strong> Necesarias para el funcionamiento del sitio y la selección de idioma.</li>
                            <li><strong className="text-white">Cookies de Afiliación:</strong> Cookies de terceros que identifican que procedes de nuestra web para procesar posibles comisiones.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-6">{t('control_title')}</h2>
                        <p className="text-slate-300">{t('control_text')}</p>
                    </section>
                </div>
            </div>
        </main>
    );
}