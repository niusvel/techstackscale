// components/ComparisonGrid.tsx
import hostingerData from '@/data/hostinger.json';
import doData from '@/data/digitalocean.json';
import hetznerData from '@/data/hetzner.json';
import PriceCard from './PriceCard';

const ComparisonGrid = () => {
    const providers = [
        { data: hostingerData, color: 'indigo', tag: 'Más fácil' },
        { data: doData, color: 'blue', tag: 'Estándar' },
        { data: hetznerData, color: 'slate', tag: 'Mejor Precio' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-12">
                Compara los mejores planes Cloud
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {providers.map((p, idx) => (
                    <div key={idx} className="relative">
                        {/* Etiqueta distintiva por proveedor */}
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-${p.color}-600 z-10 rounded-full px-4 py-1 shadow-lg`}>
                            <span className="text-white text-sm font-semibold">
                                {p.tag}
                            </span>
                        </div>

                        <PriceCard
                            name={`${p.data.provider} ${p.data.plans[0].name}`}
                            price={p.data.plans[0].price}
                            features={p.data.plans[0].features}
                            affiliateLink="#"
                            isBestValue={idx === 0}
                            lastUpdate={p.data.last_update}
                            color={p.color}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComparisonGrid;