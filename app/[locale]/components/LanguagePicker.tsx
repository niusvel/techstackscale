'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const languages = [
    { code: 'es', flagUrl: 'https://flagcdn.com/es.svg', label: 'Español' },
    { code: 'en', flagUrl: 'https://flagcdn.com/us.svg', label: 'English' },
    { code: 'fr', flagUrl: 'https://flagcdn.com/fr.svg', label: 'Français' },
];

export default function LanguagePicker() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (newLocale: string) => {
        if (newLocale === locale) return;
        const segments = pathname.split('/');
        segments[1] = newLocale;
        const newPath = segments.join('/');
        setIsOpen(false);
        router.push(newPath);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Image
                src={currentLanguage.flagUrl}
                alt={currentLanguage.label}
                width={28}
                height={20}
                className="w-7 h-5 object-cover rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            />

            {isOpen && (
                <div className="absolute right-0 mt-3 w-16 bg-white/80 backdrop-blur-lg border border-white shadow-2xl rounded-2xl p-1.5 flex flex-col gap-1.5 z-[100] animate-in fade-in zoom-in-95 duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors overflow-hidden
                ${locale === lang.code
                                    ? 'bg-blue-600/10 ring-1 ring-blue-600/20'
                                    : 'hover:bg-slate-100'
                                }`}
                            title={lang.label}
                        >
                            <Image
                                src={lang.flagUrl}
                                alt={lang.label}
                                width={28}
                                height={20}
                                className={`w-7 h-5 object-cover rounded-sm shadow-sm transition-opacity
                                    ${locale === lang.code ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}