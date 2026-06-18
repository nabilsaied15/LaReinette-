export function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export function validatePhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  return digits.length === 10;
}

export function validateSocialSecurity(ssn) {
  const digits = String(ssn).replace(/\D/g, '');
  return digits.length === 15;
}

/** Service La Reinette : 08h00–18h59 (heure entière) */
export function isOutOfHours(time) {
  if (!time) return false;
  const [h] = time.split(':').map(Number);
  return h < 8 || h >= 19;
}

export function isWeekendDate(dateStr) {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
}

export function areAddressesIdentical(departure, destination) {
  return departure.trim().toLowerCase() === destination.trim().toLowerCase();
}

export function validateTripSchedule({ time, pickupTime, returnPickupTime, tripType }) {
  if (isOutOfHours(time) || isOutOfHours(pickupTime)) {
    return { valid: false, message: 'Horaire hors plage 08h00–19h00' };
  }
  if (tripType === 'Aller-Retour' && isOutOfHours(returnPickupTime)) {
    return { valid: false, message: 'Horaire retour hors plage 08h00–19h00' };
  }
  if (pickupTime && time && pickupTime >= time) {
    return {
      valid: false,
      message: "L'heure de prise en charge doit être avant l'heure du rendez-vous",
    };
  }
  if (tripType === 'Aller-Retour' && returnPickupTime && time && returnPickupTime <= time) {
    return { valid: false, message: "L'heure de retour doit être après l'heure du rendez-vous" };
  }
  return { valid: true };
}

export function validateRegistrationSubStep(subStep, registrationData) {
  if (subStep === 0) {
    if (!registrationData.beneficiary1LastName || !registrationData.beneficiary1FirstName) {
      return { valid: false, message: 'Veuillez remplir le nom et le prénom du bénéficiaire.' };
    }
    const ssn = String(registrationData.socialSecurityNumber || '').replace(/\D/g, '');
    if (ssn && ssn.length > 15) {
      return { valid: false, message: 'Le numéro de Sécurité Sociale ne peut pas dépasser 15 chiffres.' };
    }
  }

  if (subStep === 1) {
    const addr = String(registrationData.addressLine1 || '').trim();
    const mobile = String(registrationData.mobilePhone || '').replace(/\D/g, '');
    const home = String(registrationData.homePhone || '').replace(/\D/g, '');
    const mail = String(registrationData.email || '').trim();

    if (!addr) return { valid: false, message: 'Veuillez renseigner votre adresse.' };
    if (!mobile && !home) {
      return { valid: false, message: 'Veuillez renseigner au moins un numéro de téléphone (fixe ou portable).' };
    }
    if (!mail) return { valid: false, message: 'Veuillez renseigner votre e-mail.' };
    if (mobile && mobile.length < 10) {
      return { valid: false, message: 'Le numéro de portable doit comporter 10 chiffres.' };
    }
    if (home && home.length < 10) {
      return { valid: false, message: 'Le numéro de téléphone fixe doit comporter 10 chiffres.' };
    }
    if (mail && !mail.includes('@')) {
      return { valid: false, message: 'Veuillez entrer un e-mail valide.' };
    }
  }

  if (subStep === 5) {
    if (!registrationData.engagementTransportRules || !registrationData.attestAccuracy) {
      return { valid: false, message: "Veuillez accepter les engagements avant l'envoi." };
    }
  }

  return { valid: true };
}

/** Calcule l'heure de retour selon la durée du rendez-vous */
export function computeReturnPickupTime(startTime, duration) {
  if (!startTime || !duration) return '';
  const [h, m] = startTime.split(':').map(Number);
  let addMin = 0;
  if (duration === '30 min') addMin = 30;
  else if (duration === '1h') addMin = 60;
  else if (duration === '1h30') addMin = 90;
  else if (duration === '2h') addMin = 120;
  if (addMin <= 0) return '';
  const total = h * 60 + m + addMin;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}
