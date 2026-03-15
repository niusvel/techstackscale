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
      <div className="bg-slate-950 rounded-b-[0.5rem] mb-10 shadow-2xl border-b border-white/5">
        <header className="max-w-7xl mx-auto px-4 pt-10 pb-10">
          <Link
            href="/"
            className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <span className="mr-2">←</span> {t('back_to_comparison')}
          </Link>
          <div className="text-center w-full">
            <h1 className="text-4xl font-extrabold mb-6 tracking-tight text-white italic">
              {t('title')}
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              {t('description')}
            </p>
          </div>
        </header>
      </div>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <CompareClient providers={providers} />
        </div>
      </section>
    </div>
  );
}