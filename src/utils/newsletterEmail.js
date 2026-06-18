import emailjs from '@emailjs/browser';

/**
 * Paramètres EmailJS pour envoyer un mail À l'adresse de l'inscrit (pas à l'admin).
 * Le template EmailJS doit avoir le champ destinataire = {{to_email}} ou {{user_email}}.
 */
export function buildNewsletterEmailParams({
  toEmail,
  subject,
  message,
  siteName = 'La Reinette',
  replyTo = 'lareinette@asad-bourg-la-reine.fr',
}) {
  // Corps seul (sans en-tête ni cadre) — le design est dans docs/emailjs-newsletter-template.html
  const safeMessage = String(message || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const htmlBody = `<p style="margin:0;font-size:16px;line-height:1.65;color:#1f2937;">${safeMessage.replace(/\n/g, '<br>')}</p>`;

  const subjectLine = String(subject || '').trim() || 'Message de La Reinette';

  return {
    to_email: toEmail,
    user_email: toEmail,
    email: toEmail,
    reply_to: replyTo,
    from_name: `${siteName} - ASAD Bourg-la-Reine`,
    nom: siteName,
    // Objet : dans EmailJS → Settings → Subject = {{subject}} (pas "Contact us" en dur)
    subject: subjectLine,
    user_subject: subjectLine,
    title: subjectLine,
    email_subject: subjectLine,
    message,
    message_html: htmlBody,
  };
}

export function getNewsletterEmailConfig(settings) {
  const root = settings?.emailjs || {};
  const nested = settings?.emailTemplates?.emailjs || {};

  const newsletter = root.newsletter?.serviceId ? root.newsletter : nested.newsletter;
  if (newsletter?.serviceId && newsletter?.templateId && newsletter?.publicKey) {
    return newsletter;
  }

  const client = root.clientConfirmation?.serviceId ? root.clientConfirmation : nested.clientConfirmation;
  if (client?.serviceId && client?.templateId && client?.publicKey) {
    return client;
  }

  return null;
}

export async function sendNewsletterEmail(settings, { toEmail, subject, message }) {
  const config = getNewsletterEmailConfig(settings);
  if (!config) {
    throw new Error('Configuration EmailJS newsletter manquante');
  }

  const siteName = settings?.general?.siteName?.includes('Reinette')
    ? 'La Reinette'
    : (settings?.general?.siteName || 'La Reinette');

  const params = buildNewsletterEmailParams({
    toEmail,
    subject,
    message,
    siteName: 'La Reinette',
    replyTo: settings?.contact?.email || settings?.contact?.formRecipientEmail || 'lareinette@asad-bourg-la-reine.fr',
  });

  return emailjs.send(config.serviceId, config.templateId, params, config.publicKey);
}
