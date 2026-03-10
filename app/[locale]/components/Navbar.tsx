import Link from 'next/link';
import LanguagePicker from './LanguagePicker';
import { getTranslations } from 'next-intl/server';

export default async function PageNavbar() {
    const t = await getTranslations('Navbar');
    return (
        <nav className="glass sticky top-0 z-50 border-b-0">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-black text-xl italic text-white tracking-tighter">
                    TechStackScale<span className="text-cyan">.</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
                        <Link href="#" className="hover:text-cyan transition-colors">{t('calculators')}</Link>
                        <Link href="#" className="hover:text-cyan transition-colors">{t('compare')}</Link>
                    </div>
                    <LanguagePicker />
                </div>
            </div>
        </nav>
    );
}