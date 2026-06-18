/** Liste officielle des pièces justificatives (inscription transport 60 ans et +). */
export const REGISTRATION_DOCUMENTS_TITLE =
  "Conditions d'accès au service et pièces justificatives à fournir";

export const REGISTRATION_DOCUMENTS_AGE_GROUP =
  "Pour les personnes de 60 ans et plus";

export const REGISTRATION_DOCUMENTS_REQUIRED = [
  "Copie du justificatif de domicile de moins de 3 mois",
  "Copie de la carte d'identité",
  "Copie de la carte vitale",
  "Copie d'un justificatif retraite ou ASPA (minimum vieillesse) ou pension d'invalidité",
];

export const REGISTRATION_DOCUMENTS_AGE_60_69_INTRO =
  "Un des justificatifs suivants pour les personnes de 60 à 69 ans";

export const REGISTRATION_DOCUMENTS_AGE_60_69 = [
  "Copie de la notification APA",
  "Copie de la notification PCH",
  'Copie de la CMI « Priorité » ou de la CMI « invalidité »',
  "Certificat médical mentionnant une incapacité temporaire ou permanente à se déplacer en autonomie",
];

export function getRegistrationDocumentsPdfLines() {
  return [
    ...REGISTRATION_DOCUMENTS_REQUIRED.map((d) => `- ${d}`),
    "",
    `+ ${REGISTRATION_DOCUMENTS_AGE_60_69_INTRO} :`,
    ...REGISTRATION_DOCUMENTS_AGE_60_69.map((d) => `- ${d}`),
  ];
}
