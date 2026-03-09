import { useTranslations } from 'next-intl';

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className || "w-4 h-4"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

export default function PriceCard({ name, price, features, affiliateLink, isBestValue, lastUpdate }: any) {
    const t = useTranslations('PriceCard');

    return (
        <div className={`relative h-fit max-w-[280px] rounded-2xl overflow-hidden bg-white border transition-all duration-300 ${isBestValue ? 'border-blue-200 shadow-md scale-105 z-10' : 'border-slate-100 shadow-sm'
            }`}>

            {/* Badge Azul Crema Vibrante */}
            {isBestValue && (
                <div className="bg-[#f0f7ff] border-b border-blue-100 py-1.5 text-center">
                    <span className="text-blue-600 text-[9px] font-bold uppercase tracking-[0.1em]">
                        {t('best_value')}
                    </span>
                </div>
            )}

            <div className="p-5 flex flex-col">
                <header className="mb-3">
                    <h3 className="text-base font-bold text-slate-800">{name}</h3>
                </header>

                <div className="mb-5 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-blue-400">{price}€</span>
                    <span className="text-slate-400 text-[10px] font-medium uppercase">{t('per_month')}</span>
                </div>

                {/* Lista de Features con Checks Azules */}
                <div className="space-y-2 mb-6">
                    {features.map((feature: any) => (
                        feature.enabled && (
                            <div key={feature.key} className="flex items-start gap-2 text-[12px] text-slate-600">
                                <CheckIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <span className="leading-tight">
                                    {t(`features.${feature.key}`, { value: feature.value })}
                                </span>
                            </div>
                        )
                    ))}
                </div>

                {/* Botón Azul Intenso */}
                <a
                    href={affiliateLink}
                    className={`block w-full text-center text-xs font-bold py-2.5 px-4 rounded-lg transition-all active:scale-95 ${isBestValue
                        ? 'bg-blue-400 hover:bg-blue-500 text-white shadow-sm'
                        : 'bg-slate-800 hover:bg-black text-white'
                        }`}
                >
                    {t('get_offer')}
                </a>

                <footer className="mt-4 border-t border-slate-50 pt-3">
                    <p className="text-[8px] text-slate-300 text-center uppercase tracking-tighter">
                        {t('last_update')} {lastUpdate}
                    </p>
                </footer>
            </div>
        </div>
    );
}