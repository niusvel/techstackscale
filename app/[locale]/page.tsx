import fs from 'fs';
import path from 'path';

import { getTranslations } from 'next-intl/server';

import PageHeader from './components/PageHeader';
import ValueProposition from './components/ValueProposition';
import HomeContent from './components/HomeContent';

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

  const cards = [
    {
      plan: hostingerBestPlan,
      name: hostingerBestPlan ? `Hostinger ${hostingerBestPlan.name}` : '',
      affiliateLink: hostingerData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: hostingerData?.last_update || '',
      provider: hostingerData?.provider || 'Hostinger',
      verdict: hostingerData?.verdicts?.[locale] || '',
    },
    {
      plan: doBestPlan,
      name: doBestPlan?.name || '',
      affiliateLink: digitalOceanData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: digitalOceanData?.last_update || '',
      provider: digitalOceanData?.provider || 'DigitalOcean',
      verdict: digitalOceanData?.verdicts?.[locale] || '',
    },
    {
      plan: hetznerBestPlan,
      name: hetznerBestPlan ? `Hetzner ${hetznerBestPlan.name}` : '',
      affiliateLink: hetznerData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: hetznerData?.last_update || '',
      provider: hetznerData?.provider || 'Hetzner',
      verdict: hetznerData?.verdicts?.[locale] || '',
    },
  ];

  const loadingTexts = [
    t('loading_provider', { provider: 'Hostinger' }),
    t('loading_provider', { provider: 'DigitalOcean' }),
    t('loading_provider', { provider: 'Hetzner' }),
  ];

  return (
    <div className="min-h-screen bg-metallic pb-16 overflow-hidden">
      <PageHeader />

      {/* Main Content Area */}
      <section className="mt-10">
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

          <HomeContent cards={cards} loadingTexts={loadingTexts} />
        </div>
      </section>

      <ValueProposition />
    </div>
  );
}