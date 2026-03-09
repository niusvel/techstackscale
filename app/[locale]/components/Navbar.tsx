import Link from 'next/link';
import LanguagePicker from './LanguagePicker';
import { getTranslations } from 'next-intl/server';

export default async function Navbar() {
    const t = await getTranslations('Navbar');
    return (
        <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-black text-xl italic text-slate-900 tracking-tighter">
                    TechStackScale<span className="text-blue-600">.</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                        <Link href="#" className="hover:text-blue-600 transition-colors">{t('calculators')}</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">{t('compare')}</Link>
                    </div>
                    <LanguagePicker />
                </div>
            </div>
        </nav>
    );
}