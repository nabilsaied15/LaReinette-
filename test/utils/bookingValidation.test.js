import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePhone,
  validateSocialSecurity,
  isOutOfHours,
  isWeekendDate,
  areAddressesIdentical,
  validateTripSchedule,
  validateRegistrationSubStep,
  computeReturnPickupTime,
} from '../../src/utils/bookingValidation.js';

describe('bookingValidation', () => {
  it('valide les emails', () => {
    expect(validateEmail('user@example.fr')).toBeTruthy();
    expect(validateEmail('invalid')).toBeFalsy();
  });

  it('valide les téléphones à 10 chiffres', () => {
    expect(validatePhone('06 12 34 56 78')).toBe(true);
    expect(validatePhone('061234567')).toBe(false);
  });

  it('valide le numéro de sécurité sociale (15 chiffres)', () => {
    expect(validateSocialSecurity('1 50 01 75 123 456 78')).toBe(true);
    expect(validateSocialSecurity('123')).toBe(false);
  });

  it('détecte les horaires hors plage 08h–19h', () => {
    expect(isOutOfHours('07:30')).toBe(true);
    expect(isOutOfHours('19:00')).toBe(true);
    expect(isOutOfHours('10:00')).toBe(false);
  });

  it('détecte le week-end', () => {
    expect(isWeekendDate('2026-05-24')).toBe(true); // dimanche
    expect(isWeekendDate('2026-05-25')).toBe(false); // lundi
  });

  it('rejette des adresses identiques', () => {
    expect(areAddressesIdentical('12 rue X', '  12 RUE X  ')).toBe(true);
    expect(areAddressesIdentical('Paris', 'Lyon')).toBe(false);
  });

  it('valide l’ordre des horaires', () => {
    expect(
      validateTripSchedule({
        time: '10:00',
        pickupTime: '09:30',
        returnPickupTime: '11:00',
        tripType: 'Aller-Retour',
      }).valid
    ).toBe(true);

    expect(
      validateTripSchedule({
        time: '10:00',
        pickupTime: '10:30',
        tripType: 'Aller Simple',
      }).valid
    ).toBe(false);
  });

  it('valide les étapes d’inscription', () => {
    expect(
      validateRegistrationSubStep(0, {
        beneficiary1LastName: '',
        beneficiary1FirstName: 'Jean',
      }).valid
    ).toBe(false);

    expect(
      validateRegistrationSubStep(1, {
        addressLine1: '12 rue Test',
        mobilePhone: '0612345678',
        email: 'a@b.fr',
      }).valid
    ).toBe(true);

    expect(
      validateRegistrationSubStep(5, {
        engagementTransportRules: false,
        attestAccuracy: true,
      }).valid
    ).toBe(false);
  });

  it('calcule l’heure de retour selon la durée', () => {
    expect(computeReturnPickupTime('10:00', '1h')).toBe('11:00');
    expect(computeReturnPickupTime('10:00', '1h30')).toBe('11:30');
    expect(computeReturnPickupTime('', '1h')).toBe('');
  });
});
