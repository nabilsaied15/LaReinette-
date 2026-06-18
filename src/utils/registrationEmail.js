import emailjs from '@emailjs/browser';

function isCompleteConfig(config) {
  return Boolean(config?.serviceId?.trim() && config?.templateId?.trim() && config?.publicKey?.trim());
}

/** Configs EmailJS à essayer pour les inscriptions (ordre de priorité). */
export function getRegistrationEmailConfigs(settings) {
  const root = settings?.emailjs || {};
  const ordered = [
    { key: 'registration', config: root.registration },
    { key: 'reservation', config: root.reservation },
  ];
  return ordered.filter(({ config }) => isCompleteConfig(config));
}

export function buildRegistrationEmailParams(registrationData, settings) {
  const contact = settings?.contact || {};
  const recipient = contact.formRecipientEmail || contact.email || '';
  const fullName = `${registrationData.beneficiary1FirstName || ''} ${registrationData.beneficiary1LastName || ''}`.trim();

  const aides = [
    registrationData.aidWalker && 'Déambulateur',
    registrationData.aidTransferChair && 'Fauteuil de transfert',
    registrationData.aidTripodCane && 'Canne tripode',
    registrationData.aidQuadripodCane && 'Canne quadripode',
    registrationData.aidSimpleCane && 'Canne simple',
    registrationData.aidCrutch && 'Béquille',
  ]
    .filter(Boolean)
    .join(', ') || 'Aucune';

  const rows = [
    ['Nom', registrationData.beneficiary1LastName],
    ['Prénom', registrationData.beneficiary1FirstName],
    ['Naissance', registrationData.beneficiary1BirthDate],
    ['N° Sécu', registrationData.socialSecurityNumber || 'Non renseigné'],
    ['Adresse', registrationData.addressLine1],
    ['Complément', registrationData.addressLine2 || '-'],
    ['Code postal', registrationData.postalCode],
    ['Mobile', registrationData.mobilePhone],
    ['Email', registrationData.email],
    ['Mobilité', registrationData.mobilityType],
    ['Aides', aides],
    ['Urgence 1', `${registrationData.emergency1FirstName || ''} ${registrationData.emergency1LastName || ''} (${registrationData.emergency1Relation || ''}) - ${registrationData.emergency1Phone || ''}`],
    ['Urgence 2', registrationData.emergency2LastName
      ? `${registrationData.emergency2FirstName} ${registrationData.emergency2LastName} (${registrationData.emergency2Relation}) - ${registrationData.emergency2Phone}`
      : 'Aucun'],
    ['Protection juridique', registrationData.hasLegalRepresentative ? 'OUI' : 'NON'],
    ['Notes', registrationData.additionalNotes || 'Aucune'],
  ];

  const messageText = rows.map(([k, v]) => `${k}: ${v || '-'}`).join('\n');

  const messageHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 640px;">
      <h2 style="color:#064e3b;margin:0 0 16px;">Nouvelle inscription La Reinette</h2>
      <table style="width:100%;border-collapse:collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;color:#064e3b;vertical-align:top;">${label}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;">${String(value || '-').replace(/</g, '&lt;')}</td>
          </tr>`
          )
          .join('')}
      </table>
    </div>
  `;

  const subject = `[INSCRIPTION] ${registrationData.beneficiary1LastName || ''} ${registrationData.beneficiary1FirstName || ''}`.trim();

  return {
    to_email: recipient,
    to_name: 'ASAD Bourg-la-Reine',
    from_name: fullName || 'Inscription site',
    from_email: registrationData.email,
    reply_to: registrationData.email,
    user_email: registrationData.email,
    subject,
    user_subject: subject,
    message: messageText,
    message_html: messageHtml,
    civilite: registrationData.beneficiary1Title,
    nom: registrationData.beneficiary1LastName,
    prenom: registrationData.beneficiary1FirstName,
    name: fullName,
    naissance: registrationData.beneficiary1BirthDate,
    secu: registrationData.socialSecurityNumber || 'Non renseigné',
    adresse: registrationData.addressLine1,
    complement: registrationData.addressLine2 || '-',
    cp: registrationData.postalCode,
    etage: registrationData.floor || '-',
    portable: registrationData.mobilePhone || '-',
    fixe: registrationData.homePhone || '-',
    email: registrationData.email,
    mobilite: registrationData.mobilityType,
    aides,
    urgence1: `${registrationData.emergency1FirstName || ''} ${registrationData.emergency1LastName || ''} (${registrationData.emergency1Relation || ''}) - ${registrationData.emergency1Phone || ''}`,
    urgence2: registrationData.emergency2LastName
      ? `${registrationData.emergency2FirstName} ${registrationData.emergency2LastName} (${registrationData.emergency2Relation}) - ${registrationData.emergency2Phone}`
      : 'Aucun',
    protection_juridique: registrationData.hasLegalRepresentative ? 'OUI' : 'NON',
    rep_legal: registrationData.hasLegalRepresentative
      ? `${registrationData.legalRepFirstName} ${registrationData.legalRepLastName} (Tel: ${registrationData.legalRepPhone}, Email: ${registrationData.legalRepEmail})`
      : '-',
    beneficiaire2: registrationData.beneficiary2LastName
      ? `${registrationData.beneficiary2Title} ${registrationData.beneficiary2FirstName} ${registrationData.beneficiary2LastName} (Né le ${registrationData.beneficiary2BirthDate})`
      : 'Aucun',
    engagements: `Règles acceptées: ${registrationData.engagementTransportRules ? 'OUI' : 'NON'} | Exactitude attestée: ${registrationData.attestAccuracy ? 'OUI' : 'NON'}`,
    time: new Date().toLocaleString('fr-FR'),
    notes: registrationData.additionalNotes || 'Aucune',
    note_admin: 'Nouvelle inscription complète via le site',
  };
}

async function sendViaFormSubmit(registrationData, settings, params) {
  const recipient = settings?.contact?.formRecipientEmail || settings?.contact?.email;
  if (!recipient) {
    throw new Error('Aucune adresse destinataire configurée');
  }

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: params.subject,
      _template: 'table',
      _captcha: 'false',
      ...Object.fromEntries(
        Object.entries(params).filter(([k]) => !k.endsWith('_html') && k !== 'message_html')
      ),
      message: params.message,
    }),
  });

  if (!res.ok) {
    throw new Error(`FormSubmit (${res.status})`);
  }
  return { method: 'formsubmit' };
}

/**
 * Tente EmailJS (inscription puis réservation), puis FormSubmit.
 * @returns {{ ok: boolean, method?: string, error?: string }}
 */
export async function sendRegistrationNotification(registrationData, settings) {
  const params = buildRegistrationEmailParams(registrationData, settings);
  const configs = getRegistrationEmailConfigs(settings);
  const errors = [];

  if (!params.to_email?.trim()) {
    errors.push('emailjs: destinataire admin manquant (Contact → e-mail formulaire)');
  }

  for (const { key, config } of configs) {
    if (!params.to_email?.trim()) break;
    try {
      await emailjs.send(config.serviceId, config.templateId, params, config.publicKey);
      return { ok: true, method: `emailjs:${key}` };
    } catch (err) {
      const msg = err?.text || err?.message || String(err);
      console.warn(`EmailJS inscription (${key}) échoué:`, msg);
      errors.push(`${key}: ${msg}`);
    }
  }

  try {
    const result = await sendViaFormSubmit(registrationData, settings, params);
    return { ok: true, ...result };
  } catch (err) {
    console.warn('FormSubmit inscription échoué:', err);
    errors.push(`formsubmit: ${err?.message || err}`);
  }

  return {
    ok: false,
    error: errors.join(' | ') || 'Aucune méthode d\'envoi configurée',
  };
}
