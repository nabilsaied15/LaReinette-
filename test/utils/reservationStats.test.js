import { describe, it, expect } from 'vitest';
import {
  getDestinationCityName,
  incrementReservationStats,
} from '../../src/utils/reservationStats.js';

describe('reservationStats', () => {
  it('extrait la ville depuis l’adresse', () => {
    expect(getDestinationCityName('Bourg-la-Reine, France')).toBe('Bourg-la-Reine');
    expect(getDestinationCityName('')).toBe('Inconnue');
  });

  it('incrémente les statistiques par destination', () => {
    const stats = {
      totalBookings: 2,
      destinations: { 'Bourg-la-Reine': 1 },
    };
    const next = incrementReservationStats(stats, 'Clamart, France');
    expect(next.totalBookings).toBe(3);
    expect(next.destinations['Bourg-la-Reine']).toBe(1);
    expect(next.destinations.Clamart).toBe(1);
  });
});
