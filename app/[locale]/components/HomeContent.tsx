'use client';

import { useState } from 'react';
import PriceCard from './PriceCard';
import DockerModal from './DockerModal';

interface HomeContentProps {
    cards: {
        plan: any;
        name: string;
        affiliateLink: string;
        isBestValue: boolean;
        lastUpdate: string;
        provider: string;
        verdict: string;
    }[];
    loadingTexts: string[];
}

export default function HomeContent({ cards, loadingTexts }: HomeContentProps) {
    const [selectedPlanForDocker, setSelectedPlanForDocker] = useState<any>(null);

    return (
        <>
            {/* Añadimos padding lateral para que el glow no se corte en los bordes de la pantalla */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
                {cards.map((card, index) =>
                    card.plan ? (
                        <div key={index} className="glow-card"> {/* Quitamos rounded-2xl de aquí, ya lo tiene PriceCard */}
                            <PriceCard
                                plan={card.plan}
                                name={card.name}
                                affiliateLink={card.affiliateLink}
                                isBestValue={card.isBestValue}
                                lastUpdate={card.lastUpdate}
                                provider={card.provider}
                                verdict={card.verdict}
                                setSelectedPlanForDocker={setSelectedPlanForDocker}
                            />
                        </div>
                    ) : (
                        <div key={index} className="p-6 border-2 border-dashed border-white/5 rounded-2xl flex items-center text-slate-400 text-sm italic glass">
                            {loadingTexts[index]}
                        </div>
                    )
                )}
            </div>

            {selectedPlanForDocker && (
                <DockerModal
                    plan={selectedPlanForDocker}
                    isOpen={!!selectedPlanForDocker}
                    onClose={() => setSelectedPlanForDocker(null)}
                />
            )}
        </>
    );
}
