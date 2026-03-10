'use client';
import { useState } from 'react';

export default function AdminEdit() {
    const [provider, setProvider] = useState('Proveedor');
    const [plans, setPlans] = useState([
        {
            plan_id: 'proveedor_plan_1',
            name: 'Plan',
            price: 0,
            currency: 'EUR',
            is_best_seller: false,
            features: [
                { key: 'memory', enabled: true, value: '' },
                { key: 'vcpu', enabled: true, value: '' },
                { key: 'storage', enabled: true, value: '' },
                { key: 'node_app', enabled: true, value: '' }
            ]
        }
    ]);
    const [affiliateLink, setAffiliateLink] = useState('');
    const [verdicts, setVerdicts] = useState({
        es: '',
        en: '',
        fr: ''
    });

    // CARGAR JSON
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                setProvider(json.provider || 'Proveedor');
                setAffiliateLink(json.affiliate_link || '');

                // Cargamos los veredictos o inicializamos si no existen
                setVerdicts({
                    es: json.verdicts?.es || '',
                    en: json.verdicts?.en || '',
                    fr: json.verdicts?.fr || ''
                });

                setPlans(json.plans || []);
            } catch (err) {
                alert("Error al leer el JSON.");
            }
        };
        reader.readAsText(file);
    };

    // GENERAR ID AUTOMÁTICO
    const generateId = (providerName: string, planName: string, idx: number) => {
        const cleanProvider = providerName.toLowerCase().replace(/\s+/g, '_');
        const cleanPlan = planName.toLowerCase().replace(/\s+/g, '_');
        return `${cleanProvider}_${cleanPlan}_${idx + 1}`;
    };

    // ACTUALIZAR INFO DE PLAN (Con lógica de ID automático)
    const updatePlanInfo = (idx: number, field: string, value: any) => {
        const newPlans = [...plans];
        newPlans[idx] = { ...newPlans[idx], [field]: value };

        // Si cambiamos el nombre, sugerimos el ID
        if (field === 'name') {
            newPlans[idx].plan_id = generateId(provider, value, idx);
        }

        setPlans(newPlans);
    };

    // GESTIÓN DE FEATURES
    const updateFeature = (planIdx: number, featIdx: number, field: string, value: any) => {
        const newPlans = [...plans];
        const newFeatures = [...newPlans[planIdx].features];
        newFeatures[featIdx] = { ...newFeatures[featIdx], [field]: value };
        newPlans[planIdx].features = newFeatures;
        setPlans(newPlans);
    };

    const addFeatureToAll = () => {
        const key = prompt("Nombre técnico de la nueva feature:");
        if (!key) return;
        setPlans(plans.map(plan => ({
            ...plan,
            features: [...plan.features, { key, enabled: true, value: '' }]
        })));
    };

    // GUARDAR Y DESCARGAR
    const downloadJSON = () => {
        const finalData = {
            last_update: new Date().toISOString().replace('T', ' ').split('.')[0],
            provider,
            affiliate_link: affiliateLink,
            verdicts, // Se guarda como objeto: { es: "...", en: "...", fr: "..." }
            plans
        };
        const blob = new Blob([JSON.stringify(finalData, null, 4)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${provider.toLowerCase().replace(/\s+/g, '_')}.json`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                <header className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-md mb-8 shadow-2xl">
                    <div className="flex flex-col gap-6">

                        {/* Título y Controles de Carga/Guardado */}
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                                <span className="bg-cyan w-2 h-8 rounded-full"></span>
                                DATA <span className="text-cyan">FORGER</span> <span className="text-[10px] bg-white/10 px-2 py-1 rounded ml-2">i18n READY</span>
                            </h1>
                            <div className="flex gap-3">
                                <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs font-black transition-all">
                                    📂 CARGAR
                                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                                </label>
                                <button onClick={downloadJSON} className="bg-cyan text-slate-950 px-4 py-2 rounded-xl font-black text-xs shadow-lg shadow-cyan/20 hover:scale-105 transition-all">
                                    💾 GUARDAR
                                </button>
                            </div>
                        </div>

                        {/* Fila 1: Nombre y Link */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Nombre del Proveedor</label>
                                <input value={provider} onChange={(e) => setProvider(e.target.value)} className="admin-input text-cyan font-bold" />
                            </div>
                            <div>
                                <label className="admin-label">Enlace de Afiliación</label>
                                <input value={affiliateLink} onChange={(e) => setAffiliateLink(e.target.value)} className="admin-input text-slate-400" placeholder="https://..." />
                            </div>
                        </div>

                        {/* Fila 2: Veredictos Multilenguaje */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-4">
                            <div>
                                <label className="admin-label flex items-center gap-2">
                                    <span className="text-sm">🇪🇸</span> Veredicto Español
                                </label>
                                <textarea
                                    value={verdicts.es}
                                    onChange={(e) => setVerdicts({ ...verdicts, es: e.target.value })}
                                    className="admin-input min-h-[100px] text-xs italic"
                                    placeholder="Texto en español..."
                                />
                            </div>
                            <div>
                                <label className="admin-label flex items-center gap-2">
                                    <span className="text-sm">🇬🇧</span> Veredicto Inglés
                                </label>
                                <textarea
                                    value={verdicts.en}
                                    onChange={(e) => setVerdicts({ ...verdicts, en: e.target.value })}
                                    className="admin-input min-h-[100px] text-xs italic"
                                    placeholder="English text..."
                                />
                            </div>
                            <div>
                                <label className="admin-label flex items-center gap-2">
                                    <span className="text-sm">🇫🇷</span> Veredicto Francés
                                </label>
                                <textarea
                                    value={verdicts.fr}
                                    onChange={(e) => setVerdicts({ ...verdicts, fr: e.target.value })}
                                    className="admin-input min-h-[100px] text-xs italic"
                                    placeholder="Texte en français..."
                                />
                            </div>
                        </div>

                    </div>
                </header>

                <div className="space-y-8">
                    {plans.map((plan, pIdx) => (
                        <div key={pIdx} className={`bg-slate-900/60 border ${plan.is_best_seller ? 'border-cyan/50 shadow-cyan/10' : 'border-white/10'} rounded-3xl overflow-hidden shadow-xl transition-all`}>

                            {/* Barra superior del plan */}
                            <div className="p-6 border-b border-white/5 bg-white/[0.02] grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                <div className="md:col-span-4">
                                    <label className="admin-label">Nombre del Plan</label>
                                    <input value={plan.name} onChange={(e) => updatePlanInfo(pIdx, 'name', e.target.value)} className="admin-input" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="admin-label">Precio</label>
                                    <div className="flex gap-2">
                                        <input type="number" step="0.01" value={plan.price} onChange={(e) => updatePlanInfo(pIdx, 'price', e.target.value)} className="admin-input flex-grow" />
                                        <select value={plan.currency} onChange={(e) => updatePlanInfo(pIdx, 'currency', e.target.value)} className="admin-input w-20">
                                            <option value="EUR">€</option>
                                            <option value="USD">$</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="admin-label">ID Automático</label>
                                    <input value={plan.plan_id} onChange={(e) => updatePlanInfo(pIdx, 'plan_id', e.target.value)} className="admin-input text-cyan/70 font-mono text-[10px]" />
                                </div>
                                <div className="md:col-span-2 flex items-center justify-around h-10 bg-slate-800/50 rounded-lg px-3">
                                    <label className="text-[9px] font-black text-slate-400">BEST SELLER</label>
                                    <input
                                        type="checkbox"
                                        checked={plan.is_best_seller}
                                        onChange={(e) => updatePlanInfo(pIdx, 'is_best_seller', e.target.checked)}
                                        className="w-5 h-5 accent-cyan"
                                    />
                                </div>
                                <div className="md:col-span-1 text-right">
                                    <button onClick={() => setPlans(plans.filter((_, i) => i !== pIdx))} className="text-red-500 hover:text-red-400 p-2">✕</button>
                                </div>
                            </div>

                            {/* Grid de Features */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-900/20">
                                {plan.features.map((feat, fIdx) => (
                                    <div key={fIdx} className="bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-cyan/70 uppercase">{feat.key}</span>
                                            <input
                                                type="checkbox"
                                                checked={feat.enabled}
                                                onChange={(e) => updateFeature(pIdx, fIdx, 'enabled', e.target.checked)}
                                                className="w-4 h-4 accent-cyan"
                                            />
                                        </div>
                                        <input
                                            value={feat.value}
                                            onChange={(e) => updateFeature(pIdx, fIdx, 'value', e.target.value)}
                                            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-cyan outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-4 justify-center pb-20">
                    <button onClick={() => setPlans([...plans, { ...plans[0], plan_id: `plan_${Date.now()}`, name: 'Nuevo Plan', is_best_seller: false }])} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm">
                        + AÑADIR PLAN
                    </button>
                    <button onClick={addFeatureToAll} className="px-8 py-3 bg-cyan/10 border border-cyan/20 text-cyan rounded-2xl font-bold text-sm uppercase">
                        ✨ NUEVA FEATURE GLOBAL
                    </button>
                </div>
            </div>

            <style jsx>{`
        .admin-label { display: block; font-size: 9px; font-weight: 900; text-transform: uppercase; color: #64748b; margin-bottom: 4px; letter-spacing: 0.1em; }
        .admin-input { width: 100%; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 8px 12px; color: white; font-size: 13px; outline: none; transition: border-color 0.2s; }
        .admin-input:focus { border-color: #06b6d4; }
      `}</style>
        </div>
    );
}