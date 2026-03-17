'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import DockerModal from '../components/DockerModal';
import { normalizePlanForDocker } from '@/utils/docker-generator';
import ComparisonModal from '../components/ComparisonModal';
import { formatPrice } from '@/utils/currency';
import { parseValue } from '../calculator/utils';

export default function CompareClient({ providers }: { providers: any[] }) {
  const t = useTranslations('ComparePage');
  const [selectedPlanForDocker, setSelectedPlanForDocker] = useState<any>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<Record<string, number>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
      maxPrice: 999,
      minRam: 0,
      minCpu: 0,
      minStorage: 0,
      minNodes: 0
  });

  const matchesFilters = (plan: any) => {
    if (!plan) return false;
    const price = parseValue(plan.price, 'price');
    const getF = (key: string) => parseValue(plan.features?.find((f: any) => f.key === key)?.value || '0', key);
    return price <= (filters.maxPrice || 9999) &&
           getF('memory') >= (filters.minRam || 0) &&
           getF('vcpu') >= (filters.minCpu || 0) &&
           getF('storage') >= (filters.minStorage || 0) &&
           getF('node_apps') >= (filters.minNodes || 0);
  };

  const filteredProviders = providers.filter(p => {
    const hasPlans = p.plans && p.plans.length > 0;
    if (!hasPlans) return false;
    if (searchTerm.trim() !== '' && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return p.plans.some(matchesFilters);
  });

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-2 py-2">
      {/* Header & Buscador */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-40">
          <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder={t('search_placeholder')}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-cyan outline-none transition-all w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          />
          {isSearchFocused && searchTerm.trim() !== '' && (
            <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              {providers
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.plans && p.plans.length > 0)
                .map(provider => (
                  <button
                    key={provider.id}
                    className="w-full text-left px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800/50 last:border-0"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Evita que el onBlur del input dispare antes
                      setSearchTerm(provider.name);
                      setIsSearchFocused(false);
                    }}
                  >
                    {provider.name}
                  </button>
                ))}
              {providers.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.plans && p.plans.length > 0).length === 0 && (
                <div className="px-4 py-3 text-slate-500 text-sm italic">
                  No se encontraron proveedores.
                </div>
              )}
            </div>
          )}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="text-slate-300 bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors w-full md:w-auto justify-center">
          {t('filters.title')} {showFilters ? '▲' : '▼'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">{t('filters.max_price')}</label>
            <input type="number" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})} className="bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white outline-none focus:border-cyan" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">{t('filters.min_ram')}</label>
            <input type="number" value={filters.minRam} onChange={(e) => setFilters({...filters, minRam: Number(e.target.value)})} className="bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white outline-none focus:border-cyan" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">{t('filters.min_cpu')}</label>
            <input type="number" value={filters.minCpu} onChange={(e) => setFilters({...filters, minCpu: Number(e.target.value)})} className="bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white outline-none focus:border-cyan" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">{t('filters.min_storage')}</label>
            <input type="number" value={filters.minStorage} onChange={(e) => setFilters({...filters, minStorage: Number(e.target.value)})} className="bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white outline-none focus:border-cyan" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">{t('filters.min_nodes')}</label>
            <input type="number" value={filters.minNodes} onChange={(e) => setFilters({...filters, minNodes: Number(e.target.value)})} className="bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white outline-none focus:border-cyan" />
          </div>
        </div>
      )}
      </div>

      {/* Tabla de Comparación */}
      <div className="relative overflow-x-auto rounded-2xl border border-slate-800 bg-background mb-5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
              <th className="p-5 text-slate-500 text-xs uppercase tracking-widest font-bold w-10"></th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold">{t('table.provider')}</th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold">{t('table.plan')}</th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold text-center">{t('table.price')}</th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold text-center">{t('table.ram')}</th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold text-center">{t('table.cpu')}</th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold text-center">{t('table.storage')}</th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold text-center">{t('table.node_apps')}</th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold text-center">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {filteredProviders.map((provider) => {
              const defaultIndex = provider.plans.findIndex(matchesFilters);
              const fallbackIndex = defaultIndex !== -1 ? defaultIndex : 0;
              const savedIndex = selectedPlans[provider.id] ?? fallbackIndex;
              const isSavedMatching = matchesFilters(provider.plans[savedIndex]);
              const activePlanIndex = isSavedMatching ? savedIndex : fallbackIndex;
              const selectedPlan = provider.plans[activePlanIndex];
              
              if (!selectedPlan) return null;

              const isSelected = selectedIds.includes(provider.id);
              return (
                <tr key={provider.id} className={`transition-colors group ${isSelected ? 'bg-cyan/10' : 'hover:bg-slate-900/50'}`}>
                  <td className="p-5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(provider.id)}
                      className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-cyan focus:ring-cyan"
                    />
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white min-w-[max-content]">{provider.name}</span>
                    </div>
                  </td>
                  <td className="p-5 text-slate-300 font-medium">
                    <select
                      value={activePlanIndex}
                      onChange={(e) => setSelectedPlans(prev => ({ ...prev, [provider.id]: Number(e.target.value) }))}
                      className="bg-slate-800 text-xs text-slate-300 border border-slate-700 rounded px-2 py-1 outline-none focus:border-cyan"
                    >
                      {provider.plans.map((p: any, idx: number) => (
                        <option key={idx} value={idx}>{p.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-5 text-center font-mono text-cyan font-bold">{formatPrice(selectedPlan.price, selectedPlan.currency)}</td>
                  <td className="p-5 text-center text-slate-300 font-medium">
                    {selectedPlan.features?.find((f: any) => f.key === 'memory')?.value || '-'}
                  </td>
                  <td className="p-5 text-center text-slate-300 font-medium">
                    {selectedPlan.features?.find((f: any) => f.key === 'vcpu')?.value || '-'}
                  </td>
                  <td className="p-5 text-center text-slate-300 font-medium">
                    {selectedPlan.features?.find((f: any) => f.key === 'storage')?.value || '-'}
                  </td>
                  <td className="p-5 text-center text-slate-300 font-medium">
                    {selectedPlan.features?.find((f: any) => f.key === 'node_apps')?.value || '-'}
                  </td>
                  <td className="p-5 text-center">
                    <button
                      onClick={() => setSelectedPlanForDocker(normalizePlanForDocker(selectedPlan, provider.name))}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan transition-all"
                      title={t('table.tooltip_docker')}
                    >
                      🐳
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating Action Bar - Aparece al seleccionar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-cyan/30 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6">
          <div className="text-sm font-medium text-white">
            {t('selection_bar.count', { count: selectedIds.length })}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSelectedIds([])} className="text-slate-400 hover:text-white text-sm px-3 py-1">
              {t('selection_bar.clear')}
            </button>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="bg-cyan text-slate-950 px-5 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
            >
              {t('selection_bar.btn_compare')}
            </button>
          </div>
        </div>
      )}

      {selectedPlanForDocker && (
        <DockerModal
          plan={selectedPlanForDocker}
          isOpen={!!selectedPlanForDocker}
          onClose={() => setSelectedPlanForDocker(null)}
        />
      )}

      {isCompareModalOpen && (
        <ComparisonModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          selectedProviders={providers.filter(p => selectedIds.includes(p.id)).map(p => ({
            ...p,
            plans: [p.plans[selectedPlans[p.id] || 0]] // Pass only the selected plan to modal
          }))}
        />
      )}
    </div>
  );
}