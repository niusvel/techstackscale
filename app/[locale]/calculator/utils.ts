export const parseValue = (val: any, field?: string): number => {
    if (typeof val === 'number') return val;
    if (typeof val !== 'string') return 0;

    const lower = val.toLowerCase();

    // Manejo de "Unlimited" (asignamos un valor alto para que pase cualquier filtro)
    if (lower.includes('unlimited')) return 999999;

    // Manejo de "Shared" (penalizamos el valor para el score)
    if (lower.includes('shared')) {
        if (field === 'vcpu') return 0.5; // Una CPU compartida rinde menos que una dedicada
        if (field === 'memory') return 0.5;
    }

    // Manejo de CPUs de alto rendimiento
    if (lower.includes('high clock') || lower.includes('turbo')) {
        const base = parseFloat(lower.match(/(\d+(\.\d+)?)/)?.[0] || '1');
        return base * 1.5; // Bonus de rendimiento
    }

    // Casos especiales de almacenamiento
    if (lower.includes('ebs only') || lower.includes('disk extra')) return 0;

    const match = val.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
};

export const formatDisplayValue = (val: any): string => {
    if (typeof val !== 'string') return String(val);
    const lower = val.toLowerCase();

    // Si contiene palabras clave semánticas, devolvemos el original
    if (lower.includes('unlimited') ||
        lower.includes('shared') ||
        lower.includes('only') ||
        lower.includes('extra') ||
        lower.includes('high clock')) {
        return val;
    }

    return val; // Devolvemos el valor tal cual (ej: "20 GB SSD")
};
