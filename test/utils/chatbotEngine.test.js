import { describe, it, expect } from 'vitest';
import {
  normalizeChatQuery,
  scoreFaqMatch,
  searchFaqAnswer,
  resolveChatbotResponse,
  buildSiteKnowledge,
  CHATBOT_DISCLAIMER,
  isGeminiConfigured,
} from '../../src/utils/chatbotEngine.js';

const mockSettings = {
  laReinette: {
    phone: '01 79 71 75 42',
    pricing: [
      { zone: 'Locale', location: 'BLR', aller: '5€', ar: '10€', callOnly: false },
    ],
    eligibility: [{ title: 'Âge', desc: '70 ans et plus' }],
  },
  contact: {
    address: '3-5 allée Test',
    city: '92340 Bourg-la-Reine',
    email: 'contact@asad.fr',
  },
  faq: {
    questions: [
      {
        q: 'Comment puis-je réserver un trajet ?',
        a: 'Réservez par téléphone au 01 79 71 75 42 au moins 48h à l\'avance.',
      },
      {
        q: 'Quels sont les tarifs des trajets ?',
        a: '5€ aller à Bourg-la-Reine, 8€ limitrophe, 10€ hôpitaux.',
      },
    ],
  },
  emergencyNumbers: [{ label: 'SAMU', number: '15' }],
};

describe('chatbotEngine', () => {
  it('normalise les requêtes', () => {
    expect(normalizeChatQuery('Réservation')).toBe('reservation');
  });

  it('score une question FAQ pertinente', () => {
    const score = scoreFaqMatch('je veux réserver un trajet', mockSettings.faq.questions[0]);
    expect(score).toBeGreaterThan(4);
  });

  it('trouve une réponse FAQ sur la réservation', () => {
    const hit = searchFaqAnswer('comment réserver un trajet', mockSettings);
    expect(hit?.text).toMatch(/48h/i);
    expect(hit?.confidence).toBeGreaterThan(0.15);
  });

  it('répond aux tarifs avec lien FAQ', () => {
    const res = resolveChatbotResponse('quel est le prix', mockSettings);
    expect(res.text).toMatch(/forfait|5€/i);
    expect(res.confidence).toBeGreaterThan(0.7);
  });

  it('répond au bonjour avec suggestions', () => {
    const res = resolveChatbotResponse('bonjour', mockSettings);
    expect(res.text).toMatch(/Bonjour/i);
    expect(res.text).toMatch(/automatique/i);
    expect(res.suggestions?.length).toBeGreaterThan(0);
  });

  it('expose le disclaimer de transparence', () => {
    expect(CHATBOT_DISCLAIMER).toMatch(/pas un conseiller humain/i);
  });

  it('indique si Gemini est configuré', () => {
    expect(typeof isGeminiConfigured()).toBe('boolean');
  });

  it('répond aux urgences avec le 15', () => {
    const res = resolveChatbotResponse('urgence samu', mockSettings);
    expect(res.text).toMatch(/15/);
  });

  it('construit un contexte site pour Gemini', () => {
    const ctx = buildSiteKnowledge(mockSettings);
    expect(ctx).toMatch(/La Reinette/i);
    expect(ctx).toMatch(/01 79 71 75 42/);
    expect(ctx).toMatch(/48h/i);
  });
});
