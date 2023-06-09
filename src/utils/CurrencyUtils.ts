export const formatCurrency = (s: string | number | undefined) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    return s ? formatter.format(+s) : '';
};

export const launderMoney = (s: string): number => {
    return +s.trim()
        .replace(",", "")
        .replace(" ", "")
        .replace("$", "");
};