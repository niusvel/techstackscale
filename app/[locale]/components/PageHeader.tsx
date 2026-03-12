import { getLocale, getTranslations } from 'next-intl/server';

export default async function PageHeader() {
    const locale = await getLocale();
    const t = await getTranslations('HomePage');

    return (
        <div className="bg-background rounded-b-[0.5rem] mb-10 shadow-2xl">
            <header className="max-w-7xl mx-auto px-4 pt-10 pb-10 text-center">
                <h1 className="text-4xl font-extrabold mb-6 tracking-tight text-white">
                    {t('title')}
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
                    {t('description')}
                </p>
                <div className="flex justify-center gap-4">
                    <a
                        href={`/${locale}/calculator`}
                        target="_self"
                        className="bg-purple text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple/20 hover:bg-purple/90 transition-all"
                    >
                        {t('cta_calculator')}
                    </a>
                    <a
                        href={`/${locale}/compare`}
                        target="_self"
                        className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
                    >
                        {t('cta_compare')}
                    </a>
                </div>
            </header>
        </div>
    );
}
