import { useTranslations } from 'next-intl';

export default function ValueProposition() {
    const t = useTranslations('HomePage');

    const features = [
        {
            key: 'money',
            icon: (
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            key: 'data',
            icon: (
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            key: 'algorithm',
            icon: (
                <svg className="w-8 h-8 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        }
    ];

    return (
        <section className="bg-slate-900 border border-white/10 rounded-3xl max-w-7xl mx-auto shadow-2xl py-12 px-6 mt-16 mb-0">
            <div className="relative z-10 w-full">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        {t('why_us_title')}
                    </h2>
                    <p className="text-xl text-slate-400 font-medium">
                        {t('why_us_subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.key} className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 hover:border-cyan/50 transition-all">
                            <div className="bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan transition-colors">
                                {t(`features.${feature.key}.title`)}
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                {t(`features.${feature.key}.desc`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
