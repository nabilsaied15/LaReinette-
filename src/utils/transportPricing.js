/** Tarifs transport La Reinette (€) selon zones et type de trajet */
export function calculateTransportPrice({ departure = '', destination = '', tripType = 'Aller Simple' }) {
  const dep = departure.toLowerCase().trim();
  const dest = destination.toLowerCase().trim();

  if (!dep && !dest) return 0;

  const isRoundTrip = tripType === 'Aller-Retour';

  if (
    dest.includes('clamart') ||
    dest.includes('béclère') ||
    dest.includes('beclere') ||
    dest.includes('hôpital') ||
    dest.includes('hopital') ||
    dep.includes('clamart') ||
    dep.includes('béclère') ||
    dep.includes('beclere')
  ) {
    return isRoundTrip ? 20 : 10;
  }

  const isDepBLR =
    dep.includes('bourg-la-reine') ||
    dep.includes('bourg la reine') ||
    dep.includes('92340') ||
    dep.includes('blr') ||
    dep.includes('joffre');
  const isDestBLR =
    dest.includes('bourg-la-reine') ||
    dest.includes('bourg la reine') ||
    dest.includes('92340') ||
    dest.includes('blr') ||
    dest.includes('joffre');

  if (isDepBLR && isDestBLR) {
    return isRoundTrip ? 10 : 5;
  }

  return isRoundTrip ? 16 : 8;
}
