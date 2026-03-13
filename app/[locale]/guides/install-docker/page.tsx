import { getTranslations } from 'next-intl/server';
import CopyButton from '@/app/[locale]/components/CopyButton';

export default async function InstallDockerGuide({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'InstallDockerGuide' });

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 lg:p-24">
            <div className="max-w-3xl mx-auto">
                {/* Encabezado */}
                <header className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-cyan/20 text-cyan px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-cyan/30">
                            {t('category_devops')}
                        </span>
                        <span className="text-slate-500 text-xs italic">{t('read_time')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                        {t('install_docker_title')}
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed">
                        {t('install_docker_subtitle')}
                    </p>
                </header>

                {/* Pasos de la guía */}
                <div className="space-y-12 relative border-l border-slate-800 ml-4 pl-8">

                    {/* Paso 1 */}
                    <section className="relative">
                        <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                        <h2 className="text-2xl font-bold mb-4">{t('step_1_title')}</h2>
                        <p className="text-slate-400 mb-4">{t('step_1_desc')}</p>
                        <div className="relative group">
                            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-sm text-cyan overflow-x-auto">
                                <code>ssh root@your_server_ip</code>
                            </div>
                            <CopyButton text="ssh root@your_server_ip" />
                        </div>
                    </section>

                    {/* Paso 2 */}
                    <section className="relative">
                        <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-cyan"></div>
                        <h2 className="text-2xl font-bold mb-4">{t('step_2_title')}</h2>
                        <p className="text-slate-400 mb-4">{t('step_2_desc')}</p>
                        <div className="relative group">
                            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-sm text-cyan space-y-2 overflow-x-auto">
                                <code>curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh</code>
                            </div>
                            <CopyButton text="curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh" />
                        </div>
                    </section>

                    {/* Paso 3 */}
                    <section className="relative">
                        <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-cyan"></div>
                        <h2 className="text-2xl font-bold mb-4">{t('step_3_title')}</h2>
                        <p className="text-slate-400 mb-4">{t('step_3_desc')}</p>
                        <div className="relative group">
                            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-sm text-green-400 overflow-x-auto">
                                <code>docker --version && docker compose version</code>
                            </div>
                            <CopyButton text="docker --version && docker compose version" />
                        </div>
                    </section>
                </div>

                <footer className="mt-20 p-8 bg-cyan/5 border border-cyan/20 rounded-2xl text-center">
                    <h3 className="text-xl font-bold mb-2 text-cyan">🚀 {t('guide_ready_title')}</h3>
                    <p className="text-slate-400">
                        {t('guide_ready_desc')}
                    </p>
                </footer>
            </div>
        </main>
    );
}