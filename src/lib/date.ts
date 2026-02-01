export const toDateString = (d: Date) => d.toLocaleDateString('sv-SE');

export const getToday = () => toDateString(new Date());
