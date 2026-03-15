'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import DockerModal from '../components/DockerModal';
import { normalizePlanForDocker } from '@/utils/docker-generator';
import ComparisonModal from '../components/ComparisonModal';

export default function CompareClient({ providers }: { providers: any[] }) {
  const t = useTranslations('ComparePage');
  const [selectedPlanForDocker, setSelectedPlanForDocker] = useState<any>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredProviders = providers.filter(p => {
    const hasPlans = p.plans && p.plans.length > 0;
    if (!hasPlans) return false;
    if (searchTerm.trim() === '') return true;
    return p.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      {/* Header & Buscador */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">
            {t('title_start')} <span className="text-cyan">{t('title_accent')}</span>
          </h1>
          <p className="text-slate-400">{t('subtitle', { count: providers.length })}</p>
        </div>

        <input
          type="text"
          placeholder={t('search_placeholder')}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:border-cyan outline-none transition-all w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla de Comparación */}
      <div className="relative overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50 backdrop-blur-sm mb-20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 sticky top-0 z-20">
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold w-10"></th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold">{t('table.provider')}</th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold text-center">{t('table.price')}</th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold text-center">{t('table.ram')}</th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold text-center">{t('table.cpu')}</th>
              <th className="p-5 border-b border-slate-800 text-slate-500 text-xs uppercase tracking-widest font-bold text-center">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {filteredProviders.map((provider) => {
              const mainPlan = provider.plans[0];
              if (!mainPlan) return null;

              const isSelected = selectedIds.includes(provider.id);
              return (
                <tr key={provider.id} className={`transition-colors group ${isSelected ? 'bg-cyan/10' : 'hover:bg-white/5'}`}>
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
                      <span className="font-bold text-white">{provider.name}</span>
                    </div>
                  </td>
                  <td className="p-5 text-center font-mono text-cyan font-bold">{mainPlan.price}</td>
                  <td className="p-5 text-center text-slate-300 font-medium">
                    {mainPlan.features?.find((f: any) => f.key === 'memory')?.value || '-'}
                  </td>
                  <td className="p-5 text-center text-slate-300 font-medium">
                    {mainPlan.features?.find((f: any) => f.key === 'vcpu')?.value || '-'}
                  </td>
                  <td className="p-5 text-center">
                    <button
                      onClick={() => setSelectedPlanForDocker(normalizePlanForDocker(mainPlan, provider.name))}
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
          selectedProviders={providers.filter(p => selectedIds.includes(p.id))}
        />
      )}
    </div>
  );
}