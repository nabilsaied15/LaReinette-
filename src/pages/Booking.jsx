import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { buildReservationScheduleVarsFromForm } from "../utils/reservationEmailVars";
import { sendRegistrationNotification } from "../utils/registrationEmail";
import {
  validateEmail,
  validatePhone,
  validateSocialSecurity,
  validateRegistrationSubStep as validateRegistrationSubStepPure,
  validateTripSchedule,
  isWeekendDate,
  areAddressesIdentical,
  computeReturnPickupTime,
} from "../utils/bookingValidation";
import { calculateTransportPrice } from "../utils/transportPricing";
import { isContactSpam } from "../utils/contactValidation";
import DOMPurify from "dompurify";
import { supabase } from "../config/supabase";
import SEO from "../components/SEO";
import {
  Car,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Phone,
  ArrowLeft,
  UserPlus,
  Mail,
  HelpCircle,
  Info,
  Navigation,
  CreditCard,
  Repeat,
  Shield,
  FileText,
  Stethoscope,
  ShoppingBag,
  MoreHorizontal,
  Users,
  Download,
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import RegistrationRequiredDocuments from "../components/RegistrationRequiredDocuments";
import {
  REGISTRATION_DOCUMENTS_TITLE,
  REGISTRATION_DOCUMENTS_AGE_GROUP,
  getRegistrationDocumentsPdfLines,
} from "../data/registrationRequiredDocuments";
import { PDFDocument, StandardFonts, rgb as pdfRgb } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun } from "docx";
import "./Booking.css";

const Booking = () => {
  const PY_DOCX_API_URL =
    import.meta.env.VITE_DOCX_API_URL || "http://127.0.0.1:8000";
  const initialRegistrationData = {
    beneficiary1Title: "",
    beneficiary1LastName: "",
    beneficiary1FirstName: "",
    beneficiary1BirthDate: "",
    beneficiary2Title: "",
    beneficiary2LastName: "",
    beneficiary2FirstName: "",
    beneficiary2BirthDate: "",
    socialSecurityNumber: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    floor: "",
    mobilePhone: "",
    homePhone: "",
    email: "",
    hasLegalRepresentative: false,
    legalRepLastName: "",
    legalRepFirstName: "",
    legalRepAddressLine1: "",
    legalRepAddressLine2: "",
    legalRepPhone: "",
    legalRepEmail: "",
    emergency1LastName: "",
    emergency1FirstName: "",
    emergency1AddressLine1: "",
    emergency1AddressLine2: "",
    emergency1Phone: "",
    emergency1Email: "",
    emergency1Relation: "",
    emergency2LastName: "",
    emergency2FirstName: "",
    emergency2AddressLine1: "",
    emergency2AddressLine2: "",
    emergency2Phone: "",
    emergency2Email: "",
    emergency2Relation: "",
    mobilityType: "",
    aidWalker: false,
    aidTransferChair: false,
    aidTripodCane: false,
    aidQuadripodCane: false,
    aidSimpleCane: false,
    aidCrutch: false,
    docResidenceProof: false,
    docIdentityCard: false,
    docVitaleCard: false,
    docRetirementOrASPA: false,
    docAPA: false,
    docPCH: false,
    docCMIPriorityOrInvalidity: false,
    docMedicalCertificate: false,
    engagementTransportRules: false,
    attestAccuracy: false,
    signatureDate: "",
    additionalNotes: "",
  };

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const { settings, trackReservation, isSettingsLoading } = useSettings();
  const [searchParams] = useSearchParams();
  const { emailTemplates } = settings;

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    departure: "",
    destination: "",
    time: "",
    pickupTime: "",
    returnPickupTime: "",
    motif: "Médecin",
    motifAutre: "",
    tripType: "Aller Simple", // 'Aller Simple' or 'Aller-Retour'
    date: "",
    name: "",
    phone: "",
    email: "",
    website: "", // Honeypot
    isRegistered: null,
  });

  const [formStartTime] = useState(Date.now());

  const [formErrors, setFormErrors] = useState({});
  const [regErrors, setRegErrors] = useState({});

  const [suggestions, setSuggestions] = useState({
    departure: [],
    destination: [],
  });
  const [showSuggestions, setShowSuggestions] = useState({
    departure: false,
    destination: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingRegistration, setIsSubmittingRegistration] =
    useState(false);
  const [isDownloadingRequiredDocs, setIsDownloadingRequiredDocs] =
    useState(false);
  const [showRegistrationPostSend, setShowRegistrationPostSend] =
    useState(false);
  const [registrationData, setRegistrationData] = useState(
    initialRegistrationData,
  );
  const [registrationStep, setRegistrationStep] = useState(0);
  const registrationStepLabels = [
    "Identité",
    "Coordonnées",
    "Représentant légal",
    "Urgences",
    "Mobilité",
    "Engagement",
  ];

  const createRegistrationPdfBlob = async () => {
    const safe = (v) => (v || "").toString().trim();

    const normalize = (txt) =>
      (txt || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");

    const templateResponse = await fetch(
      "/forms/Fiche-Inscription-Transport-Seniors-BLR.pdf",
    );
    if (!templateResponse.ok) {
      throw new Error("Le PDF modèle est introuvable dans /public/forms.");
    }

    const templateBytes = await templateResponse.arrayBuffer();
    const pdfDoc = await PDFDocument.load(templateBytes);
    const form = pdfDoc.getForm();
    const allFields = form.getFields();

    if (!allFields.length) {
      throw new Error("Le PDF modèle n'est pas un formulaire remplissable.");
    }

    const indexedFields = allFields.map((field) => ({
      key: normalize(field.getName()),
      name: field.getName(),
    }));

    const findFieldName = (candidates) => {
      const normalizedCandidates = candidates.map(normalize);
      const exact = indexedFields.find((f) =>
        normalizedCandidates.includes(f.key),
      );
      if (exact) return exact.name;
      const contains = indexedFields.find((f) =>
        normalizedCandidates.some(
          (c) => f.key.includes(c) || c.includes(f.key),
        ),
      );
      return contains?.name || null;
    };

    const setTextByCandidates = (candidates, value) => {
      const fieldName = findFieldName(candidates);
      if (!fieldName) return;
      const textField = form.getTextField(fieldName);
      textField.setText(safe(value));
    };

    const setBoolByCandidates = (candidates, value) => {
      const fieldName = findFieldName(candidates);
      if (!fieldName) return;
      try {
        const checkbox = form.getCheckBox(fieldName);
        if (value) checkbox.check();
        else checkbox.uncheck();
        return;
      } catch (_) {}
      try {
        const textField = form.getTextField(fieldName);
        textField.setText(value ? "Oui" : "Non");
      } catch (_) {}
    };

    setTextByCandidates(
      ["beneficiaire1civilite", "civilite1"],
      registrationData.beneficiary1Title,
    );
    setTextByCandidates(
      ["beneficiaire1nom", "nom1"],
      registrationData.beneficiary1LastName,
    );
    setTextByCandidates(
      ["beneficiaire1prenom", "prenom1"],
      registrationData.beneficiary1FirstName,
    );
    setTextByCandidates(
      ["beneficiaire1datenaissance", "naissance1"],
      registrationData.beneficiary1BirthDate,
    );
    setTextByCandidates(
      ["beneficiaire2civilite", "civilite2"],
      registrationData.beneficiary2Title,
    );
    setTextByCandidates(
      ["beneficiaire2nom", "nom2"],
      registrationData.beneficiary2LastName,
    );
    setTextByCandidates(
      ["beneficiaire2prenom", "prenom2"],
      registrationData.beneficiary2FirstName,
    );
    setTextByCandidates(
      ["beneficiaire2datenaissance", "naissance2"],
      registrationData.beneficiary2BirthDate,
    );
    setTextByCandidates(
      ["securitesociale", "numerosecurite"],
      registrationData.socialSecurityNumber,
    );
    setTextByCandidates(["adresse1", "adresse"], registrationData.addressLine1);
    setTextByCandidates(
      ["adresse2", "complementadresse"],
      registrationData.addressLine2,
    );
    setTextByCandidates(["codepostal"], registrationData.postalCode);
    setTextByCandidates(["etage"], registrationData.floor);
    setTextByCandidates(["portable", "mobile"], registrationData.mobilePhone);
    setTextByCandidates(["telephone"], registrationData.homePhone);
    setTextByCandidates(["email", "mail"], registrationData.email);
    setBoolByCandidates(
      ["protectionjuridique", "representantlegalactif"],
      registrationData.hasLegalRepresentative,
    );
    setTextByCandidates(
      ["representantlegalnom"],
      registrationData.legalRepLastName,
    );
    setTextByCandidates(
      ["representantlegalprenom"],
      registrationData.legalRepFirstName,
    );
    setTextByCandidates(
      ["representantlegaladresse1"],
      registrationData.legalRepAddressLine1,
    );
    setTextByCandidates(
      ["representantlegaladresse2"],
      registrationData.legalRepAddressLine2,
    );
    setTextByCandidates(
      ["representantlegaltelephone"],
      registrationData.legalRepPhone,
    );
    setTextByCandidates(
      ["representantlegalemail"],
      registrationData.legalRepEmail,
    );
    setTextByCandidates(["urgence1nom"], registrationData.emergency1LastName);
    setTextByCandidates(
      ["urgence1prenom"],
      registrationData.emergency1FirstName,
    );
    setTextByCandidates(
      ["urgence1adresse1"],
      registrationData.emergency1AddressLine1,
    );
    setTextByCandidates(
      ["urgence1adresse2"],
      registrationData.emergency1AddressLine2,
    );
    setTextByCandidates(
      ["urgence1telephone"],
      registrationData.emergency1Phone,
    );
    setTextByCandidates(["urgence1email"], registrationData.emergency1Email);
    setTextByCandidates(["urgence1lien"], registrationData.emergency1Relation);
    setTextByCandidates(["urgence2nom"], registrationData.emergency2LastName);
    setTextByCandidates(
      ["urgence2prenom"],
      registrationData.emergency2FirstName,
    );
    setTextByCandidates(
      ["urgence2adresse1"],
      registrationData.emergency2AddressLine1,
    );
    setTextByCandidates(
      ["urgence2adresse2"],
      registrationData.emergency2AddressLine2,
    );
    setTextByCandidates(
      ["urgence2telephone"],
      registrationData.emergency2Phone,
    );
    setTextByCandidates(["urgence2email"], registrationData.emergency2Email);
    setTextByCandidates(["urgence2lien"], registrationData.emergency2Relation);
    setTextByCandidates(
      ["mobilite", "deplacements"],
      registrationData.mobilityType,
    );
    setBoolByCandidates(
      ["docjustificatifdomicile"],
      registrationData.docResidenceProof,
    );
    setBoolByCandidates(["doccarteidentite"], registrationData.docIdentityCard);
    setBoolByCandidates(["doccartevitale"], registrationData.docVitaleCard);
    setBoolByCandidates(
      ["docretraiteaspa"],
      registrationData.docRetirementOrASPA,
    );
    setBoolByCandidates(["docapa"], registrationData.docAPA);
    setBoolByCandidates(["docpch"], registrationData.docPCH);
    setBoolByCandidates(
      ["doccmi"],
      registrationData.docCMIPriorityOrInvalidity,
    );
    setBoolByCandidates(
      ["doccertificatmedical"],
      registrationData.docMedicalCertificate,
    );
    setBoolByCandidates(
      ["engagementreglement"],
      registrationData.engagementTransportRules,
    );
    setBoolByCandidates(
      ["attestationexactitude"],
      registrationData.attestAccuracy,
    );
    setTextByCandidates(["faitle", "date"], registrationData.signatureDate);
    setTextByCandidates(["signature"], registrationData.beneficiary1LastName);
    setTextByCandidates(
      ["informationscomplementaires", "notes"],
      registrationData.additionalNotes,
    );

    form.flatten();
    const filledBytes = await pdfDoc.save();
    return new Blob([filledBytes], { type: "application/pdf" });
  };

  const createFallbackRegistrationPdfBlob = async () => {
    try {
      const safe = (v) => (v || "").toString().trim();
      const yesNo = (v) => (v ? "OUI" : "NON");
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const colors = {
        primary: pdfRgb(16 / 255, 64 / 255, 40 / 255), // Emerald 900
        accent: pdfRgb(212 / 255, 175 / 255, 55 / 255), // Gold
        muted: pdfRgb(100 / 255, 116 / 255, 139 / 255), // Slate 500
        lightBg: pdfRgb(248 / 255, 250 / 255, 252 / 255), // Slate 50
        line: pdfRgb(226 / 255, 232 / 255, 240 / 255), // Slate 200
        text: pdfRgb(15 / 255, 23 / 255, 42 / 255), // Slate 900
      };

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 50;
      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - 40;

      const drawFooter = (p, pageNum) => {
        p.drawLine({
          start: { x: margin, y: 45 },
          end: { x: pageWidth - margin, y: 45 },
          thickness: 0.5,
          color: colors.line,
        });
        p.drawText("Association ASAD Bourg-la-Reine | 01 79 71 75 42", {
          x: margin,
          y: 30,
          size: 8,
          font: font,
          color: colors.muted,
        });
        p.drawText(`Page ${pageNum}`, {
          x: pageWidth - margin - 40,
          y: 30,
          size: 8,
          font: font,
          color: colors.muted,
        });
      };

      const ensureSpace = (need = 40) => {
        if (y - need < 60) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - 60;
          drawFooter(page, pdfDoc.getPageCount());
        }
      };

      const drawHeader = () => {
        page.drawRectangle({
          x: 0,
          y: pageHeight - 110,
          width: pageWidth,
          height: 110,
          color: colors.primary,
        });

        page.drawText("ASAD BOURG-LA-REINE", {
          x: margin,
          y: pageHeight - 60,
          size: 16,
          font: boldFont,
          color: pdfRgb(1, 1, 1),
        });

        page.drawText("Service La Reinette - Transport Seniors", {
          x: margin,
          y: pageHeight - 80,
          size: 11,
          font: font,
          color: pdfRgb(0.9, 0.9, 0.9),
        });

        const todayStr = new Date().toLocaleDateString("fr-FR");
        page.drawText(`DOSSIER D'INSCRIPTION`, {
          x: pageWidth - margin - 180,
          y: pageHeight - 60,
          size: 14,
          font: boldFont,
          color: pdfRgb(1, 1, 1),
        });

        page.drawText(`Édité le : ${todayStr}`, {
          x: pageWidth - margin - 180,
          y: pageHeight - 80,
          size: 10,
          font: font,
          color: pdfRgb(0.85, 0.85, 0.85),
        });

        y = pageHeight - 140;
      };

      const section = (title) => {
        ensureSpace(50);
        y -= 10;
        page.drawRectangle({
          x: margin,
          y: y - 20,
          width: pageWidth - margin * 2,
          height: 25,
          color: colors.lightBg,
        });
        page.drawLine({
          start: { x: margin, y: y - 20 },
          end: { x: margin + 30, y: y - 20 },
          thickness: 3,
          color: colors.accent,
        });
        page.drawText(title.toUpperCase(), {
          x: margin + 10,
          y: y - 13,
          size: 11,
          font: boldFont,
          color: pdfRgb(0.02, 0.3, 0.23),
        });
        y -= 35;
      };

      const row = (label, value) => {
        ensureSpace(25);
        page.drawText(label, {
          x: margin + 5,
          y: y,
          size: 9,
          font: boldFont,
          color: colors.muted,
        });
        page.drawText(safe(value) || "-", {
          x: margin + 180,
          y: y,
          size: 10,
          font: font,
          color: colors.text,
        });
        page.drawLine({
          start: { x: margin, y: y - 8 },
          end: { x: pageWidth - margin, y: y - 8 },
          thickness: 0.5,
          color: colors.line,
        });
        y -= 25;
      };

      const grid = (items) => {
        ensureSpace(30);
        const colWidth = (pageWidth - margin * 2) / 2;
        items.forEach((item, idx) => {
          const xPos = margin + 5 + (idx % 2) * colWidth;
          page.drawText(item.label, {
            x: xPos,
            y: y,
            size: 8,
            font: boldFont,
            color: colors.muted,
          });
          page.drawText(safe(item.value) || "-", {
            x: xPos + 85,
            y: y,
            size: 9,
            font: font,
            color: colors.text,
          });
        });
        page.drawLine({
          start: { x: margin, y: y - 8 },
          end: { x: pageWidth - margin, y: y - 8 },
          thickness: 0.5,
          color: colors.line,
        });
        y -= 25;
      };

      drawHeader();

      section("Informations Bénéficiaires");
      grid([
        { label: "Civilité (1)", value: registrationData.beneficiary1Title },
        {
          label: "Identité (1)",
          value: `${registrationData.beneficiary1FirstName} ${registrationData.beneficiary1LastName}`,
        },
      ]);
      grid([
        { label: "Né(e) le", value: registrationData.beneficiary1BirthDate },
        { label: "N° Sécu", value: registrationData.socialSecurityNumber },
      ]);

      if (registrationData.beneficiary2LastName) {
        y -= 10;
        grid([
          { label: "Civilité (2)", value: registrationData.beneficiary2Title },
          {
            label: "Identité (2)",
            value: `${registrationData.beneficiary2FirstName} ${registrationData.beneficiary2LastName}`,
          },
        ]);
        row("Né(e) le (2)", registrationData.beneficiary2BirthDate);
      }

      section("Détails de Contact");
      row("Adresse Principale", registrationData.addressLine1);
      if (registrationData.addressLine2)
        row("Complément", registrationData.addressLine2);
      grid([
        { label: "Code Postal", value: registrationData.postalCode },
        { label: "Étage / Appt", value: registrationData.floor },
      ]);
      grid([
        { label: "Téléphone Fixe", value: registrationData.homePhone },
        { label: "Mobile", value: registrationData.mobilePhone },
      ]);
      row("Adresse Courriel", registrationData.email);

      section("Dispositif de Protection");
      row(
        "Mesure de protection",
        registrationData.hasLegalRepresentative
          ? "OUI (Sous protection juridique)"
          : "NON",
      );
      if (registrationData.hasLegalRepresentative) {
        row(
          "Nom du Gérant/Représentant",
          `${registrationData.legalRepFirstName} ${registrationData.legalRepLastName}`,
        );
        row(
          "Contact Représentant",
          `${registrationData.legalRepPhone} | ${registrationData.legalRepEmail}`,
        );
      }

      section("Personnes à contacter en priorité");
      row(
        "Urgence 1",
        `${registrationData.emergency1FirstName} ${registrationData.emergency1LastName} (${registrationData.emergency1Relation})`,
      );
      row("Contact Urgence 1", `${registrationData.emergency1Phone}`);

      section("Évaluation de la Mobilité");
      row("Profil de mobilité", registrationData.mobilityType);
      const aids = [
        registrationData.aidWalker && "Déambulateur",
        registrationData.aidTransferChair && "Fauteuil de transfert",
        registrationData.aidTripodCane && "Canne tripode",
        registrationData.aidQuadripodCane && "Canne quadripode",
        registrationData.aidSimpleCane && "Canne simple",
        registrationData.aidCrutch && "Béquille",
      ]
        .filter(Boolean)
        .join(", ");
      row("Aide(s) matérielle(s)", aids || "Aucune");

      section("Consentements et Validation");
      row(
        "Engagement Règlement",
        yesNo(registrationData.engagementTransportRules),
      );
      row("Attestation Exactitude", yesNo(registrationData.attestAccuracy));
      row("Date de Signature", registrationData.signatureDate);

      const pages = pdfDoc.getPages();
      pages.forEach((p, idx) => drawFooter(p, idx + 1));

      const bytes = await pdfDoc.save();
      return new Blob([bytes], { type: "application/pdf" });
    } catch (err) {
      console.error("Erreur PDF:", err);
      throw err;
    }
  };

  const createRegistrationDocxBlob = async () => {
    const safe = (v) => (v || "").toString().trim() || "-";
    const yesNo = (v) => (v ? "Oui" : "Non");
    const line = (label, value) =>
      new Paragraph({
        children: [
          new TextRun({ text: `${label}: `, bold: true }),
          new TextRun({ text: `${value}` }),
        ],
        spacing: { after: 120 },
      });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "FORMULAIRE D'INSCRIPTION - LA REINETTE",
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: { after: 200 },
            }),
            line("Date du formulaire", new Date().toLocaleDateString("fr-FR")),
            line(
              "Beneficiaire 1 - Civilite",
              safe(registrationData.beneficiary1Title),
            ),
            line(
              "Beneficiaire 1 - Nom",
              safe(registrationData.beneficiary1LastName),
            ),
            line(
              "Beneficiaire 1 - Prenom",
              safe(registrationData.beneficiary1FirstName),
            ),
            line(
              "Beneficiaire 1 - Date de naissance",
              safe(registrationData.beneficiary1BirthDate),
            ),
            line(
              "Beneficiaire 2 - Civilite",
              safe(registrationData.beneficiary2Title),
            ),
            line(
              "Beneficiaire 2 - Nom",
              safe(registrationData.beneficiary2LastName),
            ),
            line(
              "Beneficiaire 2 - Prenom",
              safe(registrationData.beneficiary2FirstName),
            ),
            line(
              "Beneficiaire 2 - Date de naissance",
              safe(registrationData.beneficiary2BirthDate),
            ),
            line(
              "N degre de Securite Sociale",
              safe(registrationData.socialSecurityNumber),
            ),
            line(
              "Adresse",
              `${safe(registrationData.addressLine1)} ${safe(registrationData.addressLine2)}`.trim(),
            ),
            line("Code postal", safe(registrationData.postalCode)),
            line("Etage", safe(registrationData.floor)),
            line("Portable", safe(registrationData.mobilePhone)),
            line("Telephone", safe(registrationData.homePhone)),
            line("Email", safe(registrationData.email)),
            line(
              "Sous mesure de protection juridique",
              yesNo(registrationData.hasLegalRepresentative),
            ),
            line(
              "Representant legal - Nom",
              safe(registrationData.legalRepLastName),
            ),
            line(
              "Representant legal - Prenom",
              safe(registrationData.legalRepFirstName),
            ),
            line(
              "Representant legal - Adresse",
              `${safe(registrationData.legalRepAddressLine1)} ${safe(registrationData.legalRepAddressLine2)}`.trim(),
            ),
            line(
              "Representant legal - Telephone",
              safe(registrationData.legalRepPhone),
            ),
            line(
              "Representant legal - Email",
              safe(registrationData.legalRepEmail),
            ),
            line(
              "Urgence 1",
              `${safe(registrationData.emergency1FirstName)} ${safe(registrationData.emergency1LastName)} - ${safe(registrationData.emergency1Phone)}`,
            ),
            line(
              "Urgence 2",
              `${safe(registrationData.emergency2FirstName)} ${safe(registrationData.emergency2LastName)} - ${safe(registrationData.emergency2Phone)}`,
            ),
            line("Mobilite", safe(registrationData.mobilityType)),
            line(
              "Justificatif domicile",
              yesNo(registrationData.docResidenceProof),
            ),
            line("Carte identite", yesNo(registrationData.docIdentityCard)),
            line("Carte vitale", yesNo(registrationData.docVitaleCard)),
            line(
              "Retraite/ASPA/Pension invalidite",
              yesNo(registrationData.docRetirementOrASPA),
            ),
            line("Notification APA", yesNo(registrationData.docAPA)),
            line("Notification PCH", yesNo(registrationData.docPCH)),
            line(
              "CMI Priorite/Invalidite",
              yesNo(registrationData.docCMIPriorityOrInvalidity),
            ),
            line(
              "Certificat medical",
              yesNo(registrationData.docMedicalCertificate),
            ),
            line(
              "Engagement reglement transport",
              yesNo(registrationData.engagementTransportRules),
            ),
            line(
              "Attestation exactitude",
              yesNo(registrationData.attestAccuracy),
            ),
            line("Fait le", safe(registrationData.signatureDate)),
            line("Signature", safe(registrationData.beneficiary1LastName)),
            line(
              "Informations complementaires",
              safe(registrationData.additionalNotes),
            ),
          ],
        },
      ],
    });

    return Packer.toBlob(doc);
  };

  const createRegistrationDocxWithPythonBlob = async () => {
    const response = await fetch(`${PY_DOCX_API_URL}/generate-docx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      let detail = `Erreur API Python (${response.status})`;
      try {
        const data = await response.json();
        if (data?.detail) detail = data.detail;
      } catch (_) {}
      throw new Error(detail);
    }

    return response.blob();
  };

  const createRequiredDocumentsPdfBlob = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const { contact } = settings;
    const addressLine = [contact?.address, contact?.city]
      .filter(Boolean)
      .join(", ");
    const email = contact?.formRecipientEmail || contact?.email || "";
    const phone = contact?.logisticsPhone || contact?.standardPhone || "";

    let y = 790;
    const left = 50;
    const maxWidth = 495;
    const lineHeight = 22;

    const drawWrapped = (text, size, useFont, gap = lineHeight) => {
      if (!text) return;
      const words = text.split(" ");
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (useFont.widthOfTextAtSize(test, size) > maxWidth && line) {
          page.drawText(line, { x: left, y, size, font: useFont });
          y -= gap;
          line = word;
        } else {
          line = test;
        }
      }
      if (line) {
        page.drawText(line, { x: left, y, size, font: useFont });
        y -= gap;
      }
    };

    drawWrapped(REGISTRATION_DOCUMENTS_TITLE, 14, bold, 28);
    drawWrapped(REGISTRATION_DOCUMENTS_AGE_GROUP, 12, bold, 26);

    getRegistrationDocumentsPdfLines().forEach((line) => {
      if (y < 80) return;
      if (!line) {
        y -= 10;
        return;
      }
      drawWrapped(line, 11, font, 20);
    });

    y -= 6;
    drawWrapped(
      "Pour finaliser votre inscription : ramenez ces documents à l'ASAD" +
        (addressLine ? ` (${addressLine})` : "") +
        (email ? ` ou envoyez-les par e-mail à ${email}` : "") +
        ".",
      11,
      font,
      20,
    );

    if (phone && y > 60) {
      drawWrapped(`Contact : ${phone}`, 11, bold, 20);
    }

    const bytes = await pdfDoc.save();
    return new Blob([bytes], { type: "application/pdf" });
  };

  const handleDownloadRequiredDocuments = async () => {
    try {
      setIsDownloadingRequiredDocs(true);
      const blob = await createRequiredDocumentsPdfBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Pieces-justificatives-inscription-ASAD.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Liste des documents téléchargée.", "success");
    } catch (e) {
      console.error(e);
      showToast("Impossible de générer le PDF des documents.", "error");
    } finally {
      setIsDownloadingRequiredDocs(false);
    }
  };

  const handleRegistrationSubmit = async () => {
    if (
      !registrationData.beneficiary1LastName ||
      !registrationData.beneficiary1FirstName ||
      !registrationData.addressLine1 ||
      !registrationData.mobilePhone ||
      !registrationData.email ||
      !registrationData.engagementTransportRules ||
      !registrationData.attestAccuracy
    ) {
      showToast(
        "Veuillez remplir les champs obligatoires (bénéficiaire, coordonnées, engagements).",
        "error",
      );
      return;
    }

    setIsSubmittingRegistration(true);

    try {
      try {
        const subject = `[INSCRIPTION] ${registrationData.beneficiary1LastName} ${registrationData.beneficiary1FirstName}`;
        const backupMessage = [
          `Nom: ${registrationData.beneficiary1LastName}`,
          `Prénom: ${registrationData.beneficiary1FirstName}`,
          `Tél: ${registrationData.mobilePhone}`,
          `Adresse: ${registrationData.addressLine1}, ${registrationData.postalCode}`,
        ].join("\n");
        await supabase.from("contacts").insert([
          {
            email: registrationData.email,
            subject,
            message: backupMessage,
          },
        ]);
      } catch (dbError) {
        console.warn(
          "Sauvegarde Supabase inscription (non bloquant):",
          dbError,
        );
      }

      const notify = await sendRegistrationNotification(
        registrationData,
        settings,
      );

      if (notify.ok) {
        handleRegistrationSuccess();
        return;
      }

      console.error("Notification inscription échouée:", notify.error);
      handleRegistrationSuccess();
      showToast(
        "Votre inscription est enregistrée. L'envoi automatique de l'e-mail à l'équipe a échoué — vous pouvez aussi envoyer vos documents par e-mail à l'ASAD.",
        "warning",
      );
    } catch (e) {
      console.error("Submission error:", e);
      showToast(
        "Une erreur technique est survenue. Réessayez ou contactez l'ASAD au 01 79 71 75 42.",
        "error",
      );
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  const handleRegistrationSuccess = () => {
    showToast("Inscription envoyée avec succès !", "success");
    setShowRegistrationPostSend(true);
    setRegistrationStep(0);
  };

  const fetchSuggestions = async (query, field) => {
    if (!query || query.length < 3) {
      setSuggestions((prev) => ({ ...prev, [field]: [] }));
      setShowSuggestions((prev) => ({ ...prev, [field]: false }));
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=fr&addressdetails=1`,
      );
      const data = await response.json();
      setSuggestions((prev) => ({ ...prev, [field]: data }));
      setShowSuggestions((prev) => ({ ...prev, [field]: data.length > 0 }));
    } catch (error) {
      console.error("Erreur Suggestions:", error);
    }
  };

  const handleSuggestionClick = (field, s) => {
    setFormData((prev) => ({ ...prev, [field]: s.display_name }));
    setShowSuggestions((prev) => ({ ...prev, [field]: false }));
  };

  // Debounce simple pour la recherche (Désactivé)
  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.departure.length >= 3) fetchSuggestions(formData.departure, 'departure');
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.departure]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.destination.length >= 3) fetchSuggestions(formData.destination, 'destination');
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.destination]);
  */

  const today = new Date().toISOString().split("T")[0];

  // 🚀 Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, registrationStep]);

  useEffect(() => {
    if (!showRegistrationPostSend) return;
    const t = window.setTimeout(() => {
      document
        .getElementById("registration-docs-title")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => window.clearTimeout(t);
  }, [showRegistrationPostSend]);

  useEffect(() => {
    if (step === 2) setRegistrationStep(0);
  }, [step]);

  useEffect(() => {
    if (isSettingsLoading) return;
    const mode = searchParams.get("mode");
    if (mode === "inscription") {
      setShowRegistrationPostSend(false);
      setStep(2);
    } else if (
      mode === "reservation" ||
      mode === "trajet" ||
      mode === "reserver"
    ) {
      setStep(1);
    }
  }, [isSettingsLoading, searchParams]);

  const validateRegistrationSubStep = (subStep) => {
    const result = validateRegistrationSubStepPure(subStep, registrationData);
    if (!result.valid) {
      showToast(result.message, "error");
      alert(result.message);
      return false;
    }
    return true;
  };

  const currentPrice = calculateTransportPrice({
    departure: formData.departure,
    destination: formData.destination,
    tripType: formData.tripType,
  });

  const handleCCAS = (registered) => {
    setShowRegistrationPostSend(false);
    if (registered) {
      setStep(1);
    } else {
      setStep(2);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Numeric filtering for phone
    if (name === "phone") {
      const filtered = value.replace(/[^\d\s.+()-]/g, "");
      setFormData((prev) => ({ ...prev, [name]: filtered }));

      if (filtered && !validatePhone(filtered)) {
        setFormErrors((prev) => ({
          ...prev,
          phone: "Le numéro doit comporter 10 chiffres.",
        }));
      } else {
        setFormErrors((prev) => {
          const newErr = { ...prev };
          delete newErr.phone;
          return newErr;
        });
      }
      return;
    }

    if (name === "email") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (value && !validateEmail(value)) {
        setFormErrors((prev) => ({
          ...prev,
          email: "Format d'email invalide.",
        }));
      } else {
        setFormErrors((prev) => {
          const newErr = { ...prev };
          delete newErr.email;
          return newErr;
        });
      }
      return;
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-calculate return time if appointment time or duration changes
      if (name === "time" || name === "appointmentDuration") {
        const startTime = name === "time" ? value : prev.time;
        const duration =
          name === "appointmentDuration" ? value : prev.appointmentDuration;
        const computed = computeReturnPickupTime(startTime, duration);
        if (computed) newData.returnPickupTime = computed;
      }
      return newData;
    });
  };

  const checkAddressExists = async (address) => {
    // Si l'adresse est extrêmement détaillée (longue), elle contient probablement déjà des infos précises.
    // On évite de bloquer l'utilisateur si Nominatim est trop strict.
    if (address.length > 60) return true;

    try {
      // Nettoyage de base
      const cleanAddress = address
        .replace(/france métropolitaine/gi, "France")
        .replace(/, france/gi, "")
        .trim();

      const query = `${cleanAddress}, France`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) return true;

      // Fallback 1: Essayer sans le code postal si présent à la fin
      const withoutZip = cleanAddress.replace(/\s\d{5}$/, "");
      if (withoutZip !== cleanAddress) {
        const resp2 = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(withoutZip + ", France")}&format=json&limit=1`,
        );
        const data2 = await resp2.json();
        if (data2 && data2.length > 0) return true;
      }

      // Fallback 2: Essayer uniquement la première partie de l'adresse (rue)
      const firstPart = cleanAddress.split(",")[0];
      if (firstPart && firstPart !== cleanAddress) {
        const resp3 = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(firstPart + ", France")}&format=json&limit=1`,
        );
        const data3 = await resp3.json();
        return data3 && data3.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Erreur validation adresse:", error);
      return true; // En cas de pépin réseau/API, on ne bloque pas l'utilisateur
    }
  };

  const handleNextToSummary = async (e) => {
    e.preventDefault();

    const scheduleCheck = validateTripSchedule({
      time: formData.time,
      pickupTime: formData.pickupTime,
      returnPickupTime: formData.returnPickupTime,
      tripType: formData.tripType,
    });
    if (!scheduleCheck.valid) {
      const msg =
        scheduleCheck.message === "Horaire hors plage 08h00–19h00"
          ? "⚠️ Le service fonctionne uniquement entre 08h00 et 19h00. Veuillez choisir un horaire valide."
          : scheduleCheck.message.includes("prise en charge")
            ? "⚠️ L'heure de prise en charge (Aller) doit impérativement être AVANT l'heure du rendez-vous."
            : "⚠️ L'heure de retour doit être APRÈS l'heure du rendez-vous.";
      showToast(msg, "error");
      return;
    }

    if (isWeekendDate(formData.date)) {
      showToast(
        "⚠️ Les réservations ne sont pas disponibles le samedi et le dimanche. Veuillez choisir un jour de semaine.",
        "error",
      );
      return;
    }

    if (areAddressesIdentical(formData.departure, formData.destination)) {
      showToast(
        "⚠️ L'adresse de départ et de destination ne peuvent pas être identiques.",
        "error",
      );
      return;
    }

    setIsSubmitting(true);

    // Validation intelligente des adresses
    const [depExists, destExists] = await Promise.all([
      checkAddressExists(formData.departure),
      checkAddressExists(formData.destination),
    ]);

    if (!depExists) {
      setIsSubmitting(false);
      showToast(
        `⚠️ Nous n'avons pas pu localiser précisément l'adresse de départ. Veuillez vérifier l'orthographe ou être plus précis.`,
        "warning",
      );
      if (formData.departure.length < 20) return;
    }

    if (!destExists) {
      setIsSubmitting(false);
      showToast(
        `⚠️ Nous n'avons pas pu localiser précisément la destination. Veuillez vérifier l'orthographe ou le code postal.`,
        "warning",
      );
      if (formData.destination.length < 20) return;
    }

    setIsSubmitting(false);
    setStep(4);
  };

  const handleSubmit = async () => {
    // 🛡️ PROTECTION ANTI-SPAM (Honeypot + Vitesse)
    if (isContactSpam({ website: formData.website, formStartTime })) {
      console.warn("Spam détecté (Réservation).");
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(5); // Fait croire à la réussite
      }, 1500);
      return;
    }

    setIsSubmitting(true);
    const finalPrice = calculateTransportPrice({
      departure: formData.departure,
      destination: formData.destination,
      tripType: formData.tripType,
    });
    const flyerPublicUrl = `${window.location.origin}/forms/Depliant-publicitaire-ASAD.pdf`;

    try {
      const sanitizedName = DOMPurify.sanitize(formData.name);
      const sanitizedTitle = DOMPurify.sanitize(formData.title);
      const fullDisplayName = `${sanitizedTitle} ${sanitizedName}`.trim();

      const sanitizedPhone = DOMPurify.sanitize(formData.phone);
      const sanitizedMotifAutre =
        formData.motif === "Autre"
          ? DOMPurify.sanitize(formData.motifAutre)
          : "";
      const sanitizedDeparture = DOMPurify.sanitize(formData.departure);
      const sanitizedDestination = DOMPurify.sanitize(formData.destination);

      await supabase.from("reservations").insert([
        {
          name: fullDisplayName,
          phone: sanitizedPhone,
          email: formData.email,
          trip_type: formData.tripType,
          departure: sanitizedDeparture,
          destination: sanitizedDestination,
          motif:
            formData.motif === "Autre" ? sanitizedMotifAutre : formData.motif,
          appointment_date: formData.date,
          appointment_time: formData.time,
          pickup_time: formData.pickupTime,
          return_time:
            formData.tripType === "Aller-Retour"
              ? formData.returnPickupTime
              : null,
          estimated_price: 0,
        },
      ]);
    } catch (e) {
      console.error("Erreur de sauvegarde Supabase", e);
    }

    const labels = emailTemplates?.labels || {};
    const emailSubject = `RÉSERVATION - ${formData.title} ${formData.name}`;

    const emailData = {
      [emailSubject]: "---",
      [labels.clientName || "Nom du Client"]:
        `${formData.title} ${formData.name}`,
      [labels.phone || "Téléphone"]: formData.phone,

      [labels.itineraireHeader || "--- 🗺️ ITINÉRAIRE ---"]: "",
      [labels.tripType || "Type de Trajet"]: formData.tripType,
      [labels.departure || "Départ"]: formData.departure,
      [labels.destination || "Destination"]: formData.destination,
      [labels.motif || "Motif"]:
        formData.motif === "Autre" ? formData.motifAutre : formData.motif,

      [labels.horairesHeader || "--- ⏱️ HORAIRES ---"]: "",
      [labels.date || "Date Aller"]: formData.date,
      [labels.appointmentTime || "Heure du RDV"]: formData.time,
      [labels.pickupAller || "Prise en charge Aller"]: formData.pickupTime,
      [labels.duration || "Durée estimée RDV"]:
        formData.appointmentDuration || "Non spécifié",
      [labels.dateRetour || "Date Retour"]:
        formData.tripType === "Aller-Retour"
          ? formData.returnDate || formData.date
          : "N/A",
      [labels.pickupRetour || "Prise en charge Retour"]:
        formData.tripType === "Aller-Retour"
          ? formData.returnPickupTime
          : "N/A",

      [labels.estimationHeader || "--- 💰 ESTIMATION ---"]: "",
      [labels.price || "Montant estimé"]: "À confirmer par téléphone",
      [labels.payment || "Paiement"]:
        labels.paymentValue || "Chèque uniquement (à l'ordre de l'ASAD)",

      [labels.noteHeader || "--- 📝 NOTE ---"]: "",
      [labels.conclusionHeader || "Message de conclusion"]:
        emailTemplates?.bookingFooter || "Merci de traiter cette demande.",
    };

    const finalEmailData = {
      [labels.introHeader || "MESSAGE D'INTRODUCTION"]:
        emailTemplates?.bookingIntro ||
        "Une nouvelle réservation a été effectuée.",
      ...emailData,
    };

    const { emailjs: emailjsConfig, contact } = settings;
    const reservationConfig = emailjsConfig?.reservation;
    const clientConfirmationConfig = emailjsConfig?.clientConfirmation;
    const reservationRecipient = contact?.formRecipientEmail || contact?.email;

    const sendClientConfirmation = async () => {
      if (!formData.email) return;

      const clientSubject = "Votre réservation est en cours de traitement";
      const clientHtml = `
        <div style="font-family: sans-serif; max-width: 620px;">
          <h2 style="color:#064e3b; margin-bottom: 12px;">Votre réservation est en cours de traitement</h2>
          <p style="margin: 0 0 12px;">
            Bonjour ${formData.title} ${formData.name},
          </p>
          <p style="margin: 0 0 12px;">
            Votre réservation est en cours de traitement.
          </p>
          <p style="margin: 0 0 12px;">
            Si vous voulez savoir plus sur l'ASAD, regardez le flyer qui est juste en bas :
          </p>
          <p style="margin: 0 0 16px;">
            <a href="${flyerPublicUrl}" target="_blank" rel="noopener noreferrer" style="color:#0f766e; font-weight:700;">
              Voir le flyer ASAD (PDF)
            </a>
          </p>
          <p style="margin: 0; color:#475569;">
            L'équipe de La Reinette
          </p>
        </div>
      `;

      const clientServiceId =
        clientConfirmationConfig?.serviceId || reservationConfig?.serviceId;
      const clientTemplateId =
        clientConfirmationConfig?.templateId || reservationConfig?.templateId;
      const clientPublicKey =
        clientConfirmationConfig?.publicKey || reservationConfig?.publicKey;

      if (clientServiceId && clientTemplateId && clientPublicKey) {
        await emailjs.send(
          clientServiceId,
          clientTemplateId,
          {
            to_email: formData.email,
            reply_to:
              contact?.formRecipientEmail ||
              contact?.email ||
              "lareinette@asad-bourg-la-reine.fr",
            from_name: "ASAD Bourg-la-Reine",
            subject: clientSubject,
            message_html: clientHtml,
            nom: formData.name,
            telephone: formData.phone,
            depart: formData.departure,
            destination: formData.destination,
            motif:
              formData.motif === "Autre" ? formData.motifAutre : formData.motif,
            date: formData.date,
            ...buildReservationScheduleVarsFromForm(formData),
            prix: finalPrice + " €",
            type: formData.tripType,
            note_admin: "Confirmation client",
            message: `Votre réservation est en cours de traitement. Flyer: ${flyerPublicUrl}`,
          },
          clientPublicKey,
        );
      } else {
        await fetch(`https://formsubmit.co/ajax/${reservationRecipient}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: clientSubject,
            _cc: formData.email,
            _template: "table",
            message: `Votre réservation est en cours de traitement.\n\nSi vous voulez savoir plus sur l'ASAD, regardez le flyer: ${flyerPublicUrl}`,
            to_email: formData.email,
          }),
        });
      }
    };

    try {
      if (
        reservationConfig?.serviceId &&
        reservationConfig?.templateId &&
        reservationConfig?.publicKey
      ) {
        // Prepare HTML version for the template
        const htmlTable = `
          <div style="font-family: sans-serif; max-width: 600px;">
            <h2 style="color: #064e3b;">${finalEmailData[labels.introHeader || "MESSAGE D'INTRODUCTION"]}</h2>
            <p>${emailTemplates?.bookingIntro}</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              ${Object.entries(emailData)
                .map(
                  ([key, value]) => `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #064e3b;">${key}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${value || "-"}</td>
                </tr>
              `,
                )
                .join("")}
            </table>
            <p style="font-style: italic; color: #666;">${emailTemplates?.bookingFooter}</p>
          </div>
        `;

        await emailjs.send(
          reservationConfig.serviceId,
          reservationConfig.templateId,
          {
            to_email: contact.formRecipientEmail || contact.email,
            from_name: `${formData.title} ${formData.name}`,
            subject: emailSubject,
            message_html: htmlTable,
            // Individual variables
            nom: `${formData.title} ${formData.name}`,
            telephone: formData.phone,
            depart: formData.departure,
            destination: formData.destination,
            motif:
              formData.motif === "Autre" ? formData.motifAutre : formData.motif,
            date: formData.date,
            ...buildReservationScheduleVarsFromForm(formData),
            prix: finalPrice + " €",
            type: formData.tripType,
            note_admin: emailTemplates?.bookingFooter,
            message: JSON.stringify(finalEmailData, null, 2),
          },
          reservationConfig.publicKey,
        );

        try {
          await sendClientConfirmation();
        } catch (clientEmailError) {
          console.warn("Envoi email client impossible:", clientEmailError);
        }

        trackReservation(formData.destination);
        setStep(3);
      } else {
        // Fallback to FormSubmit if EmailJS is not configured
        const response = await fetch(
          `https://formsubmit.co/ajax/${contact.formRecipientEmail || contact.email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(finalEmailData),
          },
        );

        if (response.ok) {
          try {
            await sendClientConfirmation();
          } catch (clientEmailError) {
            console.warn("Envoi email client impossible:", clientEmailError);
          }
          trackReservation(formData.destination);
          setStep(3);
        } else {
          showToast(
            "Une erreur est survenue lors de l'envoi de votre demande.",
            "error",
          );
        }
      }
    } catch (error) {
      console.error(error);
      showToast(
        "Une erreur est survenue lors de l'envoi de votre demande.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const labelStyle = {
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    color: "#000",
    fontSize: "0.65rem",
    textTransform: "uppercase",
    letterSpacing: "3px",
    marginBottom: "1.2rem",
    opacity: 0.4,
  };

  const inputStyle = {
    padding: "1.2rem 1.5rem",
    borderRadius: "12px",
    border: "1px solid #f0f0f0",
    background: "#fff",
    fontSize: "1.05rem",
    outline: "none",
    width: "100%",
    transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
    fontFamily: "inherit",
    color: "#000",
    fontWeight: 500,
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
  };

  const SectionTitle = ({ label, title, subtitle }) => (
    <div className="booking-section-title">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="booking-section-label"
      >
        {label}
      </motion.span>
      <h1 className="booking-section-h1">
        {title}{" "}
        {subtitle && (
          <span className="booking-section-subtitle">{subtitle}</span>
        )}
      </h1>
    </div>
  );

  if (isSettingsLoading) {
    return (
      <>
        <SEO
          title="Réservation"
          description="Réservez votre trajet avec La Reinette. Transport pour seniors à Bourg-la-Reine."
        />
        <div className="booking-page booking-page--loading">
          <div
            className="container booking-container"
            style={{ padding: "6rem 1rem", textAlign: "center" }}
          >
            <p style={{ fontSize: "1.15rem", color: "var(--text-muted)" }}>
              Chargement du formulaire…
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Réservation"
        description="Réservez votre trajet avec La Reinette. Transport pour seniors à Bourg-la-Reine."
      />
      <div className="booking-page">
        <div className="container booking-container">
          <AnimatePresence mode="wait">
            {/* STEP 0: INITIAL QUESTION */}
            {step === 0 && (
              <motion.div
                key="step0"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="booking-step-wrap booking-step-wrap--center"
              >
                <SectionTitle
                  label="CONFORT & PONCTUALITÉ"
                  title="Oubliez l'attente du bus, voyagez en toute sérénité."
                />

                <div className="booking-choice-grid">
                  <motion.button
                    type="button"
                    whileHover={{ y: -5, background: "#fcfcfc" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCCAS(false)}
                    className="booking-choice-btn booking-choice-btn--light"
                  >
                    <div className="booking-choice-btn-inner">
                      <div className="booking-choice-icon booking-choice-icon--light">
                        <UserPlus size={24} />
                      </div>
                      <span>Inscription</span>
                    </div>
                    <ArrowRight size={24} />
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCCAS(true)}
                    className="booking-choice-btn booking-choice-btn--dark"
                  >
                    <div className="booking-choice-btn-inner">
                      <div className="booking-choice-icon booking-choice-icon--dark">
                        <CheckCircle2 size={24} />
                      </div>
                      <span>Réserver votre trajet</span>
                    </div>
                    <ArrowRight size={24} />
                  </motion.button>
                </div>

                <p className="booking-notice-text">
                  Le service La Reinette est réservé aux membres de
                  l'association habitant Bourg-la-Reine.
                </p>
              </motion.div>
            )}

            {/* STEP 1: FORM */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="booking-step-wrap"
              >
                <div className="booking-header-flex">
                  <SectionTitle
                    label="Réservation"
                    title="Détails du"
                    subtitle="trajet."
                  />
                  <motion.button
                    whileHover={{ x: -10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(0)}
                    type="button"
                    className="btn-back"
                  >
                    <ArrowLeft size={24} />
                    Retour
                  </motion.button>
                </div>

                <div className="booking-main-grid">
                  <div className="booking-form-stack">
                    <form
                      onSubmit={handleNextToSummary}
                      className="booking-form-inner"
                    >
                      <section className="booking-form-section">
                        <h4>
                          <User size={24} /> Passager
                        </h4>
                        <div className="booking-field-stack">
                          <div className="booking-field-group-2col">
                            <div>
                              <label style={labelStyle}>Civilité</label>
                              <select
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                style={inputStyle}
                              >
                                <option value="">---</option>
                                <option value="Monsieur">M.</option>
                                <option value="Madame">Mme</option>
                              </select>
                            </div>
                            <div>
                              <label style={labelStyle}>Nom & Prénom</label>
                              <input
                                required
                                name="name"
                                placeholder="Entrez votre nom"
                                value={formData.name}
                                onChange={handleInputChange}
                                style={{
                                  ...inputStyle,
                                  borderBottom: formErrors.name
                                    ? "2px solid #ef4444"
                                    : "1px solid #eee",
                                }}
                              />
                            </div>
                          </div>
                          <div className="booking-field-group-2col-equal">
                            <div>
                              <label style={labelStyle}>Téléphone</label>
                              <input
                                required
                                type="tel"
                                name="phone"
                                placeholder="06 00 00 00 00"
                                value={formData.phone}
                                onChange={handleInputChange}
                                style={{
                                  ...inputStyle,
                                  borderBottom: formErrors.phone
                                    ? "2px solid #ef4444"
                                    : "1px solid #eee",
                                }}
                              />
                            </div>
                            <div>
                              <label style={labelStyle}>E-mail</label>
                              <input
                                required
                                type="email"
                                name="email"
                                placeholder="votre@email.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                style={{
                                  ...inputStyle,
                                  borderBottom: formErrors.email
                                    ? "2px solid #ef4444"
                                    : "1px solid #eee",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="booking-form-section">
                        <h4>
                          <Navigation size={24} /> Itinéraire
                        </h4>
                        <div className="booking-field-stack">
                          <div style={{ position: "relative" }}>
                            <label style={labelStyle}>Départ</label>
                            <input
                              required
                              name="departure"
                              placeholder="D'où partez-vous ?"
                              value={formData.departure}
                              onChange={handleInputChange}
                              style={inputStyle}
                            />
                          </div>
                          <div style={{ position: "relative" }}>
                            <label style={labelStyle}>Destination</label>
                            <input
                              required
                              name="destination"
                              placeholder="Où allez-vous ?"
                              value={formData.destination}
                              onChange={handleInputChange}
                              style={inputStyle}
                            />
                          </div>
                        </div>
                      </section>
                      <section className="booking-form-section">
                        <h4>
                          <Clock size={24} /> Planification
                        </h4>
                        <div className="booking-field-stack">
                          <div className="booking-field-group-3col">
                            <div>
                              <label style={labelStyle}>Type de trajet</label>
                              <div className="booking-trip-type-row">
                                {["Aller Simple", "Aller-Retour"].map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() =>
                                      setFormData({ ...formData, tripType: t })
                                    }
                                    className="booking-trip-type-btn"
                                    style={{
                                      background:
                                        formData.tripType === t
                                          ? "#000"
                                          : "#fff",
                                      color:
                                        formData.tripType === t
                                          ? "#fff"
                                          : "#000",
                                    }}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label style={labelStyle}>Date du trajet</label>
                              <input
                                required
                                type="date"
                                name="date"
                                min={today}
                                value={formData.date}
                                onChange={handleInputChange}
                                style={inputStyle}
                              />
                            </div>
                            <div>
                              <label style={labelStyle}>Heure du RDV</label>
                              <input
                                required
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                style={inputStyle}
                              />
                            </div>
                          </div>

                          <div
                            className={
                              formData.tripType === "Aller-Retour"
                                ? "booking-field-group-2col-equal"
                                : ""
                            }
                          >
                            <div>
                              <label style={labelStyle}>
                                Heure de prise en charge (Aller)
                              </label>
                              <input
                                required
                                type="time"
                                name="pickupTime"
                                min="08:00"
                                max="19:00"
                                value={formData.pickupTime}
                                onChange={handleInputChange}
                                style={inputStyle}
                              />
                            </div>
                            {formData.tripType === "Aller-Retour" && (
                              <div>
                                <label style={labelStyle}>
                                  Durée estimée du RDV (Optionnel)
                                </label>
                                <select
                                  name="appointmentDuration"
                                  value={formData.appointmentDuration || ""}
                                  onChange={handleInputChange}
                                  style={inputStyle}
                                >
                                  <option value="">Non spécifié</option>
                                  <option value="30 min">30 min</option>
                                  <option value="1h">1h</option>
                                  <option value="1h30">1h30</option>
                                  <option value="2h">2h</option>
                                  <option value="plus">Plus de 2h</option>
                                </select>
                              </div>
                            )}
                          </div>

                          {formData.tripType === "Aller-Retour" && (
                            <div className="booking-field-group-2col-equal">
                              <div>
                                <label style={labelStyle}>
                                  Heure de retour prévue
                                </label>
                                <input
                                  required
                                  type="time"
                                  name="returnPickupTime"
                                  min="08:00"
                                  max="19:00"
                                  value={formData.returnPickupTime}
                                  onChange={handleInputChange}
                                  style={inputStyle}
                                />
                              </div>
                              <div>
                                <label style={labelStyle}>Date du retour</label>
                                <input
                                  required
                                  type="date"
                                  name="returnDate"
                                  min={formData.date || today}
                                  value={formData.returnDate || formData.date}
                                  onChange={handleInputChange}
                                  style={inputStyle}
                                />
                              </div>
                            </div>
                          )}

                          <div>
                            <label style={labelStyle}>
                              Motif du déplacement
                            </label>
                            <div className="booking-motif-grid">
                              {[
                                {
                                  id: "Médecin",
                                  label: "Santé",
                                  icon: Stethoscope,
                                },
                                {
                                  id: "Courses",
                                  label: "Courses",
                                  icon: ShoppingBag,
                                },
                                {
                                  id: "Loisirs",
                                  label: "Loisirs",
                                  icon: Users,
                                },
                                {
                                  id: "Administratif",
                                  label: "Administratif",
                                  icon: FileText,
                                },
                                {
                                  id: "Autre",
                                  label: "Autre",
                                  icon: MoreHorizontal,
                                },
                              ].map((item) => {
                                const Icon = item.icon;
                                return (
                                  <motion.button
                                    key={item.id}
                                    type="button"
                                    whileHover={{ y: -5, borderColor: "#000" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      setFormData({
                                        ...formData,
                                        motif: item.id,
                                      })
                                    }
                                    className={`booking-motif-btn ${formData.motif === item.id ? "is-active" : ""}`}
                                  >
                                    <Icon size={24} />
                                    <span>{item.label}</span>
                                  </motion.button>
                                );
                              })}
                            </div>
                            {formData.motif === "Autre" && (
                              <input
                                required
                                name="motifAutre"
                                placeholder="Précisez le motif"
                                value={formData.motifAutre}
                                onChange={handleInputChange}
                                style={{ ...inputStyle, marginTop: "1.5rem" }}
                              />
                            )}
                          </div>
                        </div>
                      </section>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        disabled={isSubmitting}
                        type="submit"
                        className="btn-submit-booking"
                      >
                        {isSubmitting ? "Validation..." : "Suivant"}
                      </motion.button>
                    </form>
                  </div>

                  {/* SIDEBAR */}
                  <div className="booking-sidebar">
                    <h5
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        marginBottom: "2rem",
                      }}
                    >
                      Votre trajet
                    </h5>
                    <div style={{ display: "grid", gap: "2rem" }}>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.7rem",
                            opacity: 0.5,
                            fontWeight: 800,
                          }}
                        >
                          DÉPART
                        </p>
                        <p style={{ margin: 0, fontWeight: 600 }}>
                          {formData.departure || "Non spécifié"}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.7rem",
                            opacity: 0.5,
                            fontWeight: 800,
                          }}
                        >
                          ARRIVÉE
                        </p>
                        <p style={{ margin: 0, fontWeight: 600 }}>
                          {formData.destination || "Non spécifié"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SUMMARY */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="booking-step-wrap booking-step-wrap--narrow"
              >
                <div
                  className="booking-header-flex"
                  style={{ marginBottom: "5rem" }}
                >
                  <SectionTitle
                    label="Vérification"
                    title="Confirmer ma"
                    subtitle="réservation."
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setStep(1)}
                    className="booking-back-circle"
                  >
                    <ArrowLeft size={28} />
                  </motion.button>
                </div>

                <div
                  className="booking-summary-card"
                  style={{
                    maxWidth: "700px",
                    margin: "0 auto",
                    borderRadius: "32px",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="booking-summary-header">
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        letterSpacing: "4px",
                        opacity: 0.6,
                        marginBottom: "1rem",
                      }}
                    >
                      RÉCAPITULATIF
                    </p>
                    <h2
                      style={{ fontSize: "2.5rem", fontWeight: 900, margin: 0 }}
                    >
                      Votre Trajet
                    </h2>
                  </div>

                  <div className="booking-summary-body">
                    <div
                      style={{
                        display: "grid",
                        gap: "2rem",
                        marginBottom: "5rem",
                      }}
                    >
                      {[
                        {
                          label: "Passager",
                          value: `${formData.title} ${formData.name}`,
                        },
                        { label: "Type", value: formData.tripType },
                        { label: "Départ", value: formData.departure },
                        { label: "Destination", value: formData.destination },
                        { label: "Date", value: formData.date },
                        { label: "Heure", value: formData.pickupTime },
                        ...(formData.tripType === "Aller-Retour"
                          ? [
                              {
                                label: "Durée RDV",
                                value:
                                  formData.appointmentDuration ||
                                  "Non spécifié",
                              },
                              {
                                label: "Retour",
                                value: formData.returnPickupTime,
                              },
                            ]
                          : []),
                        {
                          label: "Motif",
                          value:
                            formData.motif === "Autre"
                              ? formData.motifAutre
                              : formData.motif,
                        },
                      ].map((item, i) => (
                        <div key={i} className="booking-recap-row">
                          <span className="booking-recap-label">
                            {item.label}
                          </span>
                          <span className="booking-recap-value">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="registration-actions registration-actions--split">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        style={{
                          padding: "1.8rem",
                          background: "#fff",
                          border: "1px solid #eee",
                          borderRadius: "16px",
                          fontWeight: 800,
                          cursor: "pointer",
                          transition: "all 0.3s",
                        }}
                      >
                        Modifier
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{
                          padding: "1.8rem",
                          background: "#000",
                          color: "#fff",
                          border: "none",
                          borderRadius: "16px",
                          fontWeight: 900,
                          cursor: "pointer",
                          fontSize: "1.1rem",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        }}
                      >
                        {isSubmitting
                          ? "Envoi en cours..."
                          : "Confirmer le trajet"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="booking-step-wrap booking-step-wrap--success"
              >
                <div className="booking-success-card">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="booking-success-icon"
                  >
                    <CheckCircle2 size={60} />
                  </motion.div>

                  <h2 className="booking-success-title">C'est validé.</h2>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      color: "#666",
                      lineHeight: 1.6,
                      marginBottom: "5rem",
                      maxWidth: "500px",
                      margin: "0 auto 5rem",
                    }}
                  >
                    Votre demande est maintenant entre les mains de notre équipe
                    de coordination.
                  </p>

                  <div
                    style={{
                      background: "#fcfcfc",
                      padding: "3rem",
                      borderRadius: "24px",
                      border: "1px solid #eee",
                      textAlign: "left",
                      maxWidth: "500px",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "1.5rem",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          background: "#000",
                          color: "#fff",
                          padding: "0.8rem",
                          borderRadius: "12px",
                        }}
                      >
                        <Phone size={24} />
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "1.1rem",
                            fontWeight: 800,
                          }}
                        >
                          Prochaine étape
                        </p>
                        <p
                          style={{
                            margin: 0,
                            color: "#666",
                            fontSize: "0.95rem",
                          }}
                        >
                          Un conseiller vous appellera pour confirmer l'horaire
                          précis.
                        </p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (window.location.href = "/")}
                    className="booking-success-home-btn"
                  >
                    Retour au menu
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: REGISTRATION WIZARD */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="registration-container"
              >
                <div className="registration-header">
                  <div className="registration-header-row">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <h2
                        style={{
                          fontSize: "2.5rem",
                          fontWeight: 900,
                          color: "#000",
                          margin: 0,
                        }}
                      >
                        {showRegistrationPostSend
                          ? "Documents à fournir"
                          : "Inscription"}
                      </h2>
                      {showRegistrationPostSend ? (
                        <p
                          style={{
                            color: "#8c8479",
                            fontWeight: 600,
                            maxWidth: "36rem",
                          }}
                        >
                          Votre inscription est enregistrée. Voici la liste des
                          pièces à ramener ou à envoyer pour la finaliser.
                        </p>
                      ) : (
                        <p style={{ color: "#8c8479", fontWeight: 500 }}>
                          Étape {registrationStep + 1} sur{" "}
                          {registrationStepLabels.length}
                        </p>
                      )}
                    </div>
                    {!showRegistrationPostSend && (
                      <button
                        onClick={() => setStep(0)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          opacity: 0.3,
                        }}
                      >
                        <ArrowLeft size={30} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="registration-body">
                  {!showRegistrationPostSend ? (
                    <div style={{ display: "grid", gap: "4rem" }}>
                      <div
                        className="registration-step-indicator"
                        aria-label="Étapes du formulaire"
                      >
                        {registrationStepLabels.map((label, i) => (
                          <div key={label} className="registration-step-item">
                            <div
                              className={`registration-step-dot ${i === registrationStep ? "active" : ""}`}
                            />
                            <span className="registration-step-label-text">
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "grid", gap: "2.5rem" }}>
                        <h4
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 900,
                            opacity: 0.4,
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                          }}
                        >
                          {registrationStepLabels[registrationStep]}
                        </h4>

                        {registrationStep === 0 && (
                          <div className="registration-grid">
                            <div className="booking-field-group-2col-equal">
                              <div>
                                <label style={labelStyle}>Nom</label>
                                <input
                                  style={inputStyle}
                                  value={registrationData.beneficiary1LastName}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      beneficiary1LastName:
                                        e.target.value.toUpperCase(),
                                    })
                                  }
                                  placeholder="NOM"
                                />
                              </div>
                              <div>
                                <label style={labelStyle}>Prénom</label>
                                <input
                                  style={inputStyle}
                                  value={registrationData.beneficiary1FirstName}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      beneficiary1FirstName: e.target.value,
                                    })
                                  }
                                  placeholder="Prénom"
                                />
                              </div>
                            </div>
                            <div className="booking-field-group-2col-equal">
                              <div>
                                <label style={labelStyle}>
                                  Date de naissance
                                </label>
                                <input
                                  type="date"
                                  style={inputStyle}
                                  value={registrationData.beneficiary1BirthDate}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      beneficiary1BirthDate: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label style={labelStyle}>
                                  N° Sécurité Sociale
                                </label>
                                <input
                                  style={inputStyle}
                                  value={registrationData.socialSecurityNumber}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      socialSecurityNumber: e.target.value,
                                    })
                                  }
                                  placeholder="15 chiffres"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {registrationStep === 1 && (
                          <div style={{ display: "grid", gap: "2rem" }}>
                            <div>
                              <label style={labelStyle}>Adresse</label>
                              <input
                                style={inputStyle}
                                value={registrationData.addressLine1}
                                onChange={(e) =>
                                  setRegistrationData({
                                    ...registrationData,
                                    addressLine1: e.target.value,
                                  })
                                }
                                placeholder="N° et nom de rue"
                              />
                            </div>
                            <div className="booking-field-group-2col-equal">
                              <div>
                                <label style={labelStyle}>Code Postal</label>
                                <input
                                  style={inputStyle}
                                  value={registrationData.postalCode}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      postalCode: e.target.value,
                                    })
                                  }
                                  placeholder="92340"
                                />
                              </div>
                              <div>
                                <label style={labelStyle}>Téléphone</label>
                                <input
                                  style={inputStyle}
                                  value={registrationData.mobilePhone}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      mobilePhone: e.target.value,
                                    })
                                  }
                                  placeholder="06..."
                                />
                              </div>
                            </div>
                            <div>
                              <label style={labelStyle}>E-mail</label>
                              <input
                                type="email"
                                style={inputStyle}
                                value={registrationData.email}
                                onChange={(e) =>
                                  setRegistrationData({
                                    ...registrationData,
                                    email: e.target.value,
                                  })
                                }
                                placeholder="exemple@mail.com"
                              />
                            </div>
                          </div>
                        )}

                        {registrationStep === 2 && (
                          <div style={{ display: "grid", gap: "2rem" }}>
                            <div
                              style={{
                                background: "#f9fafb",
                                padding: "2rem",
                                borderRadius: "16px",
                                border: "1px solid #eee",
                              }}
                            >
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "1rem",
                                  cursor: "pointer",
                                  fontWeight: 700,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    registrationData.hasLegalRepresentative
                                  }
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      hasLegalRepresentative: e.target.checked,
                                    })
                                  }
                                  style={{ width: "20px", height: "20px" }}
                                />
                                Le bénéficiaire est sous protection juridique
                                (tuteur, curateur...)
                              </label>
                            </div>

                            {registrationData.hasLegalRepresentative && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ display: "grid", gap: "2rem" }}
                              >
                                <div className="booking-field-group-2col-equal">
                                  <div>
                                    <label style={labelStyle}>
                                      Nom du représentant
                                    </label>
                                    <input
                                      style={inputStyle}
                                      value={registrationData.legalRepLastName}
                                      onChange={(e) =>
                                        setRegistrationData({
                                          ...registrationData,
                                          legalRepLastName:
                                            e.target.value.toUpperCase(),
                                        })
                                      }
                                      placeholder="NOM"
                                    />
                                  </div>
                                  <div>
                                    <label style={labelStyle}>
                                      Prénom du représentant
                                    </label>
                                    <input
                                      style={inputStyle}
                                      value={registrationData.legalRepFirstName}
                                      onChange={(e) =>
                                        setRegistrationData({
                                          ...registrationData,
                                          legalRepFirstName: e.target.value,
                                        })
                                      }
                                      placeholder="Prénom"
                                    />
                                  </div>
                                </div>
                                <div className="booking-field-group-2col-equal">
                                  <div>
                                    <label style={labelStyle}>Téléphone</label>
                                    <input
                                      style={inputStyle}
                                      value={registrationData.legalRepPhone}
                                      onChange={(e) =>
                                        setRegistrationData({
                                          ...registrationData,
                                          legalRepPhone: e.target.value,
                                        })
                                      }
                                      placeholder="06..."
                                    />
                                  </div>
                                  <div>
                                    <label style={labelStyle}>E-mail</label>
                                    <input
                                      type="email"
                                      style={inputStyle}
                                      value={registrationData.legalRepEmail}
                                      onChange={(e) =>
                                        setRegistrationData({
                                          ...registrationData,
                                          legalRepEmail: e.target.value,
                                        })
                                      }
                                      placeholder="exemple@mail.com"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label style={labelStyle}>
                                    Adresse du représentant
                                  </label>
                                  <input
                                    style={inputStyle}
                                    value={
                                      registrationData.legalRepAddressLine1
                                    }
                                    onChange={(e) =>
                                      setRegistrationData({
                                        ...registrationData,
                                        legalRepAddressLine1: e.target.value,
                                      })
                                    }
                                    placeholder="N° et nom de rue"
                                  />
                                </div>
                              </motion.div>
                            )}
                            {!registrationData.hasLegalRepresentative && (
                              <p
                                style={{
                                  color: "#6b7280",
                                  fontStyle: "italic",
                                }}
                              >
                                Aucun représentant légal n'est déclaré. Vous
                                pouvez passer à l'étape suivante.
                              </p>
                            )}
                          </div>
                        )}

                        {registrationStep === 3 && (
                          <div style={{ display: "grid", gap: "3rem" }}>
                            <div className="registration-emergency-block">
                              <h5
                                style={{
                                  fontWeight: 800,
                                  marginBottom: "2rem",
                                }}
                              >
                                Contact d'urgence n°1 (Prioritaire)
                              </h5>
                              <div className="booking-field-group-2col-equal">
                                <div>
                                  <label style={labelStyle}>Nom</label>
                                  <input
                                    style={inputStyle}
                                    value={registrationData.emergency1LastName}
                                    onChange={(e) =>
                                      setRegistrationData({
                                        ...registrationData,
                                        emergency1LastName:
                                          e.target.value.toUpperCase(),
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <label style={labelStyle}>Prénom</label>
                                  <input
                                    style={inputStyle}
                                    value={registrationData.emergency1FirstName}
                                    onChange={(e) =>
                                      setRegistrationData({
                                        ...registrationData,
                                        emergency1FirstName: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div
                                className="booking-field-group-2col-equal"
                                style={{ marginTop: "2rem" }}
                              >
                                <div>
                                  <label style={labelStyle}>Téléphone</label>
                                  <input
                                    style={inputStyle}
                                    value={registrationData.emergency1Phone}
                                    onChange={(e) =>
                                      setRegistrationData({
                                        ...registrationData,
                                        emergency1Phone: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <label style={labelStyle}>
                                    Lien de parenté / Relation
                                  </label>
                                  <input
                                    style={inputStyle}
                                    value={registrationData.emergency1Relation}
                                    onChange={(e) =>
                                      setRegistrationData({
                                        ...registrationData,
                                        emergency1Relation: e.target.value,
                                      })
                                    }
                                    placeholder="Ex: Fils, Voisin..."
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="registration-emergency-block registration-emergency-block--muted">
                              <h5
                                style={{
                                  fontWeight: 800,
                                  marginBottom: "2rem",
                                  color: "#666",
                                }}
                              >
                                Contact d'urgence n°2 (Optionnel)
                              </h5>
                              <div className="booking-field-group-2col-equal">
                                <div>
                                  <label style={labelStyle}>Nom</label>
                                  <input
                                    style={inputStyle}
                                    value={registrationData.emergency2LastName}
                                    onChange={(e) =>
                                      setRegistrationData({
                                        ...registrationData,
                                        emergency2LastName:
                                          e.target.value.toUpperCase(),
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <label style={labelStyle}>Prénom</label>
                                  <input
                                    style={inputStyle}
                                    value={registrationData.emergency2FirstName}
                                    onChange={(e) =>
                                      setRegistrationData({
                                        ...registrationData,
                                        emergency2FirstName: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div
                                className="booking-field-group-2col-equal"
                                style={{ marginTop: "2rem" }}
                              >
                                <div>
                                  <label style={labelStyle}>Téléphone</label>
                                  <input
                                    style={inputStyle}
                                    value={registrationData.emergency2Phone}
                                    onChange={(e) =>
                                      setRegistrationData({
                                        ...registrationData,
                                        emergency2Phone: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div>
                                  <label style={labelStyle}>
                                    Lien de parenté
                                  </label>
                                  <input
                                    style={inputStyle}
                                    value={registrationData.emergency2Relation}
                                    onChange={(e) =>
                                      setRegistrationData({
                                        ...registrationData,
                                        emergency2Relation: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {registrationStep === 4 && (
                          <div style={{ display: "grid", gap: "3rem" }}>
                            <div>
                              <label style={labelStyle}>
                                Capacité de déplacement
                              </label>
                              <div className="registration-mobility-list">
                                {[
                                  "Seul",
                                  "Avec canne",
                                  "Avec déambulateur",
                                  "En fauteuil roulant (transfert possible)",
                                  "Autre",
                                ].map((type) => (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() =>
                                      setRegistrationData({
                                        ...registrationData,
                                        mobilityType: type,
                                      })
                                    }
                                    className="registration-mobility-btn"
                                    style={{
                                      background:
                                        registrationData.mobilityType === type
                                          ? "#000"
                                          : "#fff",
                                      color:
                                        registrationData.mobilityType === type
                                          ? "#fff"
                                          : "#000",
                                    }}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label style={labelStyle}>
                                Aides techniques utilisées
                              </label>
                              <div className="registration-aids-grid">
                                {[
                                  { id: "aidWalker", label: "Déambulateur" },
                                  {
                                    id: "aidTransferChair",
                                    label: "Fauteuil transfert",
                                  },
                                  {
                                    id: "aidSimpleCane",
                                    label: "Canne simple",
                                  },
                                  { id: "aidCrutch", label: "Béquille" },
                                ].map((aid) => (
                                  <label
                                    key={aid.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "1rem",
                                      padding: "1rem",
                                      border: "1px solid #f0f0f0",
                                      borderRadius: "12px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={registrationData[aid.id]}
                                      onChange={(e) =>
                                        setRegistrationData({
                                          ...registrationData,
                                          [aid.id]: e.target.checked,
                                        })
                                      }
                                    />
                                    {aid.label}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {registrationStep === 5 && (
                          <div style={{ display: "grid", gap: "2.5rem" }}>
                            <RegistrationRequiredDocuments
                              contact={settings.contact}
                              onDownloadPdf={handleDownloadRequiredDocuments}
                              isDownloading={isDownloadingRequiredDocs}
                            />

                            <div
                              style={{
                                background: "#fdf2f2",
                                padding: "2rem",
                                borderRadius: "16px",
                                border: "1px solid #fee2e2",
                              }}
                            >
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "start",
                                  gap: "1rem",
                                  cursor: "pointer",
                                  fontWeight: 600,
                                  fontSize: "0.95rem",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    registrationData.engagementTransportRules
                                  }
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      engagementTransportRules:
                                        e.target.checked,
                                    })
                                  }
                                  style={{
                                    marginTop: "4px",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                />
                                Je certifie avoir pris connaissance du règlement
                                intérieur du service La Reinette et m'engage à
                                le respecter.
                              </label>
                            </div>

                            <div
                              style={{
                                background: "#f0fdf4",
                                padding: "2rem",
                                borderRadius: "16px",
                                border: "1px solid #dcfce7",
                              }}
                            >
                              <label
                                style={{
                                  display: "flex",
                                  alignItems: "start",
                                  gap: "1rem",
                                  cursor: "pointer",
                                  fontWeight: 600,
                                  fontSize: "0.95rem",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={registrationData.attestAccuracy}
                                  onChange={(e) =>
                                    setRegistrationData({
                                      ...registrationData,
                                      attestAccuracy: e.target.checked,
                                    })
                                  }
                                  style={{
                                    marginTop: "4px",
                                    width: "20px",
                                    height: "20px",
                                  }}
                                />
                                J'atteste sur l'honneur l'exactitude des
                                renseignements fournis dans ce dossier.
                              </label>
                            </div>

                            <div>
                              <label style={labelStyle}>
                                Date de signature
                              </label>
                              <input
                                type="date"
                                style={inputStyle}
                                value={registrationData.signatureDate}
                                onChange={(e) =>
                                  setRegistrationData({
                                    ...registrationData,
                                    signatureDate: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div>
                              <label style={labelStyle}>
                                Notes complémentaires (Optionnel)
                              </label>
                              <textarea
                                style={{
                                  ...inputStyle,
                                  height: "120px",
                                  resize: "none",
                                }}
                                value={registrationData.additionalNotes}
                                onChange={(e) =>
                                  setRegistrationData({
                                    ...registrationData,
                                    additionalNotes: e.target.value,
                                  })
                                }
                                placeholder="Précisions médicales, digicode, particularités d'accès..."
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className={`registration-actions ${registrationStep > 0 ? "registration-actions--split" : ""}`}
                      >
                        {registrationStep > 0 && (
                          <button
                            onClick={() => setRegistrationStep((s) => s - 1)}
                            style={{
                              padding: "1.8rem",
                              background: "#fff",
                              border: "1px solid #eee",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            Précédent
                          </button>
                        )}
                        <button
                          onClick={() => {
                            console.log(
                              "Clic Bouton - Étape actuelle:",
                              registrationStep,
                            );
                            if (
                              registrationStep <
                              registrationStepLabels.length - 1
                            ) {
                              const isValid =
                                validateRegistrationSubStep(registrationStep);
                              if (isValid) {
                                setRegistrationStep((s) => s + 1);
                              } else {
                                console.warn(
                                  "Validation échouée pour l'étape",
                                  registrationStep,
                                );
                              }
                            } else {
                              handleRegistrationSubmit();
                            }
                          }}
                          style={{
                            padding: "1.8rem",
                            background: "#000",
                            color: "#fff",
                            border: "none",
                            fontWeight: 900,
                            cursor: "pointer",
                            fontSize: "1.1rem",
                          }}
                        >
                          {registrationStep ===
                          registrationStepLabels.length - 1
                            ? isSubmittingRegistration
                              ? "Envoi..."
                              : "Finaliser mon dossier"
                            : "Continuer"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="registration-post-success">
                      <div className="registration-post-success__banner">
                        <CheckCircle2 size={28} aria-hidden />
                        <div>
                          <p className="registration-post-success__banner-title">
                            C&apos;est tout bon !
                          </p>
                          <p className="registration-post-success__banner-text">
                            Votre demande d&apos;inscription a bien été
                            transmise. Consultez ci-dessous les documents à
                            fournir pour la finaliser.
                          </p>
                        </div>
                      </div>

                      <RegistrationRequiredDocuments
                        contact={settings.contact}
                        onDownloadPdf={handleDownloadRequiredDocuments}
                        isDownloading={isDownloadingRequiredDocs}
                        highlight
                      />

                      <button
                        type="button"
                        className="registration-post-home-btn"
                        onClick={() => {
                          setRegistrationData(initialRegistrationData);
                          setStep(0);
                          setShowRegistrationPostSend(false);
                        }}
                      >
                        Retour à l&apos;accueil
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`booking-toast ${toast.type === "error" ? "booking-toast--error" : "booking-toast--success"}`}
            >
              {toast.type === "error" ? (
                <AlertCircle size={24} />
              ) : (
                <CheckCircle2 size={24} />
              )}
              <span
                style={{
                  fontWeight: 600,
                  lineHeight: 1.4,
                  fontSize: "0.95rem",
                }}
              >
                {toast.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Booking;
