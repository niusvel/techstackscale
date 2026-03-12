'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CompareClient({ initialProviders }: { initialProviders: any[] }) {
  const t = useTranslations('ComparePage');

  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>(() => {
    const initialState: Record<string, string> = {};
    initialProviders.forEach(p => {
      if (p.plan) {
        initialState[p.id] = p.plan.plan_id || p.plan.name; // Fallback to name if plan_id is missing, though we should have it
      }
    });
    return initialState;
  });

  const getPlanById = (providerData: any, planId: string) => {
    return providerData?.plans?.find((p: any) => p.plan_id === planId || p.name === planId) || providerData?.plans?.[0];
  };

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
                      <div className="mb-2">
                        <div className="relative inline-block w-full max-w-[200px]">
                          <select
                            value={p.plan.plan_id || p.plan.name}
                            onChange={(e) => handlePlanChange(p.id, e.target.value)}
                            className={`appearance-none w-full bg-transparent border-none text-xl font-black text-white transition-colors cursor-pointer text-center outline-none !bg-none ![-webkit-text-fill-color:initial] ${p.hoverColor || 'hover:text-cyan'}`}
                            style={{ paddingRight: '1.5rem', textOverflow: 'ellipsis' }}
                          >
                            {p.data?.plans?.map((plan: any) => (
                              <option key={plan.plan_id || plan.name} value={plan.plan_id || plan.name} className="text-slate-900 text-base font-normal">
                                {plan.name} ({plan.currency === 'USD' ? '$' : '€'}{Number(plan.price).toFixed(2)})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-end text-slate-400 opacity-60">
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="text-3xl font-black text-cyan drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] mb-4">
                        {p.plan.currency === 'USD' ? '$' : '€'}{Number(p.plan.price).toFixed(2)}{' '}
                        <span className="text-sm text-slate-400 font-normal drop-shadow-none">/m</span>
                      </div>
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
    </div>
  );
}
