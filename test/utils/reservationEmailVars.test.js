import { describe, it, expect } from 'vitest';
import {
  buildReservationScheduleVars,
  buildReservationScheduleVarsFromForm,
  buildReservationScheduleVarsFromReservation,
  EMAILJS_RESERVATION_SCHEDULE_HINT,
} from '../../src/utils/reservationEmailVars.js';

describe('reservationEmailVars', () => {
  it('formate les heures pour un aller simple', () => {
    const vars = buildReservationScheduleVars({
      appointmentTime: '10:30',
      pickupTime: '10:00',
      returnTime: '12:00',
      tripType: 'Aller simple',
    });

    expect(vars.heure).toBe('10:30');
    expect(vars.heure_prise_en_charge).toBe('10:00');
    expect(vars.heure_recuperation).toBe('N/A');
    expect(vars.return_time).toBe('N/A');
  });

  it('inclut l’heure de récupération pour un aller-retour', () => {
    const vars = buildReservationScheduleVars({
      appointmentTime: '14:00',
      pickupTime: '13:30',
      returnTime: '16:00',
      tripType: 'Aller-Retour',
    });

    expect(vars.heure_recuperation).toBe('16:00');
    expect(vars.return_time).toBe('16:00');
  });

  it('utilise des tirets cadratin si les heures sont absentes', () => {
    const vars = buildReservationScheduleVars({ tripType: 'Aller simple' });
    expect(vars.heure).toBe('—');
    expect(vars.heure_prise_en_charge).toBe('—');
  });

  it('dérive les variables depuis formData', () => {
    const vars = buildReservationScheduleVarsFromForm({
      time: '09:00',
      pickupTime: '08:45',
      returnPickupTime: '11:00',
      tripType: 'Aller-Retour',
    });
    expect(vars.heure_rdv).toBe('09:00');
    expect(vars.heure_recuperation).toBe('11:00');
  });

  it('expose le hint EmailJS pour les admins', () => {
    expect(EMAILJS_RESERVATION_SCHEDULE_HINT).toContain('{{heure}}');
    expect(EMAILJS_RESERVATION_SCHEDULE_HINT).toContain('{{heure_recuperation}}');
  });

  it('dérive les variables depuis une réservation Supabase', () => {
    const vars = buildReservationScheduleVarsFromReservation({
      appointment_time: '15:00',
      pickup_time: '14:30',
      return_time: '17:00',
      trip_type: 'Aller-Retour',
    });
    expect(vars.pickup_time).toBe('14:30');
    expect(vars.heure_recuperation).toBe('17:00');
  });
});
