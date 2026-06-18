/** Extrait la ville depuis une adresse complète (avant la première virgule) */
export function getDestinationCityName(destination) {
  return destination.split(',')[0].trim() || 'Inconnue';
}

/** Incrémente les statistiques de réservation */
export function incrementReservationStats(stats, destination) {
  const cityName = getDestinationCityName(destination);
  const newStats = { ...stats };
  newStats.totalBookings = (newStats.totalBookings || 0) + 1;
  newStats.destinations = { ...(newStats.destinations || {}) };
  newStats.destinations[cityName] = (newStats.destinations[cityName] || 0) + 1;
  return newStats;
}
