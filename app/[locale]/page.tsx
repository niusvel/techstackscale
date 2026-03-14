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
  const vultrData = getLocalData('vultr.json');
  const linodeData = getLocalData('linode.json');
  const ovhcloudData = getLocalData('ovhcloud.json');
  const cloudwaysData = getLocalData('cloudways.json');
  const scalewayData = getLocalData('scaleway.json');
  const kamateraData = getLocalData('kamatera.json');
  const awsData = getLocalData('aws.json');
  const googleCloudData = getLocalData('googlecloud.json');
  const azureData = getLocalData('azure.json');
  const oracleData = getLocalData('oracle.json');
  const dreamhostData = getLocalData('dreamhost.json');
  const namecheapData = getLocalData('namecheap.json');


  const hostingerBestPlan = hostingerData?.plans?.find((p: any) => p.is_best_seller)
    || hostingerData?.plans?.[1];
  const doBestPlan = digitalOceanData?.plans?.[0];
  const hetznerBestPlan = hetznerData?.plans?.[0];
  const vultrBestPlan = vultrData?.plans?.find((p: any) => p.is_best_seller) || vultrData?.plans?.[0];
  const linodeBestPlan = linodeData?.plans?.find((p: any) => p.is_best_seller) || linodeData?.plans?.[0];
  const ovhcloudBestPlan = ovhcloudData?.plans?.find((p: any) => p.is_best_seller) || ovhcloudData?.plans?.[0];
  const cloudwaysBestPlan = cloudwaysData?.plans?.find((p: any) => p.is_best_seller) || cloudwaysData?.plans?.[0];
  const scalewayBestPlan = scalewayData?.plans?.find((p: any) => p.is_best_seller) || scalewayData?.plans?.[0];
  const kamateraBestPlan = kamateraData?.plans?.find((p: any) => p.is_best_seller) || kamateraData?.plans?.[0];
  const awsBestPlan = awsData?.plans?.find((p: any) => p.is_best_seller) || awsData?.plans?.[0];
  const googleCloudBestPlan = googleCloudData?.plans?.find((p: any) => p.is_best_seller) || googleCloudData?.plans?.[0];
  const azureBestPlan = azureData?.plans?.find((p: any) => p.is_best_seller) || azureData?.plans?.[0];
  const oracleBestPlan = oracleData?.plans?.find((p: any) => p.is_best_seller) || oracleData?.plans?.[0];
  const dreamhostBestPlan = dreamhostData?.plans?.find((p: any) => p.is_best_seller) || dreamhostData?.plans?.[0];
  const namecheapBestPlan = namecheapData?.plans?.find((p: any) => p.is_best_seller) || namecheapData?.plans?.[0];

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
    {
      plan: vultrBestPlan,
      name: vultrBestPlan ? `Vultr ${vultrBestPlan.name}` : '',
      affiliateLink: vultrData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: vultrData?.last_update || '',
      provider: vultrData?.provider || 'Vultr',
      verdict: vultrData?.verdicts?.[locale] || '',
    },
    {
      plan: linodeBestPlan,
      name: linodeBestPlan ? `Linode ${linodeBestPlan.name}` : '',
      affiliateLink: linodeData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: linodeData?.last_update || '',
      provider: linodeData?.provider || 'Linode',
      verdict: linodeData?.verdicts?.[locale] || '',
    },
    {
      plan: ovhcloudBestPlan,
      name: ovhcloudBestPlan ? `OVHcloud ${ovhcloudBestPlan.name}` : '',
      affiliateLink: ovhcloudData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: ovhcloudData?.last_update || '',
      provider: ovhcloudData?.provider || 'OVHcloud',
      verdict: ovhcloudData?.verdicts?.[locale] || '',
    },
    {
      plan: cloudwaysBestPlan,
      name: cloudwaysBestPlan ? `Cloudways ${cloudwaysBestPlan.name}` : '',
      affiliateLink: cloudwaysData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: cloudwaysData?.last_update || '',
      provider: cloudwaysData?.provider || 'Cloudways',
      verdict: cloudwaysData?.verdicts?.[locale] || '',
    },
    {
      plan: scalewayBestPlan,
      name: scalewayBestPlan ? `Scaleway ${scalewayBestPlan.name}` : '',
      affiliateLink: scalewayData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: scalewayData?.last_update || '',
      provider: scalewayData?.provider || 'Scaleway',
      verdict: scalewayData?.verdicts?.[locale] || '',
    },
    {
      plan: kamateraBestPlan,
      name: kamateraBestPlan ? `Kamatera ${kamateraBestPlan.name}` : '',
      affiliateLink: kamateraData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: kamateraData?.last_update || '',
      provider: kamateraData?.provider || 'Kamatera',
      verdict: kamateraData?.verdicts?.[locale] || '',
    },
    {
      plan: awsBestPlan,
      name: awsBestPlan ? `AWS ${awsBestPlan.name}` : '',
      affiliateLink: awsData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: awsData?.last_update || '',
      provider: awsData?.provider || 'AWS',
      verdict: awsData?.verdicts?.[locale] || '',
    },
    {
      plan: googleCloudBestPlan,
      name: googleCloudBestPlan ? `Google Cloud ${googleCloudBestPlan.name}` : '',
      affiliateLink: googleCloudData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: googleCloudData?.last_update || '',
      provider: googleCloudData?.provider || 'Google Cloud',
      verdict: googleCloudData?.verdicts?.[locale] || '',
    },
    {
      plan: azureBestPlan,
      name: azureBestPlan ? `Azure ${azureBestPlan.name}` : '',
      affiliateLink: azureData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: azureData?.last_update || '',
      provider: azureData?.provider || 'Azure',
      verdict: azureData?.verdicts?.[locale] || '',
    },
    {
      plan: oracleBestPlan,
      name: oracleBestPlan ? `Oracle ${oracleBestPlan.name}` : '',
      affiliateLink: oracleData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: oracleData?.last_update || '',
      provider: oracleData?.provider || 'Oracle',
      verdict: oracleData?.verdicts?.[locale] || '',
    },
    {
      plan: dreamhostBestPlan,
      name: dreamhostBestPlan ? `DreamHost ${dreamhostBestPlan.name}` : '',
      affiliateLink: dreamhostData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: dreamhostData?.last_update || '',
      provider: dreamhostData?.provider || 'DreamHost',
      verdict: dreamhostData?.verdicts?.[locale] || '',
    },
    {
      plan: namecheapBestPlan,
      name: namecheapBestPlan ? `Namecheap ${namecheapBestPlan.name}` : '',
      affiliateLink: namecheapData?.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: namecheapData?.last_update || '',
      provider: namecheapData?.provider || 'Namecheap',
      verdict: namecheapData?.verdicts?.[locale] || '',
    },
  ];

  const loadingTexts = [
    t('loading_provider', { provider: 'Hostinger' }),
    t('loading_provider', { provider: 'DigitalOcean' }),
    t('loading_provider', { provider: 'Hetzner' }),
    t('loading_provider', { provider: 'Vultr' }),
    t('loading_provider', { provider: 'Linode' }),
    t('loading_provider', { provider: 'OVHcloud' }),
    t('loading_provider', { provider: 'Cloudways' }),
    t('loading_provider', { provider: 'Scaleway' }),
    t('loading_provider', { provider: 'Kamatera' }),
    t('loading_provider', { provider: 'AWS' }),
    t('loading_provider', { provider: 'Google Cloud' }),
    t('loading_provider', { provider: 'Azure' }),
    t('loading_provider', { provider: 'Oracle' }),
    t('loading_provider', { provider: 'DreamHost' }),
    t('loading_provider', { provider: 'Namecheap' }),
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