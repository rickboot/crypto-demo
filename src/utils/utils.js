export const formatterFixed2 = new Intl.NumberFormat('en-US', {
    currency: 'USD',
});
  
export const formatterUSD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export const formatterUSDFixed0 = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

