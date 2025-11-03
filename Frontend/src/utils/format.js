export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  } catch (e) {
    return '';
  }
};

export const formatRating = (val, digits = 1) => {
  if (typeof val !== 'number' || Number.isNaN(val)) return '0.0';
  return val.toFixed(digits);
};

export const renderStars = (rating) => {
  const r = Math.round(Number(rating) || 0);
  const full = '★'.repeat(Math.min(Math.max(r,0),5));
  const empty = '☆'.repeat(5 - Math.min(Math.max(r,0),5));
  return `${full}${empty}`;
};
