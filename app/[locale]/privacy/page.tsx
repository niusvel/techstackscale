import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
    const t = useTranslations('Privacy');

    return (
        <main className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto glass p-8 md:p-12 rounded-3xl border border-white/10">
                <h1 className="text-4xl font-black text-white mb-2 italic">
                    {t('title')}<span className="text-cyan">.</span>
                </h1>
                <p className="text-slate-500 text-sm mb-10">{t('last_updated')}</p>

                <div className="space-y-8 text-slate-300 leading-relaxed">
                    <p>{t('intro')}</p>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">{t('cookies_title')}</h2>
                        <p>{t('cookies_text')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">{t('data_title')}</h2>
                        <p>{t('data_text')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">{t('third_party_title')}</h2>
                        <p>{t('third_party_text')}</p>
                    </section>
                </div>
            </div>
        </main>
    );
}