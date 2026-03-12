import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/routing';

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className || "w-4 h-4"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

// Agregamos currency a las props
export default function PriceCard({ name, price, currency, features, affiliateLink, isBestValue, lastUpdate, provider, verdict }: any) {
    const t = useTranslations('PriceCard');

    const currencySymbol = currency === 'USD' ? '$' : '€';
    const formattedPrice = Number(price).toFixed(2);
    const displayPrice = currency === 'USD' ? `${currencySymbol}${formattedPrice}` : `${formattedPrice}${currencySymbol}`;

    return (
        <div className={`relative h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300 ${isBestValue
            ? 'border-silver/40 shadow-lg shadow-silver/5 scale-105 z-10 bg-background'
            : 'border-white/10 bg-background'
            }`}>

            {isBestValue && (
                <div className="absolute inset-0 border border-silver/20 rounded-2xl pointer-events-none animate-pulse"></div>
            )}

            {isBestValue && (
                <div className="bg-silver/10 border-b border-silver/30 py-1.5 text-center">
                    <span className="text-silver text-[10px] font-bold uppercase tracking-[0.2em]">
                        {t('best_value')}
                    </span>
                </div>
            )}

            <div className="pb-6 px-6 pt-2 flex flex-col flex-grow relative z-10">
                <header className="mb-4">
                    <p className="text-cyan text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">{provider}</p>
                    <h3 className="text-lg font-bold leading-tight">{name}</h3>
                </header>

                <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-cyan drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                        {displayPrice}
                    </span>
                    <span className="text-slate-400 text-xs font-semibold uppercase">{t('per_month')}</span>
                </div>

                <div className="space-y-3 mb-8 flex-grow">
                    {features.map((feature: any) => (
                        feature.enabled && (
                            <div key={feature.key} className="flex items-start gap-3 text-[13px] text-white/90">
                                <CheckIcon className="w-4 h-4 text-cyan flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">
                                    {/* Next-intl manejará la traducción. Asegúrate de pasar 'value' */}
                                    {t(`features.${feature.key}`, { value: feature.value })}
                                </span>
                            </div>
                        )
                    ))}
                </div>

                <div className="mt-auto">
                    <div className="mb-5 px-3 py-2 rounded-lg bg-cyan/5 border border-cyan/10">
                        <p className="text-[11px] leading-relaxed text-slate-400 italic">
                            "{verdict}"
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
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
                            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" />
                        </a>

                        <a
                            href={`/cloud/${provider.toLowerCase()}`}
                            target="_self"
                            className={`flex items-center justify-center w-full text-center text-sm font-bold py-3 px-4 rounded-xl transition-all active:scale-95 border ${isBestValue
                                ? 'bg-silver text-slate-950 border-silver hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                                }`}
                        >
                            {t('view_all_plans')}
                            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" />
                        </a>
                    </div>

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