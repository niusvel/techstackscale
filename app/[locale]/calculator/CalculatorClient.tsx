'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { parseValue } from './utils';
import { formatPrice } from '@/utils/currency';
import DockerModal from '../components/DockerModal';

export default function CalculatorClient({ providers, locale }: { providers: any[], locale: string }) {
    const t = useTranslations('Calculator');

    // ESTADOS DE FILTROS - Valores iniciales más inclusivos
    const initialFilters = {
        maxPrice: 150,
        minRam: 1,
        ramUnit: 'GB' as 'MB' | 'GB',
        minCpu: 1,
        minStorage: 10,
        minTransfer: 500,
        minNodes: 1,
        minEmails: 0,
        minWebsites: 1,
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
                // Función auxiliar para extraer features considerando que pueden no existir
                const getF = (key: string) => {
                    const feature = plan.features.find((f: any) => f.key === key);
                    return (feature && feature.enabled) ? feature.value : null;
                };

                // Aplicamos los fallbacks solicitados (500 transf, 1 node, 1 website)
                const nRam = parseValue(getF('memory') || 0);
                const nCpu = parseValue(getF('vcpu') || 1);
                const nStorage = parseValue(getF('storage') || 10);
                const nTransfer = parseValue(getF('transfer') || 500);
                const nNodes = parseValue(getF('node_apps') || 1);
                const nEmails = parseValue(getF('emails') || 0);
                const nWebsites = parseValue(getF('websites') || 1);
                const nPrice = parseValue(plan.price);

                // Normalización de RAM a GB
                const isMBInJson = String(getF('memory')).toLowerCase().includes('mb');
                const ramInGb = isMBInJson ? nRam / 1024 : nRam;

                // Cálculo de Score mejorado
                const score = nPrice > 0
                    ? (((ramInGb * 2) + (nCpu * 2) + (nStorage * 0.1) + (nTransfer * 0.01)) / nPrice) * 10
                    : 0;

                return {
                    ...plan,
                    providerName: provider.provider || provider.name,
                    providerId: provider.id,
                    numericPrice: nPrice,
                    currency: plan.currency,
                    ramInGb,
                    nCpu,
                    nStorage,
                    nTransfer,
                    nNodes,
                    nEmails,
                    nWebsites,
                    score: parseFloat(score.toFixed(2)),
                    link: provider.affiliate_link || '#'
                };
            })
        );
    }, [providers]);

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
            p.nWebsites >= filters.minWebsites &&
            p.nEmails >= filters.minEmails &&
            matchesProvider;
    }).sort((a, b) => b.score - a.score);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* BARRA LATERAL DE FILTROS */}
            <aside className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 h-fit sticky top-8">
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
                        max={filters.ramUnit === 'MB' ? 2 : 64}
                        step="1"
                        value={filters.minRam}
                        onChange={(e) => setFilters({ ...filters, minRam: Number(e.target.value) })}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan"
                    />
                </div>

                {/* OTROS FILTROS DINÁMICOS */}
                {[
                    { key: 'maxPrice', label: 'max_price', min: 5, max: 500, step: 5 },
                    { key: 'minCpu', label: 'min_cpu', min: 1, max: 16, step: 1 },
                    { key: 'minStorage', label: 'storage', min: 0, max: 1000, step: 10 },
                    { key: 'minTransfer', label: 'transfer', min: 0, max: 5000, step: 250 },
                    { key: 'minNodes', label: 'nodes', min: 1, max: 20, step: 1 },
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
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${index === 0 ? 'bg-cyan text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                                            {index === 0 ? t('recommendation') : `Rank #${index + 1}`}
                                        </span>
                                        <span className="text-[10px] font-bold border border-green-500/30 text-green-400 px-2 py-0.5 rounded-full uppercase">
                                            Score: {plan.score}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">{plan.providerName} — {plan.name}</h3>

                                    {/* Grid de especificaciones técnico */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 mt-4 text-[11px] text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-slate-500 font-bold">RAM:</span>
                                            <span className="text-slate-200">{plan.ramInGb < 1 ? (plan.ramInGb * 1024) + 'MB' : plan.ramInGb + 'GB'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-slate-500 font-bold">CPU:</span>
                                            <span className="text-slate-200">{plan.nCpu} vCPU</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-slate-500 font-bold">DISK:</span>
                                            <span className="text-slate-200">{plan.nStorage}GB SSD</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-slate-500 font-bold">TRAF:</span>
                                            <span className="text-slate-200">{plan.nTransfer >= 1000 ? (plan.nTransfer / 1000).toFixed(1) + 'TB' : plan.nTransfer + 'GB'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-slate-500 font-bold">APPS:</span>
                                            <span className="text-slate-200">{plan.nNodes}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-slate-500 font-bold">WEBS:</span>
                                            <span className="text-slate-200">{plan.nWebsites}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right flex flex-col items-end justify-center h-full gap-4 min-w-[120px]">
                                    {/* Lógica de símbolo de moneda centralizada */}
                                    <p className="text-3xl font-mono font-bold text-green-400 tracking-tighter">
                                        {formatPrice(plan.numericPrice, plan.currency)}
                                    </p>
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