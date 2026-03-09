import fs from 'fs';
import { getTranslations } from 'next-intl/server';
import path from 'path';
import process from 'process';
import Link from 'next/link';
import PriceCard from './components/PriceCard';

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
  const tf = await getTranslations('Footer');

  const hostingerData = getLocalData('hostinger.json');
  const digitalOceanData = getLocalData('digitalocean.json');

  const hostingerBestPlan = hostingerData?.plans?.find((p: any) => p.is_best_seller)
    || hostingerData?.plans?.[1];

  const doBestPlan = digitalOceanData?.plans?.[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight text-white">
          {t('title')}
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          {t('description')}
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-purple text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple/20 hover:bg-purple/90 transition-all">
            {t('cta_explore')}
          </button>
          <button className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">
            {t('cta_compare')}
          </button>
        </div>
      </header>

      {/* Main Content Area con fondo Metálico */}
      <section className="bg-metallic py-20 mt-10">
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
                affiliateLink="https://www.hostinger.com/techstackscale"
                isBestValue={true}
                lastUpdate={hostingerData.last_update}
              />
            ) : (
              <div className="p-6 border-2 border-dashed border-white/5 rounded-2xl flex items-center text-slate-400 text-sm italic glass">
                Esperando datos de Hostinger...
              </div>
            )}

            {doBestPlan ? (
              <PriceCard
                name={doBestPlan.name}
                price={doBestPlan.price}
                features={doBestPlan.features}
                affiliateLink="https://www.digitalocean.com/techstackscale"
                isBestValue={true}
                lastUpdate={digitalOceanData.last_update}
              />
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex items-center text-slate-500 text-sm italic bg-white/50">
                Esperando datos de DigitalOcean...
              </div>
            )}

            <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center border-white/10 shadow-xl shadow-slate-200/50">
              <div className="w-12 h-12 bg-slate-100 rounded-full mb-4 flex items-center justify-center text-xl shadow-inner">🗄️</div>
              <h3 className="font-bold text-slate-900 !bg-none ![-webkit-text-fill-color:initial]">{t('db_title')}</h3>
              <p className="text-sm text-slate-600 font-medium">{t('db_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-white/10 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Tu estructura actual de 3 columnas */}
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <div className="font-black text-2xl mb-4 italic text-white">
                TechStackScale<span className="text-cyan">.</span>
              </div>
              <p className="text-slate-400 text-sm">
                {tf('tagline')}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white/90">{tf('methodology_title')}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {tf('methodology_desc')}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white/90">{tf('transparency_title')}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {tf('transparency_desc')}
              </p>
            </div>
          </div>

          {/* NUEVA SECCIÓN: Cumplimiento legal y Afiliación */}
          <div className="border-t border-white/5 pt-10">
            <div className="flex flex-col gap-6 text-center">
              {/* Affiliate Disclosure: Muy importante que se lea bien */}
              <p className="text-xs text-slate-500 max-w-3xl mx-auto leading-relaxed italic px-4">
                {tf('affiliate_disclosure')}
              </p>

              {/* Enlaces Legales y Copyright */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 border-t border-white/5 pt-6">
                <p>© {new Date().getFullYear()} TechStackScale. All rights reserved.</p>

                <nav className="flex gap-6">
                  <Link href="/privacy" className="hover:text-cyan transition-colors">
                    {tf('privacy_policy')}
                  </Link>
                  <Link href="/terms" className="hover:text-cyan transition-colors">
                    {tf('terms_of_service')}
                  </Link>
                  <Link href="/cookies" className="hover:text-cyan transition-colors">
                    {tf('cookies')}
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}