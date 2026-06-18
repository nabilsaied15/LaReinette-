/** Mention légale affichée dans le chat */
export const CHATBOT_DISCLAIMER =
  "Assistant automatique — pas un conseiller humain. Pour une demande urgente ou personnalisée, appelez l'ASAD.";

/** Seuil de confiance : au-dessus, on n'appelle pas Gemini */
export const CHATBOT_LOCAL_CONFIDENCE_THRESHOLD = 0.55;

export function isGeminiConfigured() {
  const key =
    typeof import.meta !== "undefined"
      ? import.meta.env?.VITE_GEMINI_API_KEY
      : "";
  return Boolean(key?.trim());
}

export function normalizeChatQuery(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** Suggestions affichées dans le chat */
export const CHATBOT_QUICK_REPLIES = [
  {
    label: "Réserver un trajet",
    message: "Comment réserver un trajet avec La Reinette ?",
  },
  { label: "Tarifs", message: "Quels sont les tarifs des transports ?" },
  {
    label: "S'inscrire",
    message: "Quels documents pour s'inscrire au service ?",
  },
  { label: "Horaires", message: "Quels sont les horaires du service ?" },
  { label: "Contact", message: "Comment vous contacter ?" },
];

const STOP_WORDS = new Set([
  "le",
  "la",
  "les",
  "un",
  "une",
  "des",
  "de",
  "du",
  "et",
  "ou",
  "en",
  "au",
  "aux",
  "je",
  "tu",
  "il",
  "elle",
  "nous",
  "vous",
  "ils",
  "mon",
  "ma",
  "mes",
  "ce",
  "cette",
  "pour",
  "par",
  "sur",
  "avec",
  "sans",
  "est",
  "sont",
  "ai",
  "as",
  "avez",
  "peut",
  "qui",
  "que",
  "quoi",
  "comment",
  "quel",
  "quelle",
  "quels",
  "quelles",
  "puis",
]);

const INTENTS = {
  sante: {
    pattern:
      /\b(malade|docteur|medecin|sante|hopital|clinique|douleur|medicament|ordonnance|soin|infirmier|pansement|piqure|hygiene|urgence|samu)\b/i,
    link: "/ssiad",
    linkText: "Découvrir le SSIAD",
  },
  saad: {
    pattern:
      /\b(menage|repas|courses|aide domicile|saad|entretien|repassage|auxiliaire)\b/i,
    link: "/saad",
    linkText: "Service SAAD",
  },
  reservation: {
    pattern:
      /\b(reserver|reservation|trajet|rdv|rendez-vous|48h|48 heures|annuler|modifier trajet|creneau)\b/i,
    link: "/reservation?mode=reservation",
    linkText: "Réserver en ligne",
  },
  tarifs: {
    pattern:
      /\b(tarif|prix|cout|coute|euro|cheque|payer|paiement|forfait|gratuit)\b/i,
    link: "/faq",
    linkText: "Voir la FAQ tarifs",
  },
  inscription: {
    pattern:
      /\b(inscrire|inscription|dossier|papier|document|justificatif|ccas|adhesion|carte vitale|identite)\b/i,
    link: "/reservation?mode=inscription",
    linkText: "Formulaire d'inscription",
  },
  eligibilite: {
    pattern:
      /\b(eligible|eligibilite|70 ans|60 ans|age|handicap|bourg-la-reine|domicile|resident)\b/i,
    link: "/faq",
    linkText: "Conditions d'éligibilité",
  },
  horaires: {
    pattern:
      /\b(horaire|heure|ouvert|ferme|lundi|vendredi|samedi|dimanche|week-end|ferie|8h|17h)\b/i,
  },
  contact: {
    pattern:
      /\b(contact|telephone|appeler|email|mail|adresse|bureau|joindre|numero)\b/i,
    link: "/contact",
    linkText: "Formulaire de contact",
  },
  urgence: {
    pattern: /\b(urgence|samu|pompier|police|15|18|17|114)\b/i,
  },
  teleassistance: {
    pattern: /\b(teleassistance|alerte|chute|bracelet|pendentif)\b/i,
    link: "/teleassistance",
    linkText: "Téléassistance",
  },
};

function tokenize(text) {
  return normalizeChatQuery(text)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

/** Score de similarité entre la question utilisateur et une entrée FAQ */
export function scoreFaqMatch(userInput, faqItem) {
  const queryTokens = tokenize(userInput);
  if (!queryTokens.length) return 0;

  const questionNorm = normalizeChatQuery(faqItem.q || "");
  const answerNorm = normalizeChatQuery(faqItem.a || "");
  const queryNorm = normalizeChatQuery(userInput);

  let score = 0;

  if (
    questionNorm.includes(queryNorm) ||
    queryNorm.includes(questionNorm.slice(0, 12))
  ) {
    score += 12;
  }

  for (const token of queryTokens) {
    if (questionNorm.includes(token)) score += 3;
    if (answerNorm.includes(token)) score += 1;
  }

  return score;
}

/** Trouve la meilleure réponse dans la FAQ du site */
export function searchFaqAnswer(userInput, settings) {
  const questions = settings?.faq?.questions || [];
  if (!questions.length) return null;

  let best = null;
  let bestScore = 0;

  for (const item of questions) {
    const score = scoreFaqMatch(userInput, item);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (!best || bestScore < 3) return null;

  return {
    text: best.a,
    faqQuestion: best.q,
    confidence: Math.min(bestScore / 15, 1),
    source: "faq",
  };
}

/** Construit le contexte site injecté dans Gemini */
export function buildSiteKnowledge(settings) {
  const contact = settings?.contact || {};
  const lr = settings?.laReinette || {};
  const general = settings?.general || {};

  const pricingText = (lr.pricing || [])
    .map((p) => {
      if (p.callOnly)
        return `- ${p.zone} (${p.location}) : sur devis, appeler ${lr.phone}`;
      return `- ${p.zone} (${p.location}) : aller ${p.aller}, aller-retour ${p.ar}`;
    })
    .join("\n");

  const faqDigest = (settings?.faq?.questions || [])
    .slice(0, 12)
    .map((q) => `Q: ${q.q}\nR: ${q.a}`)
    .join("\n\n");

  const eligibility = (lr.eligibility || [])
    .map((e) => `- ${e.title}: ${e.desc}`)
    .join("\n");

  return `
ORGANISATION : ASAD de Bourg-la-Reine (aide à domicile, soins, transport seniors).
SITE : La Reinette — transport accompagné solidaire.

CONTACT :
- Adresse : ${contact.address || "3-5 allée Françoise Dolto"}, ${contact.city || "92340 Bourg-la-Reine"}
- Téléphone La Reinette / réservations : ${lr.phone || contact.logisticsPhone || "01 79 71 75 42"}
- Téléphone standard ASAD : ${general.mainPhone || "01 79 71 75 42"}
- E-mail : ${contact.email || "lareinette@asad-bourg-la-reine.fr"}

SERVICES :
- SAAD : aide à domicile (ménage, repas, courses, accompagnement)
- SSIAD : soins infirmiers à domicile (sur prescription)
- La Reinette : transport adapté (TPMR), porte-à-porte, lundi–vendredi ~8h30–17h30
- Téléassistance : alerte 24h/24

ÉLIGIBILITÉ La Reinette :
${eligibility || "- Résidence à Bourg-la-Reine, 70+ ans (ou 60+ sous conditions CCAS)"}

TARIFS La Reinette :
${pricingText || "- BLR 5€/10€, limitrophe 8€/16€, hôpitaux 10€/20€"}

RÈGLES IMPORTANTES :
- Réserver au moins 48h à l'avance (téléphone ou site /reservation)
- Paiement par chèque à l'ordre de l'ASAD uniquement
- Pas de service samedi/dimanche
- Urgence vitale : 15 (SAMU)

FAQ (extraits) :
${faqDigest}
`.trim();
}

export function buildGeminiSystemInstruction(settings) {
  return `Tu es l'assistant virtuel officiel de l'ASAD et du service La Reinette à Bourg-la-Reine.

RÈGLES DE RÉPONSE :
- Réponds en français, chaleureux et simple (public seniors et familles).
- 2 à 4 phrases maximum, sauf si la question demande une liste courte.
- Utilise uniquement les informations du CONTEXTE ci-dessous. Si tu ne sais pas, propose d'appeler ${settings?.laReinette?.phone || "01 79 71 75 42"} ou le formulaire /contact.
- Ne invente jamais de tarifs, horaires ou numéros.
- Pour réserver : oriente vers /reservation ou le téléphone.
- Urgence médicale immédiate : rappelle le 15.

CONTEXTE :
${buildSiteKnowledge(settings)}
`;
}

export function formatGeminiHistory(conversationHistory) {
  return conversationHistory
    .filter((m) => m.sender === "user" || m.sender === "bot")
    .slice(-8)
    .map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));
}

/** Détecte une intention et enrichit la réponse avec liens utiles */
export function detectIntent(userInput) {
  const query = normalizeChatQuery(userInput);
  for (const [name, config] of Object.entries(INTENTS)) {
    if (config.pattern.test(query)) {
      return { name, ...config };
    }
  }
  return null;
}

function buildPricingResponse(settings) {
  const lr = settings?.laReinette || {};
  const lines = (lr.pricing || [])
    .map((p) => {
      if (p.callOnly)
        return `• ${p.zone} (${p.location}) : tarif sur demande — appelez le ${lr.phone}`;
      return `• ${p.zone} (${p.location}) : ${p.aller} l'aller, ${p.ar} l'aller-retour`;
    })
    .join("\n");

  return {
    text: `Voici nos forfaits La Reinette :\n\n${lines}\n\nLe paiement se fait par chèque à l'ordre de l'ASAD, remis au chauffeur. Pour Paris ou Orly, contactez-nous au ${lr.phone}.`,
    link: "/faq",
    linkText: "Toutes les questions tarifs",
    confidence: 0.85,
    source: "pricing",
  };
}

function buildContactResponse(settings) {
  const c = settings?.contact || {};
  const lr = settings?.laReinette || {};
  return {
    text: `Pour nous joindre :\n\n📞 Réservations La Reinette : ${lr.phone || c.logisticsPhone}\n📧 E-mail : ${c.email}\n📍 ${c.address}, ${c.city}\n\nBureaux ouverts du lundi au vendredi (8h30–12h / 13h30–17h30). Vous pouvez aussi utiliser le formulaire de contact du site.`,
    link: "/contact",
    linkText: "Envoyer un message",
    confidence: 0.9,
    source: "contact",
  };
}

function buildHorairesResponse(settings) {
  const lr = settings?.laReinette || {};
  return {
    text: `La Reinette fonctionne du lundi au vendredi, environ 8h30 à 17h30. Les trajets se réservent au moins 48h à l'avance au ${lr.phone} ou sur le site.\n\nPas de service le week-end ni les jours fériés.`,
    link: "/reservation?mode=reservation",
    linkText: "Réserver un trajet",
    confidence: 0.88,
    source: "horaires",
  };
}

function buildUrgenceResponse(settings) {
  const nums = settings?.emergencyNumbers || [
    { label: "SAMU", number: "15" },
    { label: "Pompiers", number: "18" },
  ];
  const list = nums.map((n) => `• ${n.label} : ${n.number}`).join("\n");
  return {
    text: `En cas d'urgence vitale, appelez immédiatement :\n\n${list}\n\nPour un rendez-vous médical non urgent, La Reinette peut vous transporter sur réservation (${settings?.laReinette?.phone || "01 79 71 75 42"}).`,
    confidence: 0.95,
    source: "urgence",
  };
}

function buildEligibiliteResponse(settings) {
  const lr = settings?.laReinette || {};
  const lines = (lr.eligibility || [])
    .map((e) => `• ${e.title} : ${e.desc}`)
    .join("\n");
  return {
    text: `Éligibilité La Reinette :\n\n${lines || "• Résidence à Bourg-la-Reine, 70 ans et plus (ou 60+ avec validation CCAS)."}\n\nRenseignements et inscription au ${lr.phone || "01 79 71 75 42"} ou via le CCAS.`,
    link: "/faq",
    linkText: "Voir la FAQ éligibilité",
    confidence: 0.82,
    source: "eligibilite",
  };
}

function buildReservationResponse(settings) {
  const lr = settings?.laReinette || {};
  return {
    text: `Pour réserver :\n\n1. En ligne : formulaire sur le site (parcours guidé)\n2. Par téléphone : ${lr.phone} (lun–ven 8h30–17h30)\n\nPensez à réserver au moins 48h avant votre rendez-vous. Préparez l'adresse de départ, la destination, la date et l'heure.`,
    link: "/reservation?mode=reservation",
    linkText: "Accéder à la réservation",
    confidence: 0.9,
    source: "reservation",
  };
}

/**
 * Moteur local : FAQ + intentions + réponses structurées.
 * @returns {{ text: string, link?: string, linkText?: string, confidence: number, source: string }}
 */
export function resolveChatbotResponse(userInput, settings = {}) {
  const faqHit = searchFaqAnswer(userInput, settings);
  if (faqHit && faqHit.confidence >= 0.45) {
    const intent = detectIntent(userInput);
    return {
      text: faqHit.text,
      link: intent?.link,
      linkText: intent?.linkText,
      confidence: faqHit.confidence,
      source: "faq",
    };
  }

  const intent = detectIntent(userInput);
  if (intent) {
    const builders = {
      tarifs: buildPricingResponse,
      contact: buildContactResponse,
      horaires: buildHorairesResponse,
      urgence: buildUrgenceResponse,
      reservation: buildReservationResponse,
      eligibilite: buildEligibiliteResponse,
      teleassistance: () => ({
        text: "La téléassistance permet une alerte 24h/24 en cas de chute ou de malaise. Plusieurs formules sont proposées par l'ASAD.",
        link: "/teleassistance",
        linkText: "Découvrir la téléassistance",
        confidence: 0.8,
        source: "teleassistance",
      }),
    };
    if (builders[intent.name]) {
      return builders[intent.name](settings);
    }
    if (intent.name === "sante") {
      return {
        text: "Le SSIAD de l'ASAD assure les soins infirmiers à domicile (pansements, injections, suivi) sur prescription médicale. Pour une urgence vitale, composez le 15.",
        link: intent.link,
        linkText: intent.linkText,
        confidence: 0.8,
        source: "intent-sante",
      };
    }
    if (intent.name === "saad") {
      return {
        text: "Le SAAD propose l'aide à domicile : ménage, repas, courses, accompagnement. Contactez l'ASAD pour une évaluation de vos besoins.",
        link: intent.link,
        linkText: intent.linkText,
        confidence: 0.8,
        source: "intent-saad",
      };
    }
    if (intent.name === "inscription") {
      return {
        text: "Pour vous inscrire : pièce d'identité, justificatif de domicile (-3 mois) à Bourg-la-Reine, carte Vitale. Passage au CCAS ou formulaire d'inscription sur le site.",
        link: intent.link,
        linkText: intent.linkText,
        confidence: 0.82,
        source: "intent-inscription",
      };
    }
  }

  if (faqHit) {
    return {
      text: faqHit.text,
      confidence: faqHit.confidence,
      source: "faq-low",
    };
  }

  const query = normalizeChatQuery(userInput);
  if (/\b(bonjour|salut|hello|bonsoir|coucou)\b/.test(query)) {
    return {
      text: `Bonjour ! Je suis l'assistant automatique de l'ASAD et de La Reinette (pas un conseiller humain). Je peux vous renseigner sur les transports, tarifs, inscriptions, horaires ou nos autres services.\n\n${CHATBOT_DISCLAIMER}`,
      confidence: 0.75,
      source: "greeting",
      suggestions: CHATBOT_QUICK_REPLIES,
    };
  }

  if (/\b(merci|au revoir|a bientot)\b/.test(query)) {
    return {
      text: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Bonne journée.",
      confidence: 0.7,
      source: "thanks",
    };
  }

  const lr = settings?.laReinette || {};
  const phone = lr.phone || "01 79 71 75 42";
  return {
    text: `Je ne suis pas certain de bien comprendre votre demande. Voici ce que je peux faire pour vous :\n\n• Expliquer les tarifs et conditions\n• Vous guider pour réserver un trajet\n• Détailler l'inscription et les documents\n\nPour une réponse personnalisée, appelez le ${phone} (lun–ven 8h30–17h30) ou consultez la FAQ.\n\n${CHATBOT_DISCLAIMER}`,
    link: "/faq",
    linkText: "Consulter la FAQ",
    confidence: 0.4,
    source: "fallback",
    suggestions: CHATBOT_QUICK_REPLIES,
  };
}
