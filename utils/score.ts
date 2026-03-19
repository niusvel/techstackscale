import { parseValue } from '@/app/[locale]/calculator/utils';

export const calculatePlanScore = (plan: any): number => {
    const getFeatureObj = (key: string) => plan.features?.find((f: any) => f.key === key);
    const getF = (key: string) => {
        const f = getFeatureObj(key);
        return (f && f.enabled) ? f.value : null;
    };

    const rawStorage = String(getF('storage') || "");
    const isNVMe = rawStorage.toLowerCase().includes('nvme');

    // 1. Lógica de Precio y Oferta
    const offertFeature = getFeatureObj('offert');
    const hasOffer = offertFeature && offertFeature.enabled;
    const finalPrice = hasOffer ? parseValue(offertFeature.value, 'price') : parseValue(plan.price, 'price');

    // 2. Valores Numéricos para Filtrado y Score
    const nRam = parseValue(getF('memory'), 'memory');
    const nCpu = parseValue(getF('vcpu'), 'vcpu');
    const nStorage = parseValue(getF('storage'), 'storage');
    const nTransfer = parseValue(getF('transfer'), 'transfer');

    const isMB = String(getF('memory')).toLowerCase().includes('mb');
    const ramInGb = isMB ? nRam / 1024 : nRam;

    // 3. Cálculo de Score (Ranking)
    const storageBonus = isNVMe ? 1.2 : 1;
    const nTransferForScore = nTransfer === 999999 ? 10000 : nTransfer;
    const score = finalPrice > 0
        ? (((ramInGb * 3) + (nCpu * 2) + (nStorage * 0.1 * storageBonus) + (nTransferForScore * 0.005)) / finalPrice)
        : 0;
    
    const normalizedScore = Math.min(score * 10, 1000);
    return parseFloat(normalizedScore.toFixed(1));
};
