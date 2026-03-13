'use client';

import { useState, type FocusEvent } from 'react';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/utils/currency';
import DockerModal from '../components/DockerModal';
import { normalizePlanForDocker } from '@/utils/docker-generator';

export default function CompareClient({ initialProviders }: { initialProviders: any[] }) {
  const t = useTranslations('ComparePage');

  const [selectedPlanForDocker, setSelectedPlanForDocker] = useState<any>(null);
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    initialProviders.forEach(p => {
      if (p.plan) {
        initialState[p.id] = p.plan.plan_id || p.plan.name; // Fallback to name if plan_id is missing, though we should have it
      }
    });
    return initialState;
  });

  const [openProviderId, setOpenProviderId] = useState<string | null>(null);

  const getPlanById = (providerData: any, planId: string) => {
    return (
      providerData?.plans?.find(
        (p: any) => String(p.plan_id) === String(planId) || p.name === planId
      ) || providerData?.plans?.[0]
    );
  };

  const getPlanKey = (plan: any) => String(plan?.plan_id ?? plan?.name ?? '');

  const formatPlanPrice = (plan: any) => formatPrice(plan?.price, plan?.currency);

  const formatPlanName = (name: string, maxLength = 15) =>
    name.length > maxLength ? `${name.slice(0, maxLength - 3)}...` : name;

  const getFeatureValue = (plan: any, featureKey: string) => {
    if (!plan) return '-';
    const feature = plan.features.find((f: any) => f.key === featureKey);
    if (!feature) return '-';
    if (!feature.enabled) return '❌';
    return feature.value || '✅';
  };

  const providers = initialProviders.map(p => {
    const activePlanId = selectedPlans[p.id];
    const activePlan = getPlanById(p.data, activePlanId);
    return {
      ...p,
      plan: activePlan
    };
  });

  const handlePlanChange = (providerId: string, planId: string) => {
    setSelectedPlans(prev => ({
      ...prev,
      [providerId]: planId
    }));
  };

  const handlePlanSelect = (providerId: string, planId: string) => {
    handlePlanChange(providerId, planId);
    setOpenProviderId(null);
  };

  const handleDropdownBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      setOpenProviderId(null);
    }
  };

  const getPlanNameElement = (p: any) => {
    return (
      <div className="mb-2">
        <div
          className="relative inline-block w-full max-w-[200px]"
          tabIndex={0}
          onBlur={handleDropdownBlur}
        >
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={openProviderId === p.id}
            aria-controls={`plan-menu-${p.id}`}
            onClick={() => setOpenProviderId(prev => (prev === p.id ? null : p.id))}
            className={`relative w-full bg-transparent border-none text-lg font-black text-white transition-colors cursor-pointer text-center outline-none ${p.hoverColor || 'hover:text-cyan'}`}
            style={{ paddingRight: '1.5rem' }}
          >
            <span className="block w-full pr-6 text-center" title={p.plan.name}>
              {formatPlanName(p.plan.name)}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end text-slate-400 opacity-60">
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${openProviderId === p.id ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          {openProviderId === p.id && (
            <div
              id={`plan-menu-${p.id}`}
              role="listbox"
              className="absolute z-20 mt-2 w-full rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur"
            >
              {p.data?.plans?.map((plan: any) => {
                const planKey = getPlanKey(plan);
                const isSelected = planKey === getPlanKey(p.plan);
                return (
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    key={planKey}
                    onClick={() => handlePlanSelect(p.id, planKey)}
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors ${isSelected ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10'
                      }`}
                  >
                    <span className="truncate">{plan.name}</span>
                    <span className="shrink-0 text-slate-400 tabular-nums">{formatPlanPrice(plan)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-6 text-slate-400 font-medium w-1/4" />
              {providers.map((p) => (
                <th key={p.id} className="p-6 text-center w-1/4 align-top">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4 ${p.color}`}>
                    {p.name}
                  </div>
                  {p.plan ? (
                    <>
                      {getPlanNameElement(p)}
                      <div className="text-3xl font-black text-cyan drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] mb-4">
                        {formatPrice(p.plan.price, p.plan.currency)}{' '}
                        <span className="text-sm text-slate-400 font-normal drop-shadow-none">/m</span>
                      </div>

                      <button
                        onClick={() => setSelectedPlanForDocker(normalizePlanForDocker(p.plan, p.name))}
                        className="w-full text-slate-950 mb-2 bg-slate-500 text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-cyan transition-all transform active:scale-95 text-center shadow-lg"
                      >
                        {t('generate_docker_stack')}
                      </button>
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full py-3 rounded-xl font-bold transition-all ${p.btnColor} shadow-lg`}
                      >
                        {t('get_offer')}
                      </a>
                    </>
                  ) : (
                    <div className="text-sm text-slate-500 italic p-4">
                      {t('waiting_data', { provider: p.name })}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="p-6 font-medium text-slate-300">{t('features.memory')}</td>
              {providers.map((p) => (
                <td key={p.id} className="p-6 text-center text-white font-medium">
                  {getFeatureValue(p.plan, 'memory')}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors bg-white/[0.01]">
              <td className="p-6 font-medium text-slate-300">{t('features.vcpu')}</td>
              {providers.map((p) => (
                <td key={p.id} className="p-6 text-center text-white font-medium">
                  {getFeatureValue(p.plan, 'vcpu')}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="p-6 font-medium text-slate-300">{t('features.transfer')}</td>
              {providers.map((p) => (
                <td key={p.id} className="p-6 text-center text-white font-medium">
                  {getFeatureValue(p.plan, 'transfer')}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors bg-white/[0.01]">
              <td className="p-6 font-medium text-slate-300">{t('features.storage')}</td>
              {providers.map((p) => (
                <td key={p.id} className="p-6 text-center text-white font-medium">
                  {getFeatureValue(p.plan, 'storage')}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="p-6 font-medium text-slate-300">{t('features.websites')}</td>
              {providers.map((p) => (
                <td key={p.id} className="p-6 text-center text-white font-medium">
                  {getFeatureValue(p.plan, 'websites')}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors bg-white/[0.01]">
              <td className="p-6 font-medium text-slate-300">{t('features.node_apps')}</td>
              {providers.map((p) => (
                <td key={p.id} className="p-6 text-center text-white font-medium">
                  {getFeatureValue(p.plan, 'node_apps')}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="p-6 font-medium text-slate-300">{t('features.emails')}</td>
              {providers.map((p) => (
                <td key={p.id} className="p-6 text-center text-white font-medium">
                  {getFeatureValue(p.plan, 'emails')}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
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

