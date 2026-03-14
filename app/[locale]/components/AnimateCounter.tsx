'use client';

import { useEffect, useState } from 'react';

export default function AnimatedCounter({ value, duration = 2000 }: { value: string | number, duration?: number }) {
    const [count, setCount] = useState(0);
    const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
    const suffix = typeof value === 'string' ? value.replace(/[0-9]/g, '') : '';

    useEffect(() => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            setCount(Math.floor(progress * numericValue));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [numericValue, duration]);

    return (
        <span>
            {count}{suffix}
        </span>
    );
}