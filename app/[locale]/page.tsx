import fs from 'fs';
import path from 'path';
import { getTranslations } from 'next-intl/server';
import PageHeader from './components/PageHeader';
import ValueProposition from './components/ValueProposition';
import HomeContent from './components/HomeContent';

function getAllProvidersData() {
  const dataDirectory = path.join(process.cwd(), 'data');

  const filenames = fs.readdirSync(dataDirectory);
  const providerFiles = filenames.filter(f => f.endsWith('.json') && !f.includes('_summary'));

  return providerFiles.map(filename => {
    const filePath = path.join(dataDirectory, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return {
      id: filename.replace('.json', ''),
      ...JSON.parse(fileContent)
    };
  });
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('HomePage');

  const allProviders = getAllProvidersData();

  const cards = allProviders.map(provider => {
    const bestPlan = provider.plans?.find((p: any) => p.is_best_seller) || provider.plans?.[0];

    return {
      plan: bestPlan,
      name: bestPlan ? `${provider.provider} ${bestPlan.name}` : provider.provider,
      affiliateLink: provider.affiliate_link || "#",
      isBestValue: true,
      lastUpdate: provider.last_update || '',
      provider: provider.provider,
      verdict: provider.verdicts?.[locale] || '',
      navigateEnd: provider.id,
    };
  });

  const loadingTexts = allProviders.map(p =>
    t('loading_provider', { provider: p.provider })
  );

  return (
    <div className="min-h-screen bg-metallic pb-16 overflow-hidden">
      <PageHeader />

      <section className="mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 !bg-none ![-webkit-text-fill-color:initial]">
                {t('section_infra_title')}
              </h2>
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