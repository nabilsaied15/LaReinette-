/** Métadonnées SEO par route (pages sans composant SEO dédié incluses). */

export const SITE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
  "https://www.asad-bourg-la-reine.fr";

const DEFAULT_DESCRIPTION =
  "Service de transport et d'accompagnement pour seniors à Bourg-la-Reine par l'ASAD. La Reinette, SAAD, SSIAD, téléassistance.";

export const ROUTE_SEO = {
  "/": {
    title: "Transport et sorties des seniors à Bourg-la-Reine",
    description:
      "La Reinette met à disposition des habitants de Bourg-la-Reine, les Réginaburgiens et les Réginaburgiennes, un service de transport pour leurs sorties et leurs déplacements du quotidien.",
  },
  "/accueil": {
    title: "Accueil",
    description:
      "Découvrez l'ASAD et La Reinette : transport solidaire, aide à domicile et soins pour les seniors à Bourg-la-Reine.",
  },
  "/la-reinette": {
    title: "La Reinette — Mobilité solidaire",
    description:
      "Service de transport adapté (TPMR) pour seniors à Bourg-la-Reine : éligibilité, zones, horaires, inscription CCAS et réservation.",
    keywords: "La Reinette, transport senior, Bourg-la-Reine, TPMR, CCAS",
  },
  "/tarifs-lareinette": {
    title: "Tarifs La Reinette",
    description:
      "Grille tarifaire des trajets La Reinette : Bourg-la-Reine, communes limitrophes, hôpitaux. Paiement par chèque à l'ordre de l'ASAD.",
    keywords: "tarifs transport senior, prix trajet Bourg-la-Reine",
  },
  "/reservation": {
    title: "Réservation de trajet",
    description:
      "Réservez un transport La Reinette en ligne : formulaire guidé, inscription et confirmation par e-mail.",
    keywords: "réserver transport senior, réservation La Reinette",
  },
  "/contact": {
    title: "Contact",
    description:
      "Contactez l'ASAD et La Reinette par téléphone, e-mail ou formulaire. Bourg-la-Reine.",
  },
  "/faq": {
    title: "FAQ — Questions fréquentes",
    description:
      "Réponses sur l'éligibilité, les tarifs, la réservation, le paiement et la sécurité du service La Reinette.",
    keywords: "FAQ transport senior, questions La Reinette",
  },
  "/partenaires": {
    title: "Partenaires",
    description:
      "Partenaires institutionnels de l'ASAD et de La Reinette : CCAS, mairie, fondations.",
  },
  "/asad": {
    title: "L'ASAD",
    description:
      "Association de services à domicile à Bourg-la-Reine : pôles d'expertise, publics accompagnés et engagements.",
  },
  "/avis": {
    title: "Avis et témoignages",
    description:
      "Témoignages des bénéficiaires et familles sur le service La Reinette à Bourg-la-Reine.",
  },
  "/chiffres-cles": {
    title: "Chiffres clés",
    description:
      "Indicateurs et impact de l'ASAD et du service La Reinette pour les seniors.",
  },
  "/destinations": {
    title: "Destinations",
    description:
      "Lieux desservis par La Reinette : communes, hôpitaux, Paris, Orly et zones limitrophes.",
  },
  "/actualites": {
    title: "Actualités",
    description:
      "Actualités de l'ASAD, de La Reinette et de l'aide à domicile à Bourg-la-Reine.",
  },
  "/saad": {
    title: "SAAD — Aide à domicile",
    description:
      "Service d'aide et d'accompagnement à domicile : ménage, repas, courses, autonomie.",
  },
  "/ssiad": {
    title: "SSIAD — Soins infirmiers",
    description:
      "Soins infirmiers à domicile sur prescription médicale par le SSIAD de l'ASAD.",
  },
  "/teleassistance": {
    title: "Téléassistance",
    description:
      "Téléassistance 24h/24 pour seniors : alerte, sécurité à domicile, formules d'abonnement.",
  },
  "/direction/admin": {
    title: "Administration",
    description: "Espace réservé à l'administration du site.",
    noindex: true,
  },
  "/direction/admin/dashboard": {
    title: "Tableau de bord",
    description: "Administration du site La Reinette.",
    noindex: true,
  },
};

/**
 * @param {string} pathname
 * @returns {{ title?: string, description?: string, keywords?: string, noindex?: boolean } | null}
 */
export function getRouteSeo(pathname) {
  if (pathname.startsWith("/actualites/") && pathname !== "/actualites") {
    return null;
  }

  return (
    ROUTE_SEO[pathname] || {
      title: "La Reinette",
      description: DEFAULT_DESCRIPTION,
    }
  );
}

/** Chemins publics pour sitemap.xml */
export const SITEMAP_PATHS = [
  "/",
  "/accueil",
  "/la-reinette",
  "/tarifs-lareinette",
  "/reservation",
  "/contact",
  "/faq",
  "/partenaires",
  "/asad",
  "/avis",
  "/chiffres-cles",
  "/destinations",
  "/actualites",
  "/saad",
  "/ssiad",
  "/teleassistance",
];
