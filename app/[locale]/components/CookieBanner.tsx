"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CookieBanner({ locale }: { locale: string }) {
    const [isVisible, setIsVisible] = useState(false);
    const t = useTranslations('CookieBanner');

    useEffect(() => {
        const consent = localStorage.getItem('techstackscale-cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('techstackscale-cookie-consent', 'accepted');
        setIsVisible(false);
    };
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800 p-4 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-slate-300 text-sm">
                    <p>
                        {t('message')}{' '}
                        <Link
                            href={`/${locale}/cookies`}
                            className="text-cyan font-semibold hover:underline"
                        >
                            {t('link_text')}
                        </Link>.
                    </p>
                </div>
                <button
                    onClick={handleAccept}
                    className="whitespace-nowrap bg-cyan hover:bg-cyan/80 text-slate-900 font-bold py-2 px-6 rounded-full transition-colors text-sm"
                >
                    {t('accept')}
                </button>
            </div>
        </div>
    );
}