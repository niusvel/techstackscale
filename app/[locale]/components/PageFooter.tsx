import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function PageFooter() {
    const tf = await getTranslations('Footer');

    return (
        <footer className="bg-background border-t border-white/10 pb-10 rounded-t-[0.5rem] backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4">
                {/* Enlaces Legales y Copyright al principio */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 border-b border-white/5 py-6 mb-5">
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

                <div className="grid md:grid-cols-3 gap-12 mb-5 mt-5">
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

                {/* SECCIÓN: Cumplimiento legal y Afiliación */}
                <div className="border-t border-white/5 pt-5 text-center">
                    <p className="text-xs text-slate-500 max-w-3xl mx-auto leading-relaxed italic px-4">
                        {tf('affiliate_disclosure')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
