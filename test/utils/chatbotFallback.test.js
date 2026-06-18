import { describe, it, expect } from 'vitest';
import {
  normalizeChatQuery,
  getChatbotFallbackResponse,
} from '../../src/utils/chatbotFallback.js';

const mockSettings = {
  laReinette: {
    phone: '01 79 71 75 42',
    pricing: [{ zone: 'BLR', location: 'Centre', aller: '5€', ar: '10€', callOnly: false }],
  },
};

describe('chatbotFallback', () => {
  it('normalise les accents et la casse', () => {
    expect(normalizeChatQuery('  TARIF  ')).toBe('tarif');
    expect(normalizeChatQuery('Médecin')).toBe('medecin');
  });

  it('répond aux questions santé', () => {
    const res = getChatbotFallbackResponse('besoin infirmier pansement', mockSettings);
    expect(res.text).toMatch(/SSIAD/i);
    expect(res.text).toMatch(/15/);
  });

  it('répond aux questions tarifs', () => {
    const res = getChatbotFallbackResponse('quel est le prix du transport', mockSettings);
    expect(res.text).toMatch(/forfait|5€/i);
  });

  it('répond aux questions transport', () => {
    const res = getChatbotFallbackResponse('réserver un trajet', mockSettings);
    expect(res.text).toMatch(/réserver|48h/i);
    expect(res.text).toMatch(/01 79 71 75 42/);
  });

  it('répond par défaut si aucune intention', () => {
    const res = getChatbotFallbackResponse('xyz inconnu', mockSettings);
    expect(res.text).toMatch(/FAQ|01 79 71 75 42/i);
  });
});
