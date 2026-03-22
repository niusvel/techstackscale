import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Privacy' });

    return {
        title: `${t('title')} | TechStackScale`,
        description: t('intro'),
        alternates: {
            canonical: `https://techstackscale.com/${locale}/privacy`,
            languages: {
                'es': 'https://techstackscale.com/es/privacy',
                'en': 'https://techstackscale.com/en/privacy',
                'fr': 'https://techstackscale.com/fr/privacy',
                'x-default': 'https://techstackscale.com/es/privacy',
            },
        },
    };
}

export default function PrivacyPage() {
    const t = useTranslations('Privacy');

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
                        <h2 className="text-2xl font-semibold mb-6">{t('cookies_title')}</h2>
                        <p className="text-slate-300">{t('cookies_text')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-6">{t('data_title')}</h2>
                        <p className="text-slate-300">{t('data_text')}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-6">{t('third_party_title')}</h2>
                        <p className="text-slate-300">{t('third_party_text')}</p>
                    </section>
                </div>
            </div>
        </main>
    );
}