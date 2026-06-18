import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import {
  verifyAdminCredentials as verifyAdminCredentialsPure,
  verifyAdminPin,
} from "../utils/adminAuth";
import { incrementReservationStats } from "../utils/reservationStats";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

const defaultSettings = {
  general: {
    siteName: "ASAD",
    mainPhone: "01 79 71 75 42",
    contactEmail: "lareinette@asad-bourg-la-reine.fr",
  },
  topBanner: {
    visible: true,
    message: "Besoin de vous déplacer en toute sérénité ?",
    linkText: "Réservez vos transports",
  },
  hero: {
    label:
      "Bienvenue chez l'ASAD — La Sérénité au Cœur de Notre Accompagnement",
    title: "Séjournez sereinement",
    subtitle: "dans votre propre foyer",
    description:
      "L'accompagnement à domicile d'excellence pour nos seniors. Profitez d'une atmosphère paisible et d'une aide experte, chaque jour à vos côtés.",
  },
  about: {
    label: "À PROPOS DE NOUS",
    title: "Un partenaire de confiance",
    subtitle: "pour votre sérénité",
    description:
      "L'ASAD de Bourg-la-Reine est bien plus qu'une association de services. Nous sommes une communauté dévouée à préserver l'autonomie et la dignité de nos aînés au sein de leur foyer chargé de souvenirs.",
    experienceYears: "25+",
    experienceLabel: "Années d'expérience",
    points: [
      "Soins personnalisés adaptés à votre parcours de santé unique.",
      "Expertise pluridisciplinaire avec une équipe médicale disponible 24/7.",
      "Proximité et réactivité maximale grâce à notre réseau local.",
      "Accompagnement global pour une meilleure qualité de vie au quotidien.",
    ],
  },
  services: {
    label: "NOS PRESTATIONS D'EXCELLENCE",
    title: "Guichet Mixte",
    subtitle: "autour de votre sérénité",
    description:
      "Nous proposons des solutions d'aide et de soin adaptées à chaque étape, avec un engagement constant vers le confort et la dignité.",
    items: [
      {
        title: "SAAD - Aide à Domicile",
        desc: "Aide & Accompagnement à Domicile",
        points: [
          "Entretien du logement et du linge",
          "Préparation et aide aux repas",
          "Aide aux courses et démarches",
          "Accompagnement social",
        ],
        iconType: "Home",
        link: "/saad",
        hideButton: false,
      },
      {
        title: "SSIAD - Soins Infirmiers",
        desc: "Soins Infirmiers à Domicile",
        points: [
          "Soins d'hygiène et de confort",
          "Soins techniques infirmiers",
          "Suivi du traitement",
          "Coordination médicale",
        ],
        iconType: "Heart",
        link: "/ssiad",
        hideButton: false,
      },
      {
        title: "La Reinette - Transport Adapté",
        desc: "Mobilité Solidaire de Proximité",
        points: [
          "Transport à la demande 70 ans+",
          "Accompagnement porte-à-porte",
          "Véhicules adaptés (TPMR)",
          "Tarifs solidaires (5€ - 10€)",
        ],
        iconType: "User",
        link: "/",
        hideButton: false,
      },
      {
        title: "Téléassistance",
        desc: "Sécurité & Sérénité 24h/24",
        points: [
          "Dispositif d'alerte simple",
          "Intervention rapide 24h/7j",
          "Lien social et rassurant",
          "Installation à domicile",
        ],
        iconType: "Bell",
        link: "/teleassistance",
        hideButton: false,
      },
    ],
  },
  wizard: {
    label: "VOTRE GUIDE PERSONNALISÉ",
    title: "Trouvez la solution",
    subtitle: "parfaitement adaptée",
    description:
      "Répondez à quelques questions simples pour identifier le service qui vous correspond le mieux.",
  },
  highlight: {
    label: "L'EXCELLENCE DE L'ACCOMPAGNEMENT",
    title: "Un engagement",
    subtitle: "humain & professionnel",
    description:
      "Depuis 1961, l'ASAD de Bourg-la-Reine coordonne soins et aide à domicile pour préserver l'autonomie et la dignité de chacun au sein de son foyer.",
    items: [
      { label: "Expertise & Maintien à domicile", iconType: "ShieldCheck" },
      { label: "Respect des Droits & Libertés", iconType: "Heart" },
      { label: "Amélioration Continue & Écoute", iconType: "UserCheck" },
    ],
    buttonText: "Nos engagements",
    statValue: "100%",
    statLabel: "Bénéficiaires Satisfaits",
  },
  laReinette: {
    title: "La Reinette.",
    subtitle: "La Sérénité.",
    label: "Mobilité Solidaire",
    description:
      "Grâce au dispositif la Reinette, les séniors réginaburgiens dès 60 ans* et les personnes adultes en situation de handicap, inscrits au CCAS, peuvent bénéficier d'un transport. Pour en bénéficier, rien de plus simple ! Contactez le CCAS et un formulaire d'inscription vous sera transmis (01 79 71 41 20 et service-seniors@bourg-la-reine.fr).\n\nAvec ce transport, individuel ou collectif, le chauffeur vous récupère au plus près de chez vous. Sous réserve de disponibilités, vous pouvez, par exemple, l’utiliser pour aller faire vos courses, pour vos rendez-vous médicaux, pour vos sorties culturelles ou de loisirs, pour aller déjeuner au restaurant, pour vos démarches administratives, pour aller chez le coiffeur, déjeuner chez un(e) ami(e)…",
    phone: "01 79 71 75 42",
    pricing: [
      {
        zone: "Zone Locale",
        location: "Bourg-la-Reine",
        aller: "5€",
        ar: "10€",
        features: ["Trajets internes", "Commerces", "Loisirs", "RDV Médicaux"],
      },
      {
        zone: "Zone Limitrophe 92",
        location: "Antony",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 92 Autres",
        location: "Châtenay-Malabry",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 92",
        location: "Sceaux",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 92",
        location: "Bagneux",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 92 Autres",
        location: "Fontenay-aux-Roses",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 92 Autres",
        location: "Le Plessis-Robinson",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 92 Autres",
        location: "Clamart",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 92 Autres",
        location: "Châtillon",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 92 Autres",
        location: "Montrouge",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 92 Autres",
        location: "Malakoff",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 92 Autres",
        location: "Vanves",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 94",
        location: "Cachan",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 94",
        location: "L'Haÿ-les-Roses",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 94",
        location: "Villejuif",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 94",
        location: "Fresnes",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 94",
        location: "Gentilly",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 94",
        location: "Arcueil",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Limitrophe 94",
        location: "Le Kremlin-Bicêtre",
        aller: "8€",
        ar: "16€",
        features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
      },
      {
        zone: "Zone Hospitalière",
        location: "Hôpital Antoine Béclère",
        aller: "10€",
        ar: "20€",
        features: [
          "Trajet hospitalier",
          "Accompagnement",
          "Retour garanti",
          "Prioritaire",
        ],
      },
      {
        zone: "Zone Hospitalière",
        location: "Hôpital Foch",
        aller: "10€",
        ar: "20€",
        features: [
          "Trajet hospitalier",
          "Accompagnement",
          "Retour garanti",
          "Prioritaire",
        ],
      },
      {
        zone: "Zone Hospitalière",
        location: "Hôpital Corentin Celton",
        aller: "10€",
        ar: "20€",
        features: [
          "Trajet hospitalier",
          "Accompagnement",
          "Retour garanti",
          "Prioritaire",
        ],
      },
      {
        zone: "Zone Hospitalière",
        location: "Hôpital Henri Mondor",
        aller: "10€",
        ar: "20€",
        features: [
          "Trajet hospitalier",
          "Accompagnement",
          "Retour garanti",
          "Prioritaire",
        ],
      },
      {
        zone: "Zone Hospitalière",
        location: "Hôpital Bicêtre",
        aller: "10€",
        ar: "20€",
        features: [
          "Trajet hospitalier",
          "Accompagnement",
          "Retour garanti",
          "Prioritaire",
        ],
      },
      {
        zone: "Zone Hospitalière",
        location: "Hôpital Sainte-Périne",
        aller: "10€",
        ar: "20€",
        features: [
          "Trajet hospitalier",
          "Accompagnement",
          "Retour garanti",
          "Prioritaire",
        ],
      },
      {
        zone: "Zone Hospitalière",
        location: "Hôpital Paul Brousse",
        aller: "10€",
        ar: "20€",
        features: [
          "Trajet hospitalier",
          "Accompagnement",
          "Retour garanti",
          "Prioritaire",
        ],
      },
      {
        zone: "Zone Hospitalière",
        location: "Hôpital Emile Roux",
        aller: "10€",
        ar: "20€",
        features: [
          "Trajet hospitalier",
          "Accompagnement",
          "Retour garanti",
          "Prioritaire",
        ],
      },
      {
        zone: "Zone Hospitalière",
        location: "Hôpital Raymond Poincaré",
        aller: "10€",
        ar: "20€",
        features: [
          "Trajet hospitalier",
          "Accompagnement",
          "Retour garanti",
          "Prioritaire",
        ],
      },
      {
        zone: "Zone Hospitalière",
        location: "Hôpital Ambroise Paré",
        aller: "10€",
        ar: "20€",
        features: [
          "Trajet hospitalier",
          "Accompagnement",
          "Retour garanti",
          "Prioritaire",
        ],
      },
      {
        zone: "Zone Hospitalière",
        location: "Hôpital Beaujon",
        aller: "10€",
        ar: "20€",
        features: [
          "Trajet hospitalier",
          "Accompagnement",
          "Retour garanti",
          "Prioritaire",
        ],
      },
      {
        zone: "Longue Distance",
        location: "Orly",
        callOnly: true,
        features: [
          "Sur réservation uniquement",
          "Tarification sur demande",
          "Accompagnement spécifique",
        ],
      },
      {
        zone: "Longue Distance",
        location: "Paris",
        callOnly: true,
        features: [
          "Sur réservation uniquement",
          "Tarification sur demande",
          "Accompagnement spécifique",
        ],
      },
      {
        zone: "Zone Locale",
        location: "Bourg-la-Reine - Centre",
        aller: "5€",
        ar: "10€",
        features: ["Centre-ville", "Commerces", "Mairie", "Écoles"],
      },
      {
        zone: "Zone Locale",
        location: "Bourg-la-Reine - Gare",
        aller: "5€",
        ar: "10€",
        features: ["Gare RER", "Transports", "Quartier gare", "Commerces"],
      },
    ],
    eligibility: [
      {
        title: "Résidence",
        desc: "Avoir son habitation principale à Bourg-la-Reine.",
        tag: "Bourg-la-Reine",
      },
      {
        title: "Age",
        desc: "Sans condition de ressources, dès 60 ans sous réserve d’être en retraite ou de bénéficier de l’APA ou de la PCH ou d’un plan OSCAR de la CNAV ; à partir de 70 ans sans condition le service est ouvert à tous.",
        tag: "+70 Ans",
      },
      {
        title: "Où s’inscrire",
        desc: "CCAS de la ville de Bourg-la-Reine :\n- Par téléphone : 01 79 71 41 20\n- Par mail : service-seniors@bourg-la-reine.fr\n- Sur place : 1 Boulevard Carnot",
        tag: "Obligatoire",
      },
    ],
  },
  testimonials: [
    {
      name: "Jean-Pierre L.",
      role: "Fils d'une bénéficiaire",
      content:
        "Savoir ma mère en sécurité dans les véhicules de La Reinette est un immense soulagement. Les chauffeurs sont d'une patience exemplaire.",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Simone D.",
      role: "Bénéficiaire (82 ans)",
      content:
        "Depuis que j'utilise La Reinette pour mes déplacements, je ne m'inquiète plus. C'est ponctuel et tellement plus humain.",
      image:
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Thomas R.",
      role: "Fils d'un bénéficiaire",
      content:
        "Le service d'accompagnement a changé la vie de mon père. C'est devenu une présence rassurante et indispensable.",
      image:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Marie-Claire B.",
      role: "Bénéficiaire (76 ans)",
      content:
        "Les chauffeurs m'aident à monter dans le véhicule avec douceur. Je me sens respectée et en confiance à chaque rendez-vous médical.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Philippe M.",
      role: "Aidant familial",
      content:
        "La réservation par téléphone est simple et l'équipe répond toujours avec bienveillance. Un vrai soulagement pour toute la famille.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    },
  ],
  faq: {
    categories: ["Tous", "Éligibilité", "Réservation", "Paiement", "Sécurité"],
    questions: [
      {
        category: "Éligibilité",
        q: "Suis-je éligible au service La Reinette ?",
        a: "Le service est ouvert aux résidents ayant leur habitation principale à Bourg-la-Reine. Concernant l'âge, il est accessible sans condition de ressources dès 60 ans sous réserve d'être retraité ou de bénéficier de l'APA, de la PCH ou d'un plan OSCAR de la CNAV. À partir de 70 ans, le service est ouvert à tous sans condition.",
      },
      {
        category: "Éligibilité",
        q: "Quels documents faut-il pour s'inscrire ?",
        a: "Pour votre dossier d'inscription au CCAS, vous aurez besoin d'une pièce d'identité en cours de validité, d'un justificatif de domicile de moins de 3 mois à Bourg-la-Reine, et éventuellement d'un certificat médical ou d'une carte d'invalidité selon votre situation.",
      },
      {
        category: "Réservation",
        q: "Comment puis-je réserver un trajet ?",
        a: "La réservation s'effectue par téléphone au standard logistique : 01 79 71 75 42. Nos bureaux sont ouverts du lundi au vendredi de 8h30 à 12h00 et de 13h30 à 17h30.",
      },
      {
        category: "Réservation",
        q: "Combien de temps à l'avance faut-il réserver ?",
        a: "Il est fortement recommandé de réserver votre trajet au moins 48 heures à l'avance. Pour les rendez-vous médicaux importants, vous pouvez réserver jusqu'à plusieurs semaines à l'avance pour garantir la disponibilité.",
      },
      {
        category: "Réservation",
        q: "Puis-je annuler ou modifier un trajet ?",
        a: "Oui, les annulations sont possibles. Nous vous demandons simplement de nous prévenir le plus tôt possible, idéalement au moins 24 heures avant, afin de libérer le créneau pour un autre bénéficiaire.",
      },
      {
        category: "Paiement",
        q: "Quels sont les tarifs des trajets ?",
        a: "Les tarifs sont forfaitaires : 5€ l'aller (10€ A/R) pour Bourg-la-Reine, 8€ l'aller (16€ A/R) pour les communes limitrophes, et 10€ l'aller (20€ A/R) pour les hôpitaux aux alentours. Pour Paris et Orly, merci de contacter l'ASAD au 01 79 71 75 42.",
      },
      {
        category: "Paiement",
        q: "Peut-on payer en espèces ou par carte ?",
        a: "Non, le paiement s'effectue exclusivement par chèque à l'ordre de l'ASAD. Le chèque est à remettre directement au chauffeur à la fin de la prestation.",
      },
      {
        category: "Sécurité",
        q: "Le véhicule est-il adapté aux fauteuils roulants ?",
        a: "Oui, notre flotte comprend des véhicules spécifiquement aménagés (TPMR) avec rampe d'accès et systèmes de fixation sécurisés pour accueillir les personnes en fauteuil roulant manuel ou électrique.",
      },
      {
        category: "Sécurité",
        q: "Le chauffeur peut-il m'aider à porter mes courses ?",
        a: "Tout à fait. Nos chauffeurs assurent un service de 'porte-à-porte'. Ils vous aident à monter et descendre du véhicule et peuvent porter vos sacs de courses jusqu'à votre porte d'entrée si nécessaire.",
      },
      {
        category: "Sécurité",
        q: "Puis-je être accompagné pendant le trajet ?",
        a: "Oui, un accompagnateur (proche, ami ou auxiliaire de vie) peut voyager avec vous si sa présence est nécessaire à votre mobilité ou pour votre rendez-vous. Ce service d'accompagnement est gratuit pour votre proche.",
      },
      {
        category: "Tous",
        q: "Quels sont les jours et horaires de fonctionnement ?",
        a: "Le service La Reinette fonctionne du lundi au vendredi. Les premiers ramassages commencent à 8h30 et les derniers retours s'effectuent aux alentours de 17h30. Le service est fermé les jours fériés.",
      },
      {
        category: "Tous",
        q: "Où se situe le bureau de La Reinette ?",
        a: "Le service est géré par l'ASAD de Bourg-la-Reine, située au 3-5, allée Françoise Dolto. Cependant, toutes les réservations se font principalement par téléphone au 01 79 71 75 42.",
      },
      {
        category: "Inscription",
        q: "Quels sont les documents à fournir pour l'inscription ?",
        a: "Pour votre dossier d'inscription à l'ASAD, nous avons généralement besoin d'un justificatif de domicile à Bourg-la-Reine, d'une pièce d'identité et, pour le transport, de remplir une fiche d'adhésion annuelle.",
      },
      {
        category: "Service",
        q: "Le service fonctionne-t-il pour les loisirs ?",
        a: "Absolument ! La Reinette n'est pas limitée aux rendez-vous médicaux. Elle est là pour favoriser votre vie sociale : courses, coiffeur, visites amicales, loisirs, etc.",
      },
      {
        category: "Aide à domicile",
        q: "Proposez-vous de l'aide pour le ménage ?",
        a: "Oui, notre service SAAD (Service d'Aide à Domicile) propose des prestations de ménage, repassage et aide à l'entretien du cadre de vie.",
      },
    ],
  },
  partners: {
    label: "NOTRE ÉQUIPE",
    title: "Agir",
    subtitle: "Ensemble.",
    description:
      "Parce que la mobilité est l'affaire de tous, La Reinette collabore avec les institutions locales et les centres de santé majeurs de la région pour vous offrir un service fluide et sécurisé.",
    categories: [
      {
        title: "Partenaires Institutionnels",
        iconType: "Landmark",
        items: [
          {
            name: "ASAD Bourg-la-Reine",
            desc: "Expert de l'accompagnement, l'ASAD assure la gestion et la mobilité solidaire de proximité en partenariat avec la ville.",
            url: "https://asad-blr.fr",
            iconType: "Landmark",
          },
          {
            name: "Mairie de Bourg-la-Reine",
            desc: "La ville de Bourg-la-Reine soutient activement La Reinette pour favoriser l'autonomie et le bien-être de ses aînés.",
            url: "https://www.bourg-la-reine.fr",
            iconType: "Landmark",
          },
        ],
      },
    ],
    certificationTitle: "Un service certifié et soutenu.",
    certificationDesc:
      "La Reinette est un service conventionné qui répond aux normes de sécurité et de tarification fixées par la Ville de Bourg-la-Reine. Toutes nos liaisons hospitalières sont validées par les établissements receveurs.",
  },
  contact: {
    address: "3-5, allée Françoise Dolto",
    city: "92340 Bourg-la-Reine",
    logisticsPhone: "01 79 71 75 42",
    standardPhone: "01 79 71 75 42",
    email: "lareinette@asad-bourg-la-reine.fr",
    formRecipientEmail: "lareinette@asad-bourg-la-reine.fr",
    formTitle: "Nouveau message",
    successTitle: "Message envoyé !",
    successMessage:
      "Votre message a bien été transmis. Nous vous répondrons dans les plus brefs délais.",
  },
  emergencyNumbers: [
    { label: "SAMU / SMUR", number: "15" },
    { label: "Police Secours", number: "17" },
    { label: "Pompiers", number: "18" },
    { label: "Urgence Sourd/Malent.", number: "114" },
  ],
  footer: {
    tagline:
      "Depuis plus de 25 ans, nous cultivons l'excellence et l'humanité pour offrir aux seniors une vie riche de sens et de sérénité.",
    copyright:
      "© 2026 ASAD Bourg-la-Reine — Excellence du Service à la Personne.",
    socials: [
      { platform: "Facebook", url: "#", icon: "Facebook" },
      { platform: "Twitter", url: "#", icon: "Twitter" },
      { platform: "Instagram", url: "#", icon: "Instagram" },
      { platform: "Linkedin", url: "#", icon: "Linkedin" },
    ],
    columns: {
      col1Title: "Service La Reinette",
      col2Title: "Numéros d'Urgence",
      col3Title: "Contact ASAD",
    },
    links: [
      { label: "Réserver un trajet", path: "/reservation" },
      { label: "Tarifs & Destinations", path: "/" },
      { label: "Foire aux Questions", path: "/faq" },
    ],
    legalLinks: [
      { label: "Conditions Générales", path: "#" },
      { label: "Politique de Confidentialité", path: "#" },
    ],
  },
  emailTemplates: {
    bookingIntro:
      "Une nouvelle demande de réservation a été reçue via le site La Reinette.",
    bookingFooter: "Merci de traiter cette demande dans les plus brefs délais.",
    contactIntro:
      "Vous avez reçu un nouveau message depuis le formulaire de contact.",
    contactFooter: "Merci de répondre à ce contact dès que possible.",
    labels: {
      passagerHeader: "--- 👤 PASSAGER ---",
      clientName: "Nom du Client",
      phone: "Téléphone",
      itineraireHeader: "--- 🗺️ ITINÉRAIRE ---",
      tripType: "Type de Trajet",
      departure: "Départ",
      destination: "Destination",
      motif: "Motif",
      horairesHeader: "--- ⏱️ HORAIRES ---",
      date: "Date",
      appointmentTime: "Heure du RDV",
      pickupAller: "Prise en charge Aller",
      pickupRetour: "Prise en charge Retour",
      estimationHeader: "--- 💰 ESTIMATION ---",
      price: "Montant estimé",
      payment: "Paiement",
      paymentValue: "Chèque uniquement (à l'ordre de l'ASAD)",
      introHeader: "MESSAGE D'INTRODUCTION",
      conclusionHeader: "CONCLUSION",
      noteHeader: "--- 📝 NOTE ---",
      contactTitle: "Nouveau message de contact",
      contactFrom: "De :",
      contactSubject: "Sujet :",
      contactIntroHeader: "INTRODUCTION",
      contactConclusionHeader: "CONCLUSION",
    },
    newsletterWelcomeSubject:
      "Bienvenue à la newsletter La Reinette — Bourg-la-Reine",
    newsletterWelcomeMessage:
      "Merci pour votre inscription à notre newsletter.\n\nVous recevrez nos actualités, conseils pour les seniors et informations sur le service de mobilité solidaire La Reinette.\n\nÀ très bientôt,\nL'équipe La Reinette — ASAD Bourg-la-Reine",
  },
  emailjs: {
    reservation: { serviceId: "", templateId: "", publicKey: "" },
    registration: { serviceId: "", templateId: "", publicKey: "" },
    clientConfirmation: { serviceId: "", templateId: "", publicKey: "" },
    contact: { serviceId: "", templateId: "", publicKey: "" },
    newsletter: { serviceId: "", templateId: "", publicKey: "" },
  },
  stats: {
    totalBookings: 0,
    destinations: {}, // { "Clamart": 5, "Bourg-la-Reine": 3 }
  },
  news: [
    {
      id: 1,
      title: "Comment bien préparer sa sortie en hiver ?",
      content:
        "L'hiver demande une attention particulière pour nos seniors. Voici nos conseils pour des déplacements sereins : habillage multicouche pour éviter les chocs thermiques, chaussures à semelles antidérapantes pour prévenir les chutes sur sol humide ou verglacé, et n'oubliez pas de bien vous hydrater même s'il fait froid. Nos chauffeurs La Reinette sont formés pour vous aider à monter et descendre du véhicule en toute sécurité durant cette période.",
      category: "Conseils",
      date: "2026-04-20",
      image:
        "https://images.unsplash.com/photo-1517210122415-b0c70b2a09bf?auto=format&fit=crop&w=800&q=80",
      author: "Équipe La Reinette",
    },
    {
      id: 2,
      title: "Le Guichet Mixte : Une révolution pour votre maintien à domicile",
      content:
        "À l'ASAD de Bourg-la-Reine, nous simplifions vos démarches. Grâce à notre Guichet Mixte, nous coordonnons désormais vos soins infirmiers (SSIAD) et votre aide à domicile (SAAD) via un interlocuteur unique. Fini la multiplication des dossiers administratifs, nous nous occupons de tout pour garantir la continuité de votre accompagnement.",
      category: "Actualités",
      date: "2026-04-18",
      image:
        "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
      author: "Direction ASAD",
    },
    {
      id: 3,
      title:
        "Sorties culturelles : Profitez du Conservatoire et de la Médiathèque",
      content:
        "Le service La Reinette n'est pas uniquement réservé aux rendez-vous médicaux ! Nous vous accompagnons avec plaisir au Conservatoire à Rayonnement Régional ou à la Médiathèque François Villon. C'est l'occasion de maintenir une vie sociale riche sans se soucier du stationnement ou de la marche à pied excessive. Réservez votre trajet pour la prochaine exposition !",
      category: "Événement",
      date: "2026-04-10",
      image:
        "https://images.unsplash.com/photo-1526398977052-654221a252b1?auto=format&fit=crop&w=800&q=80",
      author: "Service Animation",
    },
    {
      id: 4,
      title: "Portrait de Chauffeur : Rencontre avec Marc",
      content:
        "Marc est chauffeur pour La Reinette depuis 5 ans. 'Ce que j'aime le plus, c'est le lien humain. On ne fait pas que transporter des passagers, on partage des histoires de vie au fil des rues de Bourg-la-Reine.' Marc est particulièrement apprécié pour sa patience et sa connaissance parfaite des raccourcis de la ville pour éviter les bouchons du boulevard Joffre.",
      category: "Portrait",
      date: "2026-04-05",
      image:
        "https://images.unsplash.com/photo-1549416878-b9ca35c2d47a?auto=format&fit=crop&w=800&q=80",
      author: "Rédaction",
    },
    {
      id: 5,
      title: "Guide pratique : Comment s'inscrire au service La Reinette ?",
      content:
        "Pour bénéficier de nos transports, une inscription préalable est nécessaire. Vous devez vous présenter au CCAS de Bourg-la-Reine muni d'une pièce d'identité, d'un justificatif de domicile de moins de 3 mois et d'une photo d'identité. Une fois votre carte de transport délivrée, vous pourrez réserver vos trajets en appelant notre standard logistique au 01 79 71 75 42.",
      category: "Conseils",
      date: "2026-04-01",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
      author: "Service Inscription",
    },
    {
      id: 6,
      title: "Familles : Comment réserver pour l'un de vos proches ?",
      content:
        "Vous habitez loin et souhaitez organiser les déplacements de vos parents ? C'est possible ! Vous pouvez nous contacter directement pour planifier les rendez-vous de la semaine. Nous vous confirmons la prise en charge et nous assurons du bon retour à domicile. Le paiement s'effectue par chèque remis au chauffeur, ce qui simplifie la gestion pour vous.",
      category: "Conseils",
      date: "2026-03-25",
      image:
        "https://images.unsplash.com/photo-1581578731522-745d05db972a?auto=format&fit=crop&w=800&q=80",
      author: "Pôle Famille",
    },
    {
      id: 7,
      title: "Nos 3 zones de transport : Comprendre les tarifs",
      content:
        "Pour plus de clarté, La Reinette fonctionne avec des zones tarifaires simples. La Zone 1 (Bourg-la-Reine) à 5€, la Zone 2 (Communes limitrophes) à 8€, et la Zone 3 (Hôpitaux) à 10€. Pour les destinations plus lointaines comme Paris ou Orly, le tarif est sur demande. Pensez à réserver 48h à l'avance.",
      category: "Actualités",
      date: "2026-03-20",
      image:
        "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=800&q=80",
      author: "Logistique",
    },
  ],
  ssiadSaad: {
    hero: {
      title: "Services de Soins & d'Aide",
      subtitle: "Un accompagnement global pour votre sérénité à domicile",
      description:
        "Nous coordonnons soins médicaux et aide à la vie quotidienne pour vous permettre de rester chez vous le plus longtemps possible, dans les meilleures conditions.",
    },
    ssiad: {
      title: "SSIAD - Soins Infirmiers à Domicile",
      description:
        "Le Service de Soins Infirmiers à Domicile (SSIAD) assure, sur prescription médicale, des prestations de soins infirmiers sous forme de soins techniques ou de soins d'hygiène.",
      points: [
        "Soins d'hygiène et de confort (toilettes, aide au lever/coucher)",
        "Soins techniques infirmiers (pansements, injections, prélèvements)",
        "Suivi du traitement et coordination médicale",
        "Prévention des chutes et conseils en aménagement",
      ],
      public:
        "S'adresse aux personnes âgées de 60 ans et plus, malades ou dépendantes, et aux personnes adultes de moins de 60 ans présentant un handicap.",
      access:
        "Sur prescription médicale uniquement. Prise en charge à 100% par l'Assurance Maladie.",
    },
    saad: {
      title: "SAAD - Aide & Accompagnement à Domicile",
      description:
        "Le Service d'Aide et d'Accompagnement à Domicile (SAAD) vous assiste dans les gestes de la vie quotidienne pour préserver votre autonomie.",
      points: [
        "Entretien du logement et du linge (ménage, repassage)",
        "Préparation et aide à la prise des repas",
        "Aide aux courses et démarches administratives simples",
        "Présence et accompagnement social",
      ],
      public:
        "Ouvert à tous les seniors souhaitant un soutien quotidien pour rester à domicile en toute sécurité.",
      access:
        "Directement auprès de notre association. Possible éligibilité à l'APA (Allocation Personnalisée d'Autonomie) ou PCH.",
    },
    teleassistance: {
      title: "Téléassistance - Sécurité 24h/24",
      description:
        "Un dispositif simple et efficace pour alerter les secours en cas de chute ou de malaise, garantissant une tranquillité d'esprit totale pour vous et vos proches.",
      points: [
        "Dispositif d'alerte simple (médaillon ou montre)",
        "Intervention rapide 24h/24 et 7j/7",
        "Lien social pour rompre l'isolement",
        "Installation et maintenance à domicile par nos techniciens",
      ],
      public:
        "S'adresse à toutes les personnes âgées ou en situation de handicap vivant seules à leur domicile.",
      access:
        "Souscription simple auprès de l'ASAD. Installation rapide sous 48h.",
    },
  },
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  const mergeSettings = (parsed) => {
    // Specialized merge for FAQ to avoid losing new default questions
    const mergedFaq = {
      ...defaultSettings.faq,
      ...(parsed.faq || {}),
      questions:
        parsed.faq?.questions?.length > 0
          ? [...parsed.faq.questions]
          : [...defaultSettings.faq.questions],
    };

    // If we have new default questions that are NOT in the parsed settings, we should ideally add them
    // But to keep it simple and fulfill the user's request "add all possible questions",
    // we'll ensure that if the defaults have more questions, we use the defaults as a base.
    if (
      defaultSettings.faq.questions.length >
      (parsed.faq?.questions?.length || 0)
    ) {
      mergedFaq.questions = defaultSettings.faq.questions;
    }

    return {
      ...defaultSettings,
      ...parsed,
      general: (() => {
        const merged = {
          ...defaultSettings.general,
          ...(parsed.general || {}),
        };
        if (merged.contactEmail === "nabilsaied04@gmail.com") {
          merged.contactEmail = defaultSettings.general.contactEmail;
        }
        return merged;
      })(),
      topBanner: { ...defaultSettings.topBanner, ...(parsed.topBanner || {}) },
      hero: { ...defaultSettings.hero, ...(parsed.hero || {}) },
      about: { ...defaultSettings.about, ...(parsed.about || {}) },
      services: { ...defaultSettings.services, ...(parsed.services || {}) },
      wizard: { ...defaultSettings.wizard, ...(parsed.wizard || {}) },
      highlight: { ...defaultSettings.highlight, ...(parsed.highlight || {}) },
      laReinette: {
        ...defaultSettings.laReinette,
        ...(parsed.laReinette || {}),
      },
      faq: mergedFaq,
      footer: {
        ...defaultSettings.footer,
        ...(parsed.footer || {}),
        socials: parsed.footer?.socials || defaultSettings.footer.socials,
        columns: {
          ...defaultSettings.footer.columns,
          ...(parsed.footer?.columns || {}),
        },
        links: parsed.footer?.links || defaultSettings.footer.links,
        legalLinks:
          parsed.footer?.legalLinks || defaultSettings.footer.legalLinks,
      },
      partners: { ...defaultSettings.partners, ...(parsed.partners || {}) },
      contact: (() => {
        const merged = {
          ...defaultSettings.contact,
          ...(parsed.contact || {}),
        };
        const asadEmail = defaultSettings.contact.email;
        const legacyPersonal = "nabilsaied04@gmail.com";
        if (merged.email === legacyPersonal) merged.email = asadEmail;
        if (merged.formRecipientEmail === legacyPersonal)
          merged.formRecipientEmail = asadEmail;
        return merged;
      })(),
      ssiadSaad: {
        ...defaultSettings.ssiadSaad,
        ...(parsed.ssiadSaad || {}),
        hero: {
          ...defaultSettings.ssiadSaad.hero,
          ...(parsed.ssiadSaad?.hero || {}),
        },
        ssiad: {
          ...defaultSettings.ssiadSaad.ssiad,
          ...(parsed.ssiadSaad?.ssiad || {}),
          points:
            parsed.ssiadSaad?.ssiad?.points ||
            defaultSettings.ssiadSaad.ssiad.points,
        },
        saad: {
          ...defaultSettings.ssiadSaad.saad,
          ...(parsed.ssiadSaad?.saad || {}),
          points:
            parsed.ssiadSaad?.saad?.points ||
            defaultSettings.ssiadSaad.saad.points,
        },
      },
      emailTemplates: {
        ...defaultSettings.emailTemplates,
        ...(parsed.emailTemplates || {}),
      },
      emailjs: {
        ...defaultSettings.emailjs,
        ...(parsed.emailjs || parsed.emailTemplates?.emailjs || {}),
        newsletter: {
          ...defaultSettings.emailjs.newsletter,
          ...(parsed.emailjs?.newsletter ||
            parsed.emailTemplates?.emailjs?.newsletter ||
            {}),
        },
        clientConfirmation: {
          ...defaultSettings.emailjs.clientConfirmation,
          ...(parsed.emailjs?.clientConfirmation ||
            parsed.emailTemplates?.emailjs?.clientConfirmation ||
            {}),
        },
      },
      stats: { ...defaultSettings.stats, ...(parsed.stats || {}) },
      news: parsed.news || defaultSettings.news,
      testimonials:
        parsed.testimonials?.length >= defaultSettings.testimonials.length
          ? parsed.testimonials
          : defaultSettings.testimonials,
    };
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("data")
          .eq("id", 1)
          .single();
        if (data && data.data && Object.keys(data.data).length > 0) {
          const mergedData = mergeSettings(data.data);
          let updated = false;

          // Migration for ASAD branding
          if (
            mergedData?.laReinette?.label ===
            "Le Service Municipal de Mobilité Solidaire" ||
            mergedData?.laReinette?.label ===
            "Le Service Municipal de Mobilité Sol idaire" ||
            mergedData?.laReinette?.label ===
            "L'ASAD de Bourg-la-Reine - Mobilité Solidaire"
          ) {
            mergedData.laReinette.label = "La Mobilité Solidaire par l'ASAD";
          }

          // Migration for 'Guichet Mixte' in main title
          if (mergedData?.services) {
            mergedData.services.title = "Guichet Mixte";
            mergedData.services.subtitle = "autour de votre sérénité";
            mergedData.services.description =
              "Nous proposons des solutions d'aide et de soin adaptées à chaque étape, avec un engagement constant vers le confort et la dignité.";

            // Migration for services: Include all 4 cards with detailed points
            if (mergedData.services && mergedData.services.items) {
              mergedData.services.items = [
                {
                  title: "SAAD - Aide à Domicile",
                  desc: "Votre autonomie préservée",
                  points: [
                    "Entretien du logement et du linge",
                    "Préparation et aide aux repas",
                    "Aide aux courses et démarches",
                    "Accompagnement social",
                  ],
                  iconType: "Home",
                  link: "/saad",
                  hideButton: false,
                },
                {
                  title: "SSIAD - Soins Infirmiers",
                  desc: "L'expertise médicale chez vous",
                  points: [
                    "Soins d'hygiène et de confort",
                    "Soins techniques infirmiers",
                    "Suivi du traitement",
                    "Coordination médicale",
                  ],
                  iconType: "Heart",
                  link: "/ssiad",
                  hideButton: false,
                },
                {
                  title: "La Reinette - Transport Adapté",
                  desc: "Mobilité solidaire & inclusive",
                  points: [
                    "Transport à la demande 70 ans+",
                    "Accompagnement porte-à-porte",
                    "Véhicules adaptés (TPMR)",
                    "Tarifs solidaires (5€ - 10€)",
                  ],
                  iconType: "User",
                  link: "/",
                  hideButton: false,
                },
                {
                  title: "Téléassistance",
                  desc: "Sécurité & veille 24h/24",
                  points: [
                    "Dispositif d'alerte simple",
                    "Intervention rapide 24h/7j",
                    "Lien social et rassurant",
                    "Installation à domicile",
                  ],
                  iconType: "Bell",
                  link: "/teleassistance",
                  hideButton: false,
                },
              ];
            }
          }

          // Migration for eligibility texts
          if (mergedData?.laReinette?.eligibility) {
            const currentEligibility = mergedData.laReinette.eligibility;
            const hasOldDescriptions = currentEligibility.some(
              (item) =>
                item.desc.includes("de manière permanente") ||
                item.desc.includes("Avoir plus de 70 ans") ||
                item.desc.includes("préalablement inscrit auprès du CCAS") ||
                (item.title.includes("inscrire") && !item.desc.includes("\n"))
            );
            if (hasOldDescriptions) {
              mergedData.laReinette.eligibility = defaultSettings.laReinette.eligibility;
              updated = true;
            }
          }

          // Migration for hero section text
          if (mergedData?.laReinette) {
            const hasOldHero = mergedData.laReinette.description && mergedData.laReinette.description.includes("Un transport à la demande d'excellence");
            if (hasOldHero) {
              mergedData.laReinette.label = defaultSettings.laReinette.label;
              mergedData.laReinette.description = defaultSettings.laReinette.description;
              updated = true;
            }
          }

          // Migration for laReinette description: remove the 'La Reinette a été créée' sentence from description since it is now placed at the top
          const creationSentence = "La Reinette a été créée à l’initiative de la Ville de Bourg-la-Reine en collaboration avec l’ASAD, association de services à domicile présente depuis 1961.";
          if (mergedData?.laReinette?.description && (mergedData.laReinette.description.includes("\n\n" + creationSentence) || mergedData.laReinette.description.includes(" " + creationSentence))) {
            mergedData.laReinette.description = mergedData.laReinette.description
              .replace("\n\n" + creationSentence, "")
              .replace(" " + creationSentence, "");
            updated = true;
          }

          // Migration for eligibility FAQ response
          if (mergedData?.faq?.questions) {
            mergedData.faq.questions = mergedData.faq.questions.map((q) => {
              if (q.q.includes("Suis-je éligible au service La Reinette ?") && q.a.includes("plus de 70 ans")) {
                q.a = "Le service est ouvert aux résidents ayant leur habitation principale à Bourg-la-Reine. Concernant l'âge, il est accessible sans condition de ressources dès 60 ans sous réserve d'être retraité ou de bénéficier de l'APA, de la PCH ou d'un plan OSCAR de la CNAV. À partir de 70 ans, le service est ouvert à tous sans condition.";
                updated = true;
              }
              return q;
            });
          }

          // Migration for destinations: Update to individual destinations
          if (mergedData?.laReinette?.pricing) {
            const currentPricing = mergedData.laReinette.pricing;
            const hasGroupedDestinations = currentPricing.some(
              (p) =>
                p.location.includes(",") ||
                p.location.includes("etc.") ||
                p.location.includes("..."),
            );

            if (hasGroupedDestinations) {
              mergedData.laReinette.pricing =
                defaultSettings.laReinette.pricing;
              updated = true;
            }
          }

          // Migration for Partners section
          if (mergedData?.partners) {
            mergedData.partners.label = "NOS FONDATEURS";
            mergedData.partners.title = "Les Fondateurs";
            mergedData.partners.subtitle = "de La Reinette.";

            // Ensure both ASAD and Mairie are present
            const partnerItems =
              mergedData.partners.categories?.[0]?.items || [];
            const hasAsad = partnerItems.some((item) =>
              item.name.includes("ASAD"),
            );
            const hasMairie = partnerItems.some((item) =>
              item.name.includes("Mairie"),
            );

            if (!hasAsad) {
              partnerItems.unshift({
                name: "ASAD Bourg-la-Reine",
                desc: "Expert de l'accompagnement, l'ASAD assure la gestion et la mobilité solidaire de proximité en partenariat avec la ville.",
                url: "https://asad-blr.fr",
                iconType: "Landmark",
              });
            }

            if (!hasMairie) {
              partnerItems.push({
                name: "Mairie de Bourg-la-Reine",
                desc: "La ville de Bourg-la-Reine soutient activement La Reinette pour favoriser l'autonomie et le bien-être de ses aînés.",
                url: "https://www.bourg-la-reine.fr",
                iconType: "Landmark",
              });
            }

            if (mergedData.partners.categories?.[0]) {
              mergedData.partners.categories[0].items = partnerItems;
            }
          }

          // Migration for FAQ payments
          if (mergedData?.faq?.questions) {
            mergedData.faq.questions = mergedData.faq.questions.map((q) => {
              if (q.a.includes("régie municipale")) {
                q.a = q.a.replace(
                  "régie municipale",
                  "convention de service public",
                );
              }
              return q;
            });
          }

          // Migration for Orly / Paris pricing cards
          if (mergedData?.laReinette?.pricing) {
            const newPricing = [];
            for (const p of mergedData.laReinette.pricing) {
              if (p.location.includes("Paris") && p.location.includes("Orly")) {
                newPricing.push({
                  ...p,
                  location: "Orly (Aéroport)",
                });
                newPricing.push({
                  ...p,
                  location: "Paris",
                });
                updated = true;
              } else {
                newPricing.push(p);
              }
            }
            mergedData.laReinette.pricing = newPricing;

            // Migration for adding missing 94 communes
            const missing94Communes = [
              "Villejuif",
              "Fresnes",
              "Gentilly",
              "Arcueil",
              "Le Kremlin-Bicêtre",
            ];
            const existing94Locations = mergedData.laReinette.pricing
              .filter((p) => p.zone === "Zone Limitrophe 94")
              .map((p) => p.location);

            for (const commune of missing94Communes) {
              if (!existing94Locations.includes(commune)) {
                mergedData.laReinette.pricing.push({
                  zone: "Zone Limitrophe 94",
                  location: commune,
                  aller: "8€",
                  ar: "16€",
                  features: ["Ville voisine", "Spécialistes", "Famille", "Parcs"],
                });
                updated = true;
              }
            }

            // Migration for splitting 92 communes into neighboring and others
            const neighboring92Communes = [
              "Antony",
              "Sceaux",
              "Bagneux",
            ];
            const other92Communes = [
              "Fontenay-aux-Roses",
              "Le Plessis-Robinson",
              "Châtenay-Malabry",
              "Clamart",
              "Châtillon",
              "Montrouge",
              "Malakoff",
              "Vanves",
            ];

            for (const p of mergedData.laReinette.pricing) {
              if (p.zone === "Zone Limitrophe 92" && other92Communes.includes(p.location)) {
                p.zone = "Zone Limitrophe 92 Autres";
                updated = true;
              }
            }

            // Migration for removing Paris arrondissements, keeping only "Paris" and "Orly"
            const parisArrondissementsPattern = /^Paris \d+e(r|ème)$/;
            const originalLength = mergedData.laReinette.pricing.length;
            mergedData.laReinette.pricing = mergedData.laReinette.pricing.filter(
              (p) => !parisArrondissementsPattern.test(p.location)
            );
            if (mergedData.laReinette.pricing.length !== originalLength) {
              updated = true;
            }
          }

          // Automatically persist this migration if it happened
          if (updated) {
            supabase
              .from("site_settings")
              .update({ data: mergedData })
              .eq("id", 1)
              .then(() => {
                console.log("Migration persisted to Supabase");
              })
              .catch(console.error);
          }

          setSettings(mergedData);
        } else {
          // Insert default settings if it's completely empty
          await supabase
            .from("site_settings")
            .upsert({ id: 1, data: defaultSettings });
        }
      } catch (err) {
        console.error("Supabase fetch error, fallback to default", err);
        setSettings(defaultSettings);
      } finally {
        setIsSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("isAdmin") === "true";
  });

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    try {
      await supabase
        .from("site_settings")
        .update({ data: newSettings })
        .eq("id", 1);
    } catch (e) {
      console.error("Error saving settings to supabase", e);
    }
  };

  const trackReservation = async (destination) => {
    const newStats = incrementReservationStats(settings.stats, destination);
    const newSettings = { ...settings, stats: newStats };
    setSettings(newSettings);
    // Also update remote settings quietly
    try {
      await supabase
        .from("site_settings")
        .update({ data: newSettings })
        .eq("id", 1);
    } catch (e) {
      console.error(e);
    }
  };

  const verifyAdminCredentials = (email, password) =>
    verifyAdminCredentialsPure(email, password, import.meta.env);

  const login = (pin) => {
    if (verifyAdminPin(pin, import.meta.env)) {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        trackReservation,
        isAdmin,
        verifyAdminCredentials,
        login,
        logout,
        isSettingsLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
