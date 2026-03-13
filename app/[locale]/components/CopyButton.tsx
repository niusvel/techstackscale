'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CopyButton({ text }: { text: string }) {
    const t = useTranslations('CopyButton');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 bg-slate-800/50 hover:bg-cyan hover:text-slate-950 text-slate-400 px-2 py-1 rounded text-[10px] font-bold transition-all border border-slate-700 uppercase"
        >
            {copied ? t('copied') : t('copy')}
        </button>
    );
}