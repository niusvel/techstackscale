import { getTranslations } from 'next-intl/server';
import fs from 'fs';
import path from 'path';
import process from 'process';

import CompareClient from './CompareClient';
import { Link } from '@/i18n/routing';

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

export default async function ComparePage({ params }: Props) {
  const t = await getTranslations('ComparePage');

  const hostingerData = getLocalData('hostinger.json');
  const digitalOceanData = getLocalData('digitalocean.json');
  const hetznerData = getLocalData('hetzner.json');

  const hostingerBestPlan = hostingerData?.plans?.find((p: any) => p.is_best_seller) || hostingerData?.plans?.[1];
  const doBestPlan = digitalOceanData?.plans?.[0];
  const hetznerBestPlan = hetznerData?.plans?.[0];

  const providers = [
    {
      id: 'hostinger',
      name: hostingerData?.provider || 'Hostinger',
      plan: hostingerBestPlan,
      link: hostingerData?.affiliate_link || '#',
      data: hostingerData,
      color: 'bg-indigo-500/30 border-indigo-500 text-white-700',
      btnColor: 'bg-indigo-500/50 hover:bg-indigo-700 text-white',
      hoverColor: 'hover:text-indigo-400',
      textColor: 'text-indigo-400',
    },
    {
      id: 'digitalocean',
      name: digitalOceanData?.provider || 'DigitalOcean',
      plan: doBestPlan,
      link: digitalOceanData?.affiliate_link || '#',
      data: digitalOceanData,
      color: 'bg-blue-500/30 border-blue-500 text-white-700',
      btnColor: 'bg-blue-500/50 hover:bg-blue-700 text-white',
      hoverColor: 'hover:text-blue-400',
      textColor: 'text-blue-400',
    },
    {
      id: 'hetzner',
      name: hetznerData?.provider || 'Hetzner',
      plan: hetznerBestPlan,
      link: hetznerData?.affiliate_link || '#',
      data: hetznerData,
      color: 'bg-red-500/30 border-red-500 text-white-700',
      btnColor: 'bg-red-500/50 hover:bg-red-700 text-white',
      hoverColor: 'hover:text-red-400',
      textColor: 'text-red-400',
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-background rounded-b-[0.5rem] mb-10 shadow-2xl">
        <header className="max-w-7xl mx-auto px-4 pt-10 pb-10 flex">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
            >
              <span className="mr-2">←</span> {t('back_to_comparison')}
            </Link></div>
          <div className="text-center w-full">
            <h1 className="text-4xl font-extrabold mb-6 tracking-tight text-white">
              {t('title')}
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
              {t('description')}
            </p></div>
        </header>
      </div>

      <section className="pb-20 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <CompareClient initialProviders={providers} />
        </div>
      </section>
    </div>
  );
}
