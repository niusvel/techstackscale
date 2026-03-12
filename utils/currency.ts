export const formatPrice = (price: number | string, currency?: string): string => {
    const numPrice = Number(price || 0);
    const formattedPrice = numPrice.toFixed(2);
    
    if (currency === 'USD') {
        return `$${formattedPrice}`;
    }
    
    // Default to EUR
    return `${formattedPrice}€`;
};
