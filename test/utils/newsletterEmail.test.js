import { describe, it, expect, vi, beforeEach } from 'vitest';
import emailjs from '@emailjs/browser';
import {
  buildNewsletterEmailParams,
  getNewsletterEmailConfig,
  sendNewsletterEmail,
} from '../../src/utils/newsletterEmail.js';

vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn() },
}));

describe('newsletterEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('construit les paramètres destinataire', () => {
    const params = buildNewsletterEmailParams({
      toEmail: 'user@example.fr',
      subject: 'Bienvenue',
      message: 'Bonjour\nLa Reinette',
      siteName: 'La Reinette',
    });

    expect(params.to_email).toBe('user@example.fr');
    expect(params.subject).toBe('Bienvenue');
    expect(params.title).toBe('Bienvenue');
    expect(params.email_subject).toBe('Bienvenue');
    expect(params.message_html).toContain('La Reinette');
    expect(params.message_html).toContain('<br>');
  });

  it('priorise la config newsletter racine', () => {
    const config = getNewsletterEmailConfig({
      emailjs: {
        newsletter: { serviceId: 's', templateId: 't', publicKey: 'k' },
        clientConfirmation: { serviceId: 'c', templateId: 'ct', publicKey: 'ck' },
      },
    });
    expect(config.serviceId).toBe('s');
  });

  it('utilise clientConfirmation en repli', () => {
    const config = getNewsletterEmailConfig({
      emailjs: {
        clientConfirmation: { serviceId: 'c', templateId: 't', publicKey: 'k' },
      },
    });
    expect(config?.serviceId).toBe('c');
  });

  it('retourne null sans config complète', () => {
    expect(getNewsletterEmailConfig({ emailjs: {} })).toBeNull();
  });

  it('envoie via EmailJS avec la config newsletter', async () => {
    emailjs.send.mockResolvedValueOnce({ status: 200 });

    await sendNewsletterEmail(
      {
        emailjs: { newsletter: { serviceId: 's', templateId: 't', publicKey: 'k' } },
        contact: { email: 'contact@asad.fr' },
      },
      { toEmail: 'user@example.fr', subject: 'Bienvenue', message: 'Bonjour' }
    );

    expect(emailjs.send).toHaveBeenCalledWith(
      's',
      't',
      expect.objectContaining({ to_email: 'user@example.fr' }),
      'k'
    );
  });

  it('échoue sans configuration EmailJS', async () => {
    await expect(
      sendNewsletterEmail({ emailjs: {} }, { toEmail: 'a@b.fr', subject: 'S', message: 'M' })
    ).rejects.toThrow(/Configuration EmailJS newsletter manquante/);
  });
});
