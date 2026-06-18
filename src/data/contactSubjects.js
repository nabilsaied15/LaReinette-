/** Motifs / sujets du formulaire de contact */
export const CONTACT_MOTIF_TARIFS = 'transport-tarifs';

export const CONTACT_SUBJECT_OPTIONS = [
  { value: CONTACT_MOTIF_TARIFS, label: 'Transport / Tarifs' },
  { value: 'reservation', label: 'Réservation transport' },
  { value: 'information', label: 'Information générale' },
  { value: 'inscription', label: 'Inscription au service' },
  { value: 'autre', label: 'Autre' },
];

/** Indications affichées au-dessus du message (lisibles pour les seniors). */
export const CONTACT_MOTIF_GUIDES = {
  [CONTACT_MOTIF_TARIFS]: {
    title: 'Pour une demande de tarif, indiquez exactement :',
    bullets: [
      'Votre nom et prénom',
      'Votre numéro de téléphone',
      'Adresse de départ (n° rue, ville)',
      'Adresse de destination',
      'Date souhaitée du trajet',
      'Aller simple ou aller-retour',
      'Êtes-vous déjà inscrit au service ? (oui / non)',
    ],
  },
  reservation: {
    title: 'Pour une réservation, indiquez exactement :',
    bullets: [
      'Votre nom et prénom',
      'Votre numéro de téléphone',
      'Adresse de départ',
      'Adresse de destination (lieu du rendez-vous)',
      'Date et heure du rendez-vous',
      'Heure souhaitée de prise en charge à domicile',
      'Aller simple ou aller-retour',
      'Motif du déplacement (médecin, courses, etc.)',
    ],
  },
  information: {
    title: 'Pour une demande d\'information, précisez :',
    bullets: [
      'Votre nom et prénom',
      'Votre numéro de téléphone',
      'Le sujet de votre question en une phrase',
      'Le créneau pour vous rappeler (matin / après-midi)',
    ],
  },
  inscription: {
    title: 'Pour l\'inscription au service, indiquez :',
    bullets: [
      'Votre nom et prénom',
      'Votre date de naissance',
      'Votre adresse complète et code postal',
      'Votre téléphone mobile',
      'Votre adresse e-mail',
      'Souhaitez-vous une inscription pour une 2e personne ? (oui / non)',
    ],
  },
  autre: {
    title: 'Pour votre demande, indiquez :',
    bullets: [
      'Votre nom et prénom',
      'Votre numéro de téléphone',
      'L\'objet de votre message en une phrase',
      'Les détails utiles pour vous répondre',
    ],
  },
};

export function getContactMotifGuide(motif) {
  return CONTACT_MOTIF_GUIDES[motif] || null;
}

function bulletLines(bullets) {
  return bullets.map((b) => `• ${b} :`).join('\n');
}

/**
 * Modèle de message prérempli selon le motif (puces à compléter).
 */
export function buildContactMessageTemplate(motif, { zone = '' } = {}) {
  if (!motif || motif === 'autre') {
    return '';
  }

  const guide = getContactMotifGuide(motif);
  if (!guide) {
    return '';
  }

  let intro = 'Bonjour,\n\nMerci de compléter les points ci-dessous (une ligne par point) :\n\n';
  let bullets = [...guide.bullets];

  if (motif === CONTACT_MOTIF_TARIFS && zone) {
    bullets = bullets.map((b) =>
      b.startsWith('Adresse de destination') ? `Destination concernée : ${zone}` : b
    );
  }

  const closing =
    motif === 'inscription'
      ? '\n\nJe souhaite finaliser mon inscription. Merci de me recontacter.\n'
      : '\n\nMerci de me recontacter rapidement.\n';

  return `${intro}${bulletLines(bullets)}${closing}`;
}

export function getContactSubjectLabel(motif, customLabel = '') {
  if (motif === 'autre') {
    return customLabel.trim() || 'Autre';
  }
  return CONTACT_SUBJECT_OPTIONS.find((o) => o.value === motif)?.label || customLabel.trim() || '';
}

/** @deprecated Utiliser buildContactMessageTemplate */
export const CONTACT_TARIF_REQUEST_MESSAGE = buildContactMessageTemplate(CONTACT_MOTIF_TARIFS);
