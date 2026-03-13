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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cards.map((card, index) =>
                    card.plan ? (
                        <PriceCard
                            key={index}
                            plan={card.plan}
                            name={card.name}
                            affiliateLink={card.affiliateLink}
                            isBestValue={card.isBestValue}
                            lastUpdate={card.lastUpdate}
                            provider={card.provider}
                            verdict={card.verdict}
                            setSelectedPlanForDocker={setSelectedPlanForDocker}
                        />
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
