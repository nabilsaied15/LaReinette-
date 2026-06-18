import { describe, it, expect } from 'vitest';
import { validateContactForm, isContactSpam } from '../../src/utils/contactValidation.js';

describe('contactValidation', () => {
  const validForm = {
    name: 'Marie Martin',
    email: 'marie@example.fr',
    phone: '06 12 34 56 78',
    subjectMotif: 'information',
    subjectOther: '',
    message: 'Bonjour, une question.',
  };

  it('accepte un formulaire valide', () => {
    const { valid, errors } = validateContactForm(validForm);
    expect(valid).toBe(true);
    expect(errors).toEqual({});
  });

  it('rejette un formulaire incomplet', () => {
    const { valid, errors } = validateContactForm({
      name: '',
      email: 'bad',
      phone: '123',
      subjectMotif: '',
      message: '',
    });
    expect(valid).toBe(false);
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.phone).toBeTruthy();
    expect(errors.subjectMotif).toBeTruthy();
    expect(errors.message).toBeTruthy();
  });

  it('exige subjectOther pour le motif autre', () => {
    const { valid, errors } = validateContactForm({
      ...validForm,
      subjectMotif: 'autre',
      subjectOther: '   ',
    });
    expect(valid).toBe(false);
    expect(errors.subjectOther).toContain('préciser');
  });

  it('détecte le spam honeypot', () => {
    expect(isContactSpam({ website: 'bot', formStartTime: 0, now: 10000 })).toBe(true);
  });

  it('détecte un envoi trop rapide', () => {
    expect(isContactSpam({ website: '', formStartTime: 9000, now: 10000 })).toBe(true);
  });

  it('autorise un envoi après le délai minimum', () => {
    expect(isContactSpam({ website: '', formStartTime: 0, now: 5000 })).toBe(false);
  });
});
