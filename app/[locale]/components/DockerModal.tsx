'use client';

import { useState } from 'react';
import { generateDockerCompose } from '@/utils/docker-generator';
import { useTranslations } from 'next-intl';

interface DockerModalProps {
    plan: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function DockerModal({ plan, isOpen, onClose }: DockerModalProps) {
    const t = useTranslations('DockerModal');
    const [tech, setTech] = useState('nodejs');
    const [copied, setCopied] = useState(false);
    const kindList = ['nodejs', 'wordpress', 'python', 'laravel', 'go'];
    if (!isOpen) return null;

    const code = generateDockerCompose(plan, tech);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `docker-compose-${plan.providerId || 'server'}.yml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">{t('title')}</h2>
                        <p className="text-xs text-slate-400 mt-1">{t('subtitle', { providerName: plan.providerName, planName: plan.name })}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-2xl">&times;</button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        {kindList.map((kind) => (
                            <button
                                key={kind}
                                onClick={() => setTech(kind)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tech === kind ? 'bg-cyan text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                {kind.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan overflow-x-auto max-h-[300px]">
                            <code>{code}</code>
                        </pre>
                        <button onClick={handleDownload}
                            className="absolute top-3 right-5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md text-[10px] font-bold border border-slate-700 transition-all">
                            {t('download_yaml')}
                        </button>
                        <button
                            onClick={handleCopy}
                            className="absolute top-3 right-31 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-md text-[10px] font-bold border border-slate-700 transition-all"
                        >
                            {copied ? t('copied') : t('copy_yaml')}
                        </button>
                    </div>
                    <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-[10px] text-blue-400">
                        <strong>Tip:</strong> {t('tip')}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-950/50 text-center">
                    <p className="text-[10px] text-slate-500 italic">
                        {t('stability_warning', { ram: plan.ramInGb })}
                    </p>
                </div>
            </div>
        </div>
    );
}