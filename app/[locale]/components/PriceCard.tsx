import fs from 'fs';
import path from 'path';
import { getTranslations } from 'next-intl/server';

export default async function PriceCard() {
    // Leemos el JSON que generó tu scraper
    const filePath = path.join(process.cwd(), 'data', 'providers.json');
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const hostinger = jsonData.providers.find((p: any) => p.id === 'hostinger');
    const t = await getTranslations('PriceCard');

    return (
        <div className="h-full max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white border border-slate-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">{hostinger.name}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">{t('best_value')}</span>
            </div>
            <p className="text-slate-500 text-sm mb-6">{t('tagline')}</p>
            <div className="mb-6">
                <span className="text-4xl font-black text-blue-600">{hostinger.base_price}€</span>
                <span className="text-slate-400 text-sm">{t('per_month')}</span>
            </div>
            <a
                href={hostinger.affiliate_link}
                target="_blank"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
            >
                {t('get_offer')}
            </a>
            <p className="text-[10px] text-slate-400 mt-4 text-center">
                {t('last_update')} {jsonData.last_update}
            </p>
        </div>
    );
}