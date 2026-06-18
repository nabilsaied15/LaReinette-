import { describe, it, expect } from 'vitest';
import { calculateTransportPrice } from '../../src/utils/transportPricing.js';

describe('transportPricing', () => {
  it('retourne 0 sans adresses', () => {
    expect(calculateTransportPrice({ departure: '', destination: '' })).toBe(0);
  });

  it('applique le tarif Bourg-la-Reine aller simple', () => {
    expect(
      calculateTransportPrice({
        departure: '3 allée Joffre, Bourg-la-Reine',
        destination: '92340 Bourg-la-Reine',
        tripType: 'Aller Simple',
      })
    ).toBe(5);
  });

  it('applique le tarif Bourg-la-Reine aller-retour', () => {
    expect(
      calculateTransportPrice({
        departure: 'Bourg-la-Reine',
        destination: '92340 BLR',
        tripType: 'Aller-Retour',
      })
    ).toBe(10);
  });

  it('applique le tarif hôpital / Clamart', () => {
    expect(
      calculateTransportPrice({
        departure: 'Bourg-la-Reine',
        destination: 'Hôpital Béclère, Clamart',
        tripType: 'Aller Simple',
      })
    ).toBe(10);
  });

  it('applique le tarif communes voisines', () => {
    expect(
      calculateTransportPrice({
        departure: 'Sceaux',
        destination: 'Fontenay-aux-Roses',
        tripType: 'Aller-Retour',
      })
    ).toBe(16);
  });
});
