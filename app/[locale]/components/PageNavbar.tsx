import Link from 'next/link';
import LanguagePicker from './LanguagePicker';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function PageNavbar() {
    const locale = await getLocale();
    const t = await getTranslations('Navbar');
    return (
        <nav className="glass sticky top-0 z-50 border-b-0">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-black text-xl italic tracking-tighter flex items-center">
                    <img src="/logo.png" alt="Logo" className="w-10 h-10" />
                    <div><span className="text-white">TechStack</span><span className="text-[#13b5ca]">Scale.</span></div>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
                        <Link href={`/${locale}/calculator`} className="hover:text-cyan transition-colors">{t('calculator')}</Link>
                        <Link href={`/${locale}/compare`} className="hover:text-cyan transition-colors">{t('compare')}</Link>
                    </div>
                    <LanguagePicker />
                </div>
            </div>
        </nav>
    );
}