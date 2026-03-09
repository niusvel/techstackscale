import { getTranslations } from 'next-intl/server';
import PriceCard from './components/PriceCard';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('HomePage');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          {t('title')}
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          {t('description')}
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            {t('cta_explore')}
          </button>
          <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
            {t('cta_compare')}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{t('section_infra_title')}</h2>
            <p className="text-slate-500">{t('section_infra_description')}</p>
          </div>
          <div className="hidden md:block h-px flex-1 bg-slate-200 mx-8"></div>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
            {t('live_data')}
          </span>
        </div>

        {/* ToolsGrid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PriceCard />

          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-12 h-12 bg-slate-100 rounded-full mb-4 flex items-center justify-center text-xl">☁️</div>
            <h3 className="font-bold text-slate-900">{t('do_title')}</h3>
            <p className="text-sm text-slate-500">{t('do_desc')}</p>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-12 h-12 bg-slate-100 rounded-full mb-4 flex items-center justify-center text-xl">🗄️</div>
            <h3 className="font-bold text-slate-900">{t('db_title')}</h3>
            <p className="text-sm text-slate-500">{t('db_desc')}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div>
            <div className="font-black text-2xl mb-4 italic">TechStackScale.</div>
            <p className="text-slate-400 text-sm">
              {t('footer_tagline')}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('footer_methodology_title')}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('footer_methodology_desc')}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t('footer_transparency_title')}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('footer_transparency_desc')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}