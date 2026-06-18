import { describe, it, expect } from 'vitest';
import {
  REGISTRATION_DOCUMENTS_REQUIRED,
  REGISTRATION_DOCUMENTS_AGE_60_69,
  getRegistrationDocumentsPdfLines,
} from '../../src/data/registrationRequiredDocuments.js';

describe('registrationRequiredDocuments', () => {
  it('liste les pièces obligatoires', () => {
    expect(REGISTRATION_DOCUMENTS_REQUIRED.length).toBeGreaterThanOrEqual(4);
    expect(REGISTRATION_DOCUMENTS_REQUIRED[0]).toMatch(/domicile/i);
  });

  it('liste les pièces complémentaires 60-69 ans', () => {
    expect(REGISTRATION_DOCUMENTS_AGE_60_69).toContain('Copie de la notification APA');
  });

  it('génère les lignes PDF avec séparateur et sous-titre', () => {
    const lines = getRegistrationDocumentsPdfLines();
    expect(lines[0]).toMatch(/^- Copie du justificatif/);
    expect(lines).toContain('');
    expect(lines.some((l) => l.includes('60 à 69 ans'))).toBe(true);
    expect(lines.filter((l) => l.startsWith('- ')).length).toBe(
      REGISTRATION_DOCUMENTS_REQUIRED.length + REGISTRATION_DOCUMENTS_AGE_60_69.length
    );
  });
});
