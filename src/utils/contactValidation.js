/** Validation du formulaire de contact */
export function validateContactForm(formData) {
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = 'Veuillez renseigner votre nom';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = "Format d'email invalide";
  }

  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  if (!formData.phone || !phoneRegex.test(formData.phone)) {
    errors.phone = 'Numéro de téléphone invalide (ex: 06 12 34 56 78)';
  }

  if (!formData.subjectMotif) {
    errors.subjectMotif = 'Veuillez choisir un motif';
  } else if (formData.subjectMotif === 'autre' && !formData.subjectOther?.trim()) {
    errors.subjectOther = 'Veuillez préciser votre demande';
  }

  if (!formData.message?.trim()) {
    errors.message = 'Votre message ne peut pas être vide';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/** Honeypot + délai minimum anti-spam */
export function isContactSpam({ website = '', formStartTime, now = Date.now(), minMs = 3000 }) {
  return website !== '' || now - formStartTime < minMs;
}
