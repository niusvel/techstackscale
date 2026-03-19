'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { formatDisplayValue, parseValue } from './utils';
import { formatPrice } from '@/utils/currency';
import DockerModal from '../components/DockerModal';
import { calculatePlanScore } from '@/utils/score';

export default function CalculatorClient({ providers, locale }: { providers: any[], locale: string }) {
    const t = useTranslations('Calculator');

    // ESTADOS DE FILTROS - Valores iniciales más inclusivos
    const initialFilters = {
        maxPrice: 150,
        minRam: 0,
        ramUnit: 'GB' as 'MB' | 'GB',
        minCpu: 0,
        minStorage: 0,
        minTransfer: 0,
        minNodes: 0,
        minEmails: 0,
        minWebsites: 0,
        selectedProviders: [] as string[],
        currency: 'EUR'
    };

    const [selectedPlanForDocker, setSelectedPlanForDocker] = useState<any>(null);
    const [filters, setFilters] = useState(initialFilters);

    const mbValues = [128, 256, 512];
    const resetFilters = () => setFilters(initialFilters);

    const allPlans = useMemo(() => {
        return providers.flatMap(provider =>
            provider.plans.map((plan: any) => {
                const getFeatureObj = (key: string) => plan.features.find((f: any) => f.key === key);
                const getF = (key: string) => {
                    const f = getFeatureObj(key);
                    return (f && f.enabled) ? f.value : null;
                };

                const rawStorage = String(getF('storage') || "");
                const isNVMe = rawStorage.toLowerCase().includes('nvme');

                const offertFeature = plan.features?.find((f: any) => f.key === 'offert');
                const hasOffer = offertFeature && offertFeature.enabled;
                const finalPrice = hasOffer ? parseValue(offertFeature.value, 'price') : parseValue(plan.price, 'price');

                // 2. Valores Numéricos para Filtrado
                const nRam = parseValue(getF('memory'), 'memory');
                const nCpu = parseValue(getF('vcpu'), 'vcpu');
                const nStorage = parseValue(getF('storage'), 'storage');
                const nTransfer = parseValue(getF('transfer'), 'transfer');
                const nNodes = parseValue(getF('node_apps'), 'node_apps');

                const isMB = String(getF('memory')).toLowerCase().includes('mb');
                const ramInGb = isMB ? nRam / 1024 : nRam;

                const scoreValue = calculatePlanScore(plan);

                return {
                    ...plan,
                    providerName: provider.provider || provider.name,
                    providerId: provider.id,
                    numericPrice: finalPrice,
                    originalPrice: parseValue(plan.price, 'price'),
                    hasOffer,
                    isNVMe,
                    ramInGb,
                    // Guardamos el objeto completo de features para la UI
                    allFeatures: plan.features,
                    score: scoreValue,
                    link: provider.affiliate_link || '#',
                    // Guardamos los valores parseados para los filtros
                    nCpu, nStorage, nTransfer, nNodes
                };
            })
        );
    }, [providers]);

    const dynamicMax = useMemo(() => ({
        price: Math.max(...allPlans.map(p => p.numericPrice)),
        ram: Math.max(...allPlans.map(p => p.ramInGb)),
        cpu: Math.max(...allPlans.map(p => p.nCpu)),
        storage: Math.max(...allPlans.map(p => p.nStorage === 999999 ? 0 : p.nStorage)), // Ignoramos Unlimited para el slider
        transfer: Math.max(...allPlans.map(p => p.nTransfer === 999999 ? 0 : p.nTransfer)), // Ignoramos Unlimited para el slider
        nodes: Math.max(...allPlans.map(p => p.nNodes === 999999 ? 0 : p.nNodes)) // Ignoramos Unlimited para el slider
    }), [allPlans]);
    console.log(dynamicMax);

    const filtered = allPlans.filter(p => {
        const filterRamInGb = filters.ramUnit === 'MB'
            ? mbValues[filters.minRam] / 1024
            : filters.minRam;

        const matchesProvider = filters.selectedProviders.length === 0 || filters.selectedProviders.includes(p.providerId);

        return p.numericPrice <= filters.maxPrice &&
            p.ramInGb >= filterRamInGb &&
            p.nCpu >= filters.minCpu &&
            p.nStorage >= filters.minStorage &&
            p.nTransfer >= filters.minTransfer &&
            p.nNodes >= filters.minNodes &&
            matchesProvider;
    }).sort((a, b) => b.score - a.score);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* BARRA LATERAL DE FILTROS */}
            <aside className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 h-fit">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-white uppercase tracking-wider text-xs">{t('providers')}</h2>
                    <button onClick={resetFilters} className="text-[10px] text-cyan hover:text-white transition-colors underline uppercase font-bold">
                        {t('reset')}
                    </button>
                </div>

                {/* SELECTOR DE PROVEEDORES */}
                <div className="flex flex-wrap gap-2">
                    {providers.map(p => (
                        <button
                            key={p.id}
                            onClick={() => {
                                const next = filters.selectedProviders.includes(p.id)
                                    ? filters.selectedProviders.filter(id => id !== p.id)
                                    : [...filters.selectedProviders, p.id];
                                setFilters({ ...filters, selectedProviders: next });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${filters.selectedProviders.includes(p.id)
                                ? 'bg-cyan border-cyan text-slate-950'
                                : 'border-slate-800 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            {p.provider || p.name}
                        </button>
                    ))}
                </div>

                <hr className="border-slate-800" />

                {/* FILTRO RAM */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-300">
                            {t('min_ram', { value: filters.ramUnit === 'MB' ? mbValues[filters.minRam] : filters.minRam })}{filters.ramUnit}
                        </label>
                        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                            {(['MB', 'GB'] as const).map(u => (
                                <button
                                    key={u}
                                    onClick={() => setFilters({ ...filters, ramUnit: u, minRam: u === 'MB' ? 0 : 1 })}
                                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${filters.ramUnit === u ? 'bg-cyan text-slate-950' : 'text-slate-500'}`}
                                >
                                    {u}
                                </button>
                            ))}
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={filters.ramUnit === 'MB' ? 2 : dynamicMax.ram}
                        step="1"
                        value={filters.minRam}
                        onChange={(e) => setFilters({ ...filters, minRam: Number(e.target.value) })}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan"
                    />
                </div>

                {/* OTROS FILTROS DINÁMICOS */}
                {[
                    { key: 'maxPrice', label: 'max_price', min: 0, max: dynamicMax.price, step: 5 },
                    { key: 'minCpu', label: 'min_cpu', min: 0, max: dynamicMax.cpu, step: 1 },
                    { key: 'minStorage', label: 'storage', min: 0, max: dynamicMax.storage, step: 10 },
                    { key: 'minTransfer', label: 'transfer', min: 0, max: dynamicMax.transfer, step: 250 },
                    { key: 'minNodes', label: 'nodes', min: 0, max: dynamicMax.nodes, step: 1 },
                ].map(f => (
                    <div key={f.key} className="space-y-3">
                        <label className="block text-sm font-bold text-slate-300">
                            {t(f.label, { value: (filters as any)[f.key] })}
                        </label>
                        <input
                            type="range" min={f.min} max={f.max} step={f.step}
                            value={(filters as any)[f.key]}
                            onChange={(e) => setFilters({ ...filters, [f.key]: Number(e.target.value) })}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan"
                        />
                    </div>
                ))}
            </aside>

            {/* LISTADO DE RESULTADOS */}
            <div className="lg:col-span-2 space-y-4">
                {/* Contador de resultados mejorado */}
                <div className="bg-background border border-slate-800 p-4 rounded-xl flex justify-between items-center mb-6">
                    <span className="text-sm text-slate-400 font-medium">
                        {t('results_found', { count: filtered.length })}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        Total: {allPlans.length} planes
                    </span>
                </div>

                {filtered.length > 0 ? (
                    filtered.map((plan, index) => (
                        <div key={index} className={`p-6 rounded-2xl border transition-all duration-300 ${index === 0 ? 'border-cyan bg-slate-900 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'border-slate-800 bg-background hover:border-slate-700'}`}>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        {/* Badge de Ranking */}
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${index === 0 ? 'bg-cyan text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                                            {index === 0 ? t('recommendation') : `#${index + 1}`}
                                        </span>
                                        <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-0.5 rounded-full border border-white/5">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Score</span>
                                            <span className={`text-xs font-mono font-bold ${plan.score > 7 ? 'text-cyan' : 'text-amber-400'}`}>
                                                {plan.score}
                                            </span>
                                        </div>

                                        {/* Badge de Tipo (si existe en el JSON, ej: Wordpress) */}
                                        {plan.type && (
                                            <span className="text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full uppercase">
                                                {plan.type}
                                            </span>
                                        )}

                                        {/* Badge de NVMe */}
                                        {plan.isNVMe && (
                                            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                                                ⚡ NVMe
                                            </span>
                                        )}

                                        {/* Badge de Oferta */}
                                        {plan.hasOffer && (
                                            <span className="text-[10px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full uppercase animate-pulse">
                                                {t('special_offer')}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-white tracking-tight">
                                        {plan.providerName} <span className="text-slate-500 font-medium mx-1">/</span> {plan.name}
                                    </h3>

                                    {/* Grid Dinámico de Features: Muestra TODO lo que hay en el JSON */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 mt-5">
                                        {plan.allFeatures.map((feat: any) => (
                                            <div key={feat.key} className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">
                                                    {feat.key.replace('_', ' ')}
                                                </span>
                                                <span className={`text-[11px] font-bold ${feat.enabled ? 'text-slate-200' : 'text-slate-600 line-through'}`}>
                                                    {formatDisplayValue(feat.value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-right flex flex-col items-end justify-center h-full gap-4 min-w-[120px]">
                                    {/* Lógica de símbolo de moneda centralizada */}
                                    <div className="flex flex-col items-end">
                                        {plan.hasOffer && (
                                            <span className="text-xs text-slate-500 line-through mb-[-4px]">
                                                {formatPrice(plan.originalPrice, plan.currency)}
                                            </span>
                                        )}
                                        <p className="text-3xl font-mono font-bold text-green-400 tracking-tighter">
                                            {formatPrice(plan.numericPrice, plan.currency)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPlanForDocker(plan)}
                                        className="w-full text-slate-950 bg-slate-500 text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-cyan transition-all transform active:scale-95 text-center shadow-lg"
                                    >
                                        {t('generate_docker_stack')}
                                    </button>
                                    <Link
                                        href={plan.link}
                                        target="_blank"
                                        className="w-full bg-white text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-cyan transition-all transform active:scale-95 text-center shadow-lg"
                                    >
                                        {t('get_offer')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl p-20 text-center">
                        <p className="text-slate-500 font-medium">{t('no_results')}</p>
                    </div>
                )}
            </div>
            {selectedPlanForDocker && (
                <DockerModal
                    plan={selectedPlanForDocker}
                    isOpen={!!selectedPlanForDocker}
                    onClose={() => setSelectedPlanForDocker(null)}
                />
            )}
        </div>
    );
}