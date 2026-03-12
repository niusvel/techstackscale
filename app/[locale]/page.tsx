import fs from 'fs';
import path from 'path';

import { getTranslations } from 'next-intl/server';

import PriceCard from './components/PriceCard';
import PageHeader from './components/PageHeader';
import ValueProposition from './components/ValueProposition';

function getLocalData(fileName: string) {
  const filePath = path.join(process.cwd(), 'data', fileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: ${fileName} not found at ${filePath}`);
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error parsing ${fileName}:`, error);
    return null;
  }
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('HomePage');

  const hostingerData = getLocalData('hostinger.json');
  const digitalOceanData = getLocalData('digitalocean.json');
  const hetznerData = getLocalData('hetzner.json');

  const hostingerBestPlan = hostingerData?.plans?.find((p: any) => p.is_best_seller)
    || hostingerData?.plans?.[1];

  const doBestPlan = digitalOceanData?.plans?.[0];
  const hetznerBestPlan = hetznerData?.plans?.[0];

  return (
    <div className="min-h-screen bg-metallic">
      <PageHeader />

      {/* Main Content Area */}
      <section className="pb-20 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 !bg-none ![-webkit-text-fill-color:initial]">{t('section_infra_title')}</h2>
              <p className="text-slate-600 font-medium">{t('section_infra_description')}</p>
            </div>
            <div className="hidden md:block h-px flex-1 bg-slate-200 mx-8"></div>
            <span className="text-sm font-bold text-cyan bg-cyan/10 px-4 py-2 rounded-full border border-cyan/20">
              {t('live_data')}
            </span>
          </div>

          {/* ToolsGrid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hostingerBestPlan ? (
              <PriceCard
                name={`Hostinger ${hostingerBestPlan.name}`}
                price={hostingerBestPlan.price}
                features={hostingerBestPlan.features}
                affiliateLink={hostingerData.affiliate_link || "#"}
                isBestValue={true}
                lastUpdate={hostingerData.last_update}
                currency={hostingerBestPlan.currency}
                provider={hostingerData.provider}
                verdict={hostingerData.verdicts[locale]}
              />
            ) : (
              <div className="p-6 border-2 border-dashed border-white/5 rounded-2xl flex items-center text-slate-400 text-sm italic glass">
                {t('loading_provider', { provider: 'Hostinger' })}
              </div>
            )}

            {doBestPlan ? (
              <PriceCard
                name={doBestPlan.name}
                price={doBestPlan.price}
                features={doBestPlan.features}
                affiliateLink={digitalOceanData.affiliate_link || "#"}
                isBestValue={true}
                lastUpdate={digitalOceanData.last_update}
                currency={doBestPlan.currency}
                provider={digitalOceanData.provider}
                verdict={digitalOceanData.verdicts[locale]}
              />
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex items-center text-slate-500 text-sm italic bg-white/50">
                {t('loading_provider', { provider: 'DigitalOcean' })}
              </div>
            )}

            {hetznerBestPlan ? (
              <PriceCard
                name={`Hetzner ${hetznerBestPlan.name}`}
                price={hetznerBestPlan.price}
                features={hetznerBestPlan.features}
                affiliateLink={hetznerData.affiliate_link || "#"}
                isBestValue={true}
                lastUpdate={hetznerData.last_update}
                currency={hetznerBestPlan.currency}
                provider={hetznerData.provider}
                verdict={hetznerData.verdicts[locale]}
              />
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex items-center text-slate-500 text-sm italic bg-white/50">
                {t('loading_provider', { provider: 'Hetzner' })}
              </div>
            )}
          </div>
        </div>
      </section>

      <ValueProposition />
    </div>
  );
}