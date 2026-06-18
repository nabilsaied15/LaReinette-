import { describe, it, expect, vi, beforeEach } from 'vitest';
import emailjs from '@emailjs/browser';
import {
  getRegistrationEmailConfigs,
  buildRegistrationEmailParams,
  sendRegistrationNotification,
} from '../../src/utils/registrationEmail.js';

vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn() },
}));

const sampleRegistration = {
  beneficiary1Title: 'M.',
  beneficiary1FirstName: 'Jean',
  beneficiary1LastName: 'Dupont',
  beneficiary1BirthDate: '1950-01-15',
  socialSecurityNumber: '1 50 01 75 123 456',
  addressLine1: '12 rue de la Paix',
  addressLine2: '',
  postalCode: '92340',
  mobilePhone: '06 12 34 56 78',
  email: 'jean.dupont@example.fr',
  mobilityType: 'Fauteuil roulant',
  aidWalker: true,
  emergency1FirstName: 'Marie',
  emergency1LastName: 'Dupont',
  emergency1Relation: 'Épouse',
  emergency1Phone: '06 98 76 54 32',
  hasLegalRepresentative: false,
  engagementTransportRules: true,
  attestAccuracy: true,
};

const sampleSettings = {
  contact: { formRecipientEmail: 'admin@asad.fr', email: 'contact@asad.fr' },
  emailjs: {
    registration: { serviceId: 's1', templateId: 't1', publicKey: 'k1' },
    reservation: { serviceId: 's2', templateId: 't2', publicKey: 'k2' },
  },
};

describe('registrationEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('filtre les configs EmailJS incomplètes', () => {
    const configs = getRegistrationEmailConfigs({
      emailjs: {
        registration: { serviceId: 'ok', templateId: 'ok', publicKey: 'ok' },
        reservation: { serviceId: '', templateId: 't', publicKey: 'k' },
      },
    });
    expect(configs).toHaveLength(1);
    expect(configs[0].key).toBe('registration');
  });

  it('construit les paramètres email avec destinataire et aides', () => {
    const params = buildRegistrationEmailParams(sampleRegistration, sampleSettings);

    expect(params.to_email).toBe('admin@asad.fr');
    expect(params.from_email).toBe('jean.dupont@example.fr');
    expect(params.subject).toContain('[INSCRIPTION]');
    expect(params.subject).toContain('Dupont');
    expect(params.aides).toContain('Déambulateur');
    expect(params.message).toContain('Nom: Dupont');
    expect(params.message_html).toContain('Nouvelle inscription La Reinette');
    expect(params.protection_juridique).toBe('NON');
  });

  it('envoie via EmailJS quand la config est valide', async () => {
    emailjs.send.mockResolvedValueOnce({ status: 200 });

    const result = await sendRegistrationNotification(sampleRegistration, sampleSettings);

    expect(result.ok).toBe(true);
    expect(result.method).toBe('emailjs:registration');
    expect(emailjs.send).toHaveBeenCalledWith('s1', 't1', expect.objectContaining({ to_email: 'admin@asad.fr' }), 'k1');
  });

  it('bascule sur FormSubmit si EmailJS échoue', async () => {
    emailjs.send.mockRejectedValue(new Error('EmailJS down'));
    global.fetch.mockResolvedValueOnce({ ok: true, status: 200 });

    const result = await sendRegistrationNotification(sampleRegistration, sampleSettings);

    expect(result.ok).toBe(true);
    expect(result.method).toBe('formsubmit');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('formsubmit.co'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('retourne une erreur si aucune méthode ne fonctionne', async () => {
    emailjs.send.mockRejectedValue(new Error('fail'));
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const result = await sendRegistrationNotification(sampleRegistration, {
      ...sampleSettings,
      emailjs: {},
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
