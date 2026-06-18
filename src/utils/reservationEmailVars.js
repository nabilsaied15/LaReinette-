/**
 * Variables horaires pour les templates EmailJS (réservation).
 * À placer dans le template EmailJS sous « Heure RDV : {{heure}} » :
 *   Heure de prise en charge : {{heure_prise_en_charge}}
 *   Heure de récupération : {{heure_recuperation}}
 */
export function buildReservationScheduleVars({
  appointmentTime,
  pickupTime,
  returnTime,
  tripType,
}) {
  const isRoundTrip = tripType === 'Aller-Retour';
  const na = 'N/A';

  return {
    heure: appointmentTime || '—',
    heure_rdv: appointmentTime || '—',
    heure_prise_en_charge: pickupTime || '—',
    heure_recuperation: isRoundTrip ? (returnTime || '—') : na,
    pickup_time: pickupTime || '',
    return_time: isRoundTrip ? (returnTime || '') : na,
  };
}

export function buildReservationScheduleVarsFromForm(formData) {
  return buildReservationScheduleVars({
    appointmentTime: formData?.time,
    pickupTime: formData?.pickupTime,
    returnTime: formData?.returnPickupTime,
    tripType: formData?.tripType,
  });
}

export function buildReservationScheduleVarsFromReservation(reservation) {
  return buildReservationScheduleVars({
    appointmentTime: reservation?.appointment_time,
    pickupTime: reservation?.pickup_time,
    returnTime: reservation?.return_time,
    tripType: reservation?.trip_type,
  });
}

export const EMAILJS_RESERVATION_SCHEDULE_HINT = `⏰ Heure RDV : {{heure}}
🕒 Heure de prise en charge : {{heure_prise_en_charge}}
🔄 Heure de récupération : {{heure_recuperation}}`;
