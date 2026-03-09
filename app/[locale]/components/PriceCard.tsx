import { useTranslations } from 'next-intl';

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className || "w-4 h-4"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

export default function PriceCard({ name, price, features, affiliateLink, isBestValue, lastUpdate }: any) {
    const t = useTranslations('PriceCard');

    return (
        /* CLAVE 1: h-full y flex-col para que todas las cards midan lo mismo.
           Se eliminó max-w para que el grid mande.
        */
        <div className={`relative h-full flex flex-col rounded-2xl overflow-hidden glass transition-all duration-300 ${isBestValue
                ? 'border-silver/40 shadow-lg shadow-silver/5 scale-105 z-10 bg-slate-900/60'
                : 'border-white/10 bg-slate-900/40'
            }`}>

            {/* Glowing Border effect for Best Value */}
            {isBestValue && (
                <div className="absolute inset-0 border border-silver/20 rounded-2xl pointer-events-none animate-pulse"></div>
            )}

            {/* Badge Neon Silver */}
            {isBestValue && (
                <div className="bg-silver/20 border-b border-silver/30 py-1.5 text-center">
                    <span className="text-silver text-[10px] font-bold uppercase tracking-[0.2em]">
                        {t('best_value')}
                    </span>
                </div>
            )}

            {/* CLAVE 2: flex-grow en el contenedor de arriba empuja al footer hacia abajo 
            */}
            <div className="p-6 flex flex-col flex-grow relative z-10">
                <header className="mb-4">
                    <h3 className="text-lg font-bold text-white leading-tight">{name}</h3>
                </header>

                <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-cyan drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                        {price}€
                    </span>
                    <span className="text-slate-400 text-xs font-semibold uppercase">{t('per_month')}</span>
                </div>

                {/* Lista de Features crece para ocupar el espacio sobrante */}
                <div className="space-y-3 mb-8 flex-grow">
                    {features.map((feature: any) => (
                        feature.enabled && (
                            <div key={feature.key} className="flex items-start gap-3 text-[13px] text-white/90">
                                <CheckIcon className="w-4 h-4 text-cyan flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">
                                    {t(`features.${feature.key}`, { value: feature.value })}
                                </span>
                            </div>
                        )
                    ))}
                </div>

                {/* CLAVE 3: mt-auto asegura que el botón y el footer se alineen al final 
                */}
                <div className="mt-auto">
                    <a
                        href={affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center w-full text-center text-sm font-bold py-3 px-4 rounded-xl transition-all active:scale-95 border ${isBestValue
                                ? 'bg-silver text-slate-950 border-silver hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                            }`}
                    >
                        {t('get_offer')}
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>

                    <footer className="mt-5 border-t border-white/10 pt-4">
                        <p className="text-[9px] text-slate-500 text-center uppercase tracking-widest font-medium">
                            {t('last_update')} {lastUpdate}
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}