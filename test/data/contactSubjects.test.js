import { describe, it, expect } from 'vitest';
import {
  CONTACT_MOTIF_TARIFS,
  CONTACT_SUBJECT_OPTIONS,
  getContactMotifGuide,
  buildContactMessageTemplate,
  getContactSubjectLabel,
} from '../../src/data/contactSubjects.js';

describe('contactSubjects', () => {
  it('expose tous les motifs attendus', () => {
    const values = CONTACT_SUBJECT_OPTIONS.map((o) => o.value);
    expect(values).toContain(CONTACT_MOTIF_TARIFS);
    expect(values).toContain('reservation');
    expect(values).toContain('inscription');
    expect(values).toHaveLength(5);
  });

  it('retourne un guide pour chaque motif connu', () => {
    CONTACT_SUBJECT_OPTIONS.forEach(({ value }) => {
      const guide = getContactMotifGuide(value);
      expect(guide).not.toBeNull();
      expect(guide.bullets.length).toBeGreaterThan(0);
    });
  });

  it('génère un modèle de message pour le motif tarifs', () => {
    const template = buildContactMessageTemplate(CONTACT_MOTIF_TARIFS);
    expect(template).toContain('Bonjour');
    expect(template).toContain('• Votre nom et prénom :');
    expect(template).toContain('Merci de me recontacter');
  });

  it('injecte la zone dans le modèle tarifs', () => {
    const template = buildContactMessageTemplate(CONTACT_MOTIF_TARIFS, { zone: 'Paris' });
    expect(template).toContain('Destination concernée : Paris');
  });

  it('retourne une chaîne vide pour autre ou motif inconnu', () => {
    expect(buildContactMessageTemplate('autre')).toBe('');
    expect(buildContactMessageTemplate('')).toBe('');
    expect(buildContactMessageTemplate('inconnu')).toBe('');
  });

  it('résout le libellé du sujet', () => {
    expect(getContactSubjectLabel('reservation')).toBe('Réservation transport');
    expect(getContactSubjectLabel('autre', '  Demande spéciale  ')).toBe('Demande spéciale');
    expect(getContactSubjectLabel('autre')).toBe('Autre');
  });
});
