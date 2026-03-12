export const parseValue = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val !== 'string') return 0;
    const match = val.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
};

export const getCurrency = (val: any): string => {
    if (typeof val !== 'string') return 'EUR'; // Valor por defecto
    return val.includes('€') ? 'EUR' : 'USD';
};
