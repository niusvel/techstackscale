import { getTranslations } from 'next-intl/server';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { Link } from '@/i18n/routing';
import CompareClient from './CompareClient';

export default async function ComparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('ComparePage');

  const dataDirectory = path.join(process.cwd(), 'data');
  const filenames = fs.readdirSync(dataDirectory);

  const providerFiles = filenames.filter(f => f.endsWith('.json') && !f.includes('_summary'));

  const providers = providerFiles.map(file => {
    try {
      const filePath = path.join(dataDirectory, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);

      return {
        id: file.replace('.json', ''),
        name: data.provider || 'Unknown',
        plans: data.plans || [],
        affiliate_link: data.affiliate_link || '#',
        data: data
      };
    } catch (e) {
      console.error(`Error loading ${file}:`, e);
      return null;
    }
  }).filter(Boolean);

  return (
    <div className="min-h-screen">
      <div className="bg-background rounded-b-[0.5rem] mb-2 shadow-lg">
        <header className="max-w-7xl mx-auto px-4 pt-10 pb-2 flex">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
            >
              <span className="mr-2">←</span> {t('back_to_comparison')}
            </Link>
          </div>
          <div className="text-center w-full">
            <h1 className="text-5xl md:text-4xl font-extrabold mb-6 tracking-tighter text-white">
              {t('title_start')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-blue-500">{t('title_accent')}</span>
            </h1>
            <p className="text-l text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              {t('subtitle', { count: providers.length })}
            </p>
          </div>
        </header>
      </div>

      <main className="bg-metallic min-h-screen bg-slate-950 text-white p-2 md:p-12">
        <div className="max-w-7xl mx-auto px-4">
          <CompareClient providers={providers} />
        </div>
      </main>
    </div>
  );
}