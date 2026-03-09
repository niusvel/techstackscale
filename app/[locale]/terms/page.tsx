import { useTranslations } from 'next-intl';

export default function TermsPage() {
    const t = useTranslations('Terms');

    return (
        <main className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto glass p-8 md:p-12 rounded-3xl border border-white/10">
                <h1 className="text-4xl font-black text-white mb-2 italic">
                    {t('title')}<span className="text-cyan">.</span>
                </h1>
                <p className="text-slate-500 text-sm mb-10">{t('last_updated')}</p>

                <div className="space-y-8 text-slate-300 leading-relaxed">
                    {[1, 2, 3, 4].map((num) => (
                        <section key={num}>
                            <h2 className="text-xl font-bold text-white mb-4">
                                {t(`section${num}_title`)}
                            </h2>
                            <p>{t(`section${num}_text`)}</p>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}