import fs from 'fs';
import path from 'path';
import { getLocale, getTranslations } from 'next-intl/server';
import AnimatedCounter from './AnimateCounter';

export default async function PageHeader() {
    const locale = await getLocale();
    const t = await getTranslations('HomePage');

    // Lógica para obtener stats reales
    const dataDirectory = path.join(process.cwd(), 'data');
    const filenames = fs.readdirSync(dataDirectory);

    const providersFiles = filenames.filter(f => f.endsWith('.json') && !f.includes('_summary_'));

    let totalPlans = 0;
    providersFiles.forEach(file => {
        const content = JSON.parse(fs.readFileSync(path.join(dataDirectory, file), 'utf8'));
        if (content.plans) totalPlans += content.plans.length;
    });

    const displayProviders = providersFiles.length > 15 ? '15+' : providersFiles.length;
    const displayPlans = totalPlans > 100 ? '100+' : totalPlans;

    return (
        <div className="relative bg-slate-950 pt-10 pb-10 overflow-hidden rounded-b-[0.5rem]">
            {/* Efecto de Luces de Fondo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan/10 via-transparent to-transparent blur-3xl"></div>

            <header className="relative max-w-7xl mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-[10px] font-bold uppercase tracking-widest mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
                    </span>
                    {t('live_updates', { date: new Date().toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) })}
                </div>

                <h1 className="text-5xl md:text-4xl font-extrabold mb-6 tracking-tighter text-white">
                    {t('title_start')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-blue-500">{t('title_accent')}</span>
                </h1>

                <p className="text-l text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    {t('description')}
                </p>

                {/* Buscador y CTAs */}
                <div className="flex flex-col md:flex-row justify-center gap-4 items-center max-w-4xl mx-auto">
                    <a
                        href={`/${locale}/calculator`}
                        className="w-full md:w-auto bg-cyan text-slate-950 px-10 py-4 rounded-2xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                        ⚡ {t('cta_calculator')}
                    </a>
                    <a
                        href={`/${locale}/compare`}
                        className="w-full md:w-auto bg-slate-900 text-white border border-slate-800 px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        📊 {t('cta_compare')}
                    </a>
                </div>

                {/* Stats Rápidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-5 border-t border-slate-900 pt-5">
                    {[
                        { label: t('stats.providers'), value: <AnimatedCounter value={displayProviders} /> },
                        { label: t('stats.plans'), value: <AnimatedCounter value={displayPlans} /> },
                        { label: t('stats.benchmarks'), value: t('stats.real_time') },
                        { label: t('stats.update_frequency'), value: t('stats.weekly') }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-l font-bold font-black text-cyan drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">{stat.value}</p>
                            <p className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </header>
        </div>
    );
}