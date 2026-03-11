import fs from 'fs';
import path from 'path';

interface ProviderSummaryProps {
    provider: string;
    locale: string;
}

export default function ProviderSummary({ provider, locale }: ProviderSummaryProps) {
    // Intentar leer el archivo JSON de resumen del proveedor según el idioma
    const filePath = path.join(process.cwd(), 'data', `${provider}_summary_${locale}.json`);

    let summaryData = null;

    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            summaryData = JSON.parse(fileContent);
        }
    } catch (error) {
        console.error(`Error reading summary json file for provider ${provider}:`, error);
        return null;
    }

    if (!summaryData) {
        return null;
    }

    // Usando CSS de Tailwind y la paleta Solarized Dark
    return (
        <section className="mb-14">
            {/* Descripción General */}
            <div className="mb-10 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl">
                <h2 className="text-3xl font-bold mb-4 text-white">General Overview</h2>
                <p className="leading-relaxed text-slate-300 text-lg">
                    {summaryData.description}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Servicios Principales */}
                {summaryData.services && summaryData.services.length > 0 && (
                    <div className="bg-white/5 p-8 rounded-2xl border border-cyan/20 shadow-lg shadow-cyan/5">
                        <h3 className="text-2xl font-bold mb-6 text-cyan flex items-center gap-3">
                            <span className="p-2 bg-cyan/10 rounded-lg">🚀</span> Main Services
                        </h3>
                        <div className="space-y-6">
                            {summaryData.services.map((service: any, index: number) => (
                                <div key={index} className="border-l-2 border-cyan/40 pl-4 py-1">
                                    <h4 className="text-lg font-bold text-white mb-2">{service.title}</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">{service.info}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Características Clave / Secciones */}
                {summaryData.sections && summaryData.sections.length > 0 && (
                    <div className="bg-white/5 p-8 rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-500/5">
                        <h3 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-3">
                            <span className="p-2 bg-purple-500/10 rounded-lg">✨</span> Key Features
                        </h3>
                        <div className="space-y-6">
                            {summaryData.sections.map((section: any, index: number) => (
                                <div key={index} className="border-l-2 border-purple-500/40 pl-4 py-1">
                                    <h4 className="text-lg font-bold text-white mb-2">{section.title}</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">{section.info}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
