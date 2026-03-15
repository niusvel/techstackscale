// components/ComparisonModal.tsx
'use client';

import { useTranslations } from 'next-intl';

interface ComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedProviders: any[];
}

export default function ComparisonModal({ isOpen, onClose, selectedProviders }: ComparisonModalProps) {
    const t = useTranslations('ComparePage');

    if (!isOpen || selectedProviders.length === 0) return null;

    // 1. Extraer todas las claves de características (features) únicas de los planes seleccionados
    const allFeatureKeys = Array.from(
        new Set(
            selectedProviders.flatMap(p =>
                p.plans[0]?.features?.map((f: any) => f.key) || []
            )
        )
    ) as string[];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
            <div className="bg-slate-900 border border-white/10 w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                    <h2 className="text-2xl font-black text-white italic">
                        {t('modal.compare_title')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-3xl transition-colors"
                    >
                        &times;
                    </button>
                </div>

                {/* Contenido de la Tabla */}
                <div className="flex-1 overflow-auto p-6">
                    <table className="w-full border-separate border-spacing-x-2">
                        <thead>
                            <tr>
                                <th className="w-1/4 p-4 text-left text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                                    {t('table.feature')}
                                </th>
                                {selectedProviders.map(p => (
                                    <th key={p.id} className="p-4">
                                        <div className="bg-slate-800/50 border border-cyan/20 rounded-2xl p-4 text-center">
                                            <span className="block text-cyan font-bold text-[10px] mb-1 uppercase tracking-widest">
                                                {p.name}
                                            </span>
                                            <span className="text-white font-bold text-sm block truncate">
                                                {p.plans[0]?.name}
                                            </span>
                                            {/* Badge de Contexto/Categoría */}
                                            <span className="mt-2 inline-block px-2 py-0.5 rounded text-[8px] font-bold bg-white/5 text-slate-400 uppercase">
                                                {p.data?.category || 'Cloud Service'}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {/* Fila de Precio */}
                            <tr className="bg-cyan/5">
                                <td className="p-4 font-bold text-slate-300 text-xs uppercase">{t('table.price')}</td>
                                {selectedProviders.map(p => (
                                    <td key={p.id} className="p-4 text-center text-xl font-mono text-cyan font-black">
                                        {p.plans[0]?.price}
                                    </td>
                                ))}
                            </tr>

                            {/* Mapeo dinámico de todas las propiedades */}
                            {allFeatureKeys.map(key => (
                                <tr key={key} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-slate-400 text-xs font-medium capitalize">
                                        {t(`table.${key}`)}
                                    </td>
                                    {selectedProviders.map(p => {
                                        const feature = p.plans[0]?.features?.find((f: any) => f.key === key);
                                        const isEnabled = feature?.enabled;

                                        return (
                                            <td key={p.id} className="p-4 text-center">
                                                {isEnabled ? (
                                                    <span className="text-slate-200 text-sm font-medium">{feature.value}</span>
                                                ) : (
                                                    <span className="text-red-500 font-black text-lg">✕</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-slate-900/50 text-center">
                    <button
                        onClick={onClose}
                        className="bg-cyan text-slate-950 px-10 py-3 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-cyan/20"
                    >
                        {t('modal.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}