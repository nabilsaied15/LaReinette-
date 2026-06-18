import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useSettings } from "../context/SettingsContext";
import {
  Car,
  MapPin,
  Clock,
  HeartHandshake,
  Users,
  ChevronRight,
  ChevronLeft,
  Navigation,
  CheckCircle2,
  HelpCircle,
  Home,
  Trees,
  Building2,
  Hospital,
  Map,
  Navigation2,
  UserPlus,
  CalendarCheck,
  Stethoscope,
  Coffee,
  ArrowRight,
  Phone,
  Mail,
  Info,
  Zap,
  Globe,
  CreditCard,
  Crown,
  Play,
  X,
  Maximize2,
  ClipboardCheck,
} from "lucide-react";

import carMascot from "../assets/image.jpg";
import LaReinetteReviews from "../components/LaReinetteReviews";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import logo from "../assets/la-reinette-logo.png";
import "./LaReinette.css";

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const darkEmeraldIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSA0MSI+PHBhdGggZD0iTTEyLjUgMGMtNi45IDAtMTIuNSA1LjYtMTIuNSAxMi41UzUuNiAyNSAxMi41IDI1czEyLjUtNS42IDEyLjUtMTIuNVMxOS40IDAgMTIuNSAweiIgZmlsbD0iIzA2MjExOSIvPjxwYXRoIGQ9Ik0xMi41IDZjLTMuNiAwLTYuNSAyLjktNi41IDYuNXMyLjkgNi41IDYuNSA2LjUgNi41LTIuOSA2LjUtNi41UzE2LjEgNiAxMi41IDZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const hospitalIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzBhM2QyZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iMTIiIHk9IjgiIHdpZHRoPSI4IiBoZWlnaHQ9IjE2IiByeD0iMSIgZmlsbD0iIzBhM2QyZSIvPjxyZWN0IHg9IjgiIHk9IjEyIiB3aWR0aD0iMTYiIGhlaWdodD0iOCIgcng9IjEiIGZpbGw9IiMwYTNkMmUiLz48L3N2Zz4=",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
  shadowSize: [41, 41],
});

const goldIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSA0MSI+PHBhdGggZD0iTTEyLjUgMGMtNi45IDAtMTIuNSA1LjYtMTIuNSAxMi41UzUuNiAyNSAxMi41IDI1czEyLjUtNS42IDEyLjUtMTIuNVMxOS40IDAgMTIuNSAweiIgZmlsbD0iI2M5YTIyNyIvPjxwYXRoIGQ9Ik0xMi41IDZjLTMuNiAwLTYuNSAyLjktNi41IDYuNXMyLjkgNi41IDYuNSA2LjUgNi41LTIuOSA2LjUtNi41UzE2LjEgNiAxMi41IDZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const emeraldIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSA0MSI+PHBhdGggZD0iTTEyLjUgMGMtNi45IDAtMTIuNSA1LjYtMTIuNSAxMi41UzUuNiAyNSAxMi41IDI1czEyLjUtNS42IDEyLjUtMTIuNVMxOS40IDAgMTIuNSAweiIgZmlsbD0iIzEyNUI0NiIvPjxwYXRoIGQ9Ik0xMi41IDZjLTMuNiAwLTYuNSAyLjktNi41IDYuNXMyLjkgNi41IDYuNSA2LjUgNi41LTIuOSA2LjUtNi41UzE2LjEgNiAxMi41IDZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const COMMUNES_LIMITROPHES_BOURG_LA_REINE = [
  "Sceaux",
  "Antony",
  "Bagneux",
];

const AUTRES_COMMUNES_92 = [
  "Fontenay-aux-Roses",
  "Le Plessis-Robinson",
  "Châtenay-Malabry",
  "Clamart",
  "Châtillon",
  "Montrouge",
  "Vanves",
];

const COMMUNES_COORDINATES = {
  "Bourg-la-Reine": [48.7875, 2.3292],
  Antony: [48.7539, 2.3025],
  "Châtenay-Malabry": [48.7667, 2.2833],
  Sceaux: [48.7792, 2.2958],
  Bagneux: [48.8083, 2.3167],
  "Fontenay-aux-Roses": [48.7917, 2.275],
  "Le Plessis-Robinson": [48.7708, 2.2333],
  Clamart: [48.8083, 2.225],
  Châtillon: [48.8083, 2.2917],
  Montrouge: [48.8167, 2.3167],
  Malakoff: [48.825, 2.2917],
  Vanves: [48.8292, 2.2917],
  Cachan: [48.7917, 2.3333],
  "L'Haÿ-les-Roses": [48.775, 2.35],
  Villejuif: [48.7917, 2.3667],
  Fresnes: [48.7583, 2.3167],
  Gentilly: [48.8167, 2.35],
  Arcueil: [48.8, 2.3333],
  "Le Kremlin-Bicêtre": [48.8167, 2.3667],
  Paris: [48.8566, 2.3522],
  Orly: [48.7261, 2.3796],
};

const HOSPITAUX_COORDINATES = {
  "Hôpital Antoine Béclère": [48.8083, 2.225],
  "Hôpital Raymond Poincaré": [48.845, 2.205],
  "Hôpital Foch": [48.875, 2.22],
  "Hôpital Ambroise Paré": [48.84, 2.25],
  "Hôpital Beaujon": [48.9, 2.3],
  "Hôpital Corentin Celton": [48.82, 2.27],
  "Hôpital Henri Mondor": [48.81, 2.42],
  "Hôpital Bicêtre": [48.81, 2.35],
  "Hôpital Sainte-Périne": [48.82, 2.38],
  "Hôpital Paul Brousse": [48.8, 2.36],
  "Hôpital Emile Roux": [48.79, 2.37],
};

const LaReinette = () => {
  const { settings, isSettingsLoading } = useSettings();
  const { laReinette } = settings;
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();
  const hasScrolled = React.useRef(false);

  useEffect(() => {
    if (isSettingsLoading) return;

    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [isSettingsLoading, location.hash]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: [0.19, 1, 0.22, 1] },
    },
  };

  if (isSettingsLoading) return null;

  return (
    <div className="la-reinette-page">
      {/* 01. CINEMATIC HERO SECTION: THE PRESTIGE REINETTE */}
      <section id="quoi" className="reinette-hero-section">
        <div className="container">
          <motion.header
            className="reinette-hero-header"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            <h1 className="font-serif reinette-hero-title">
              <span
                style={{
                  fontStyle: "italic",
                  color: "var(--primary-gold)",
                  fontWeight: 300,
                  letterSpacing: "-1px",
                }}
              >
                Besoin d'un transport à la demande ?
              </span>{" "}
              Faites appel à la Reinette !
            </h1>
          </motion.header>

          <motion.p
            className="reinette-hero-top-intro"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            La Reinette a été créée à l’initiative de la Ville de Bourg-la-Reine en collaboration avec l’ASAD, association de services à domicile présente depuis 1961.
          </motion.p>

          <div className="reinette-hero-grid">
            {/* LEFT COLUMN: THE EDITORIAL */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <p className="reinette-hero-description" style={{ whiteSpace: "pre-line" }}>
                {laReinette.description}
              </p>

              <div style={{ marginTop: "2rem" }}>
                <button
                  onClick={() => navigate("/reservation")}
                  className="btn btn-primary reinette-hero-btn"
                >
                  Planifier un déplacement
                </button>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: THE SIGNATURE VAN */}
            <motion.div
              className="reinette-hero-visual"
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="reinette-hero-halo" aria-hidden="true" />
              <img
                className="reinette-hero-image"
                src={carMascot}
                alt="Véhicule La Reinette avec Mascotte"
              />
            </motion.div>
          </div>

          {/* ── Contact triptych — pleine largeur sous le hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            style={{ marginTop: "3rem" }}
          >
            <div className="reinette-contact-grid">

              {/* ── 1 / CCAS ── */}
              <div className="rct-card rct-card--light">
                <div className="rct-card__header">
                  <div className="rct-card__icon-wrap rct-card__icon-wrap--gold">
                    <Building2 size={22} color="var(--primary-gold)" />
                  </div>
                  <span className="rct-card__label">Mairie (CCAS)</span>
                </div>
                <a href="tel:0179714120" className="rct-card__phone rct-card__phone--dark">
                  <Phone size={20} color="var(--primary-gold)" strokeWidth={2} />
                  01 79 71 41 20
                </a>
                <a href="mailto:service-social@bourg-la-reine.fr" className="rct-card__email">
                  <Mail size={16} color="var(--primary-gold)" strokeWidth={2} style={{ flexShrink: 0 }} />
                  service-social@bourg-la-reine.fr
                </a>
                <div className="rct-card__address rct-card__address--muted">
                  <MapPin size={16} color="var(--primary-gold)" strokeWidth={2} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                  <span>1 boulevard Carnot<br />92340 Bourg-la-Reine</span>
                </div>
              </div>

              {/* ── 2 / La Reinette (dark featured) ── */}
              <div className="rct-card rct-card--dark">
                <div className="rct-card__header">
                  <div className="rct-card__icon-wrap rct-card__icon-wrap--translucent">
                    <Car size={22} color="var(--primary-gold)" />
                  </div>
                  <span className="rct-card__label">La Reinette</span>
                </div>
                <a href="tel:0179717542" className="rct-card__phone rct-card__phone--white">
                  <Phone size={20} color="var(--primary-gold)" strokeWidth={2} />
                  01 79 71 75 42
                </a>
                <a href="mailto:lareinette@asad-bourg-la-reine.fr" className="rct-card__email rct-card__email--white">
                  <Mail size={16} color="var(--primary-gold)" strokeWidth={2} style={{ flexShrink: 0 }} />
                  lareinette@asad-bourg-la-reine.fr
                </a>
                <div className="rct-card__address rct-card__address--white">
                  <MapPin size={16} color="var(--primary-gold)" strokeWidth={2} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                  <span>3-5 Allée Françoise Dolto<br />92340 Bourg-la-Reine</span>
                </div>
              </div>

              {/* ── 3 / L'inscription ── */}
              <div className="rct-card rct-card--light">
                <div className="rct-card__header">
                  <div className="rct-card__icon-wrap rct-card__icon-wrap--green">
                    <ClipboardCheck size={22} color="#22c55e" />
                  </div>
                  <span className="rct-card__label">L'inscription</span>
                </div>
                {[
                  { num: "1", label: "Inscription au CCAS" },
                  { num: "2", label: "Validation du dossier" },
                  { num: "3", label: "Réserver un trajet" },
                ].map((step) => (
                  <div key={step.num} className="rct-step">
                    <div className="rct-step__num">{step.num}</div>
                    <span className="rct-step__label">{step.label}</span>
                  </div>
                ))}
                <div className="rct-age-note">
                  <span className="rct-age-note__star">★</span>
                  <p className="rct-age-note__text">
                    Service réservé aux personnes âgées de{" "}
                    <strong>60 ans et plus</strong>, résidant à Bourg-la-Reine.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          <style dangerouslySetInnerHTML={{ __html: `
            /* ══════════════════════════════════════════
               CONTACT TRIPTYCH — pleine largeur
            ══════════════════════════════════════════ */
            .reinette-contact-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 1.5rem;
              width: 100%;
            }

            /* Base card */
            .rct-card {
              border-radius: 24px;
              padding: 2.25rem 2rem 2rem;
              display: flex;
              flex-direction: column;
              gap: 1.6rem;
            }
            .rct-card--light {
              background: #ffffff;
              border: 1px solid #e8e2d6;
              box-shadow: 0 4px 24px rgba(6,78,59,0.07);
            }
            .rct-card--dark {
              background: var(--emerald-900);
              box-shadow: 0 8px 36px rgba(6,78,59,0.24);
            }

            /* Header */
            .rct-card__header {
              display: flex;
              align-items: center;
              gap: 0.85rem;
              padding-bottom: 1.1rem;
              border-bottom: 1px solid rgba(0,0,0,0.06);
            }
            .rct-card--dark .rct-card__header {
              border-bottom-color: rgba(255,255,255,0.1);
            }

            /* Icon */
            .rct-card__icon-wrap {
              width: 44px; height: 44px;
              border-radius: 12px;
              display: flex; align-items: center; justify-content: center;
              flex-shrink: 0;
            }
            .rct-card__icon-wrap--gold        { background: #fef9ec; }
            .rct-card__icon-wrap--translucent { background: rgba(212,175,55,0.15); }
            .rct-card__icon-wrap--green       { background: #f0fdf4; }

            /* Label */
            .rct-card__label {
              font-size: 0.85rem;
              font-weight: 900;
              color: var(--primary-gold);
              text-transform: uppercase;
              letter-spacing: 2px;
            }

            /* Phone */
            .rct-card__phone {
              display: flex; align-items: center; gap: 1rem;
              font-weight: 700; font-size: 15px;
              text-decoration: none; line-height: 1.4;
              white-space: normal;
            }
            .rct-card__phone--dark  { color: var(--emerald-900); }
            .rct-card__phone--white { color: #ffffff; }

            /* Email */
            .rct-card__email {
              display: flex; align-items: flex-start; gap: 1rem;
              font-weight: 600; font-size: 15px;
              text-decoration: none; line-height: 1.5;
              color: #475569;
              word-break: break-all;
            }
            .rct-card__email--white { color: rgba(255,255,255,0.85); }

            /* Address */
            .rct-card__address {
              display: flex; align-items: flex-start; gap: 1rem;
              font-size: 15px; font-weight: 600; line-height: 1.55;
            }
            .rct-card__address--muted { color: #475569; }
            .rct-card__address--white { color: rgba(255,255,255,0.8); }

            /* Steps */
            .rct-step {
              display: flex; align-items: center; gap: 0.9rem;
            }
            .rct-step__num {
              width: 34px; height: 34px; border-radius: 50%;
              background: var(--emerald-900); color: #fff;
              display: flex; align-items: center; justify-content: center;
              font-size: 0.9rem; font-weight: 900; flex-shrink: 0;
            }
            .rct-step__label {
              font-size: 1.05rem; font-weight: 700;
              color: var(--emerald-900); line-height: 1.3;
            }

            /* ★ age note */
            .rct-age-note {
              display: flex; align-items: flex-start; gap: 0.5rem;
              padding-top: 0.9rem; margin-top: 0.2rem;
              border-top: 1px dashed #e2ddd4;
            }
            .rct-age-note__star {
              color: var(--primary-gold); font-size: 1rem;
              line-height: 1; flex-shrink: 0; margin-top: 0.1rem;
            }
            .rct-age-note__text {
              margin: 0; font-size: 0.82rem; color: #64748b;
              line-height: 1.55; font-style: italic;
            }
            .rct-age-note__text strong {
              color: var(--emerald-900); font-style: normal;
            }

            /* ══════════════════════════════════════════
               MOBILE ≤ 768px — cartes empilées
            ══════════════════════════════════════════ */
            @media (max-width: 768px) {
              .reinette-contact-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
              }
              .rct-card__phone {
                font-size: 1.3rem !important;
                white-space: normal;
              }
            }
          `}} />
        </div>
      </section>

      {/* 02. LOGO TRUST BAR: THE TRIPTYCH */}
      <section className="reinette-trust-bar">
        <div className="container">
          {(() => {
            const partners = [
              "Ville de Bourg-la-Reine",
              "CCAS de Bourg-la-Reine",
              "ARS Île-de-France",
              "ASAD Bourg-la-Reine",
            ];
            const loop = [...partners, ...partners];
            return (
              <div
                className="trust-marquee"
                aria-label="Partenaires et institutions"
              >
                <div className="trust-track">
                  {loop.map((partner, i) => (
                    <div key={`${partner}-${i}`} className="trust-pill">
                      {partner}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>




      {/* 04. ELIGIBILITY SECTION - EDITORIAL GRID */}
      <section id="qui" style={{ padding: "4rem 0", background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              ACCÈS AU SERVICE
            </div>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
            >
              Qui peut{" "}
              <span
                style={{ fontStyle: "italic", color: "var(--primary-green)" }}
              >
                bénéficier de La Reinette ?
              </span>
            </h2>
          </div>

          <div
            className="eligibility-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "0",
              border: "1px solid #e5e0d8",
            }}
          >
            {laReinette.eligibility.map((card, i) => {
              const IconComp = [Home, Users, UserPlus][i % 3];
              return (
                <div
                  key={i}
                  className="eligibility-card"
                  style={{
                    background: "#fff",
                    padding: "5rem 4rem",
                    borderRight:
                      i < laReinette.eligibility.length - 1
                        ? "1px solid #e5e0d8"
                        : "none",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      color: "var(--primary-gold)",
                      marginBottom: "3rem",
                      opacity: 0.8,
                    }}
                  >
                    <IconComp size={40} strokeWidth={1} />
                  </div>
                  <h4
                    className="font-serif"
                    style={{
                      fontSize: "2rem",
                      marginBottom: "1.5rem",
                      color: "var(--emerald-900)",
                    }}
                  >
                    {card.title}
                  </h4>
                  <p
                    style={{
                      color: "#64748b",
                      lineHeight: 1.7,
                      fontSize: "1.1rem",
                      marginBottom: "3rem",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {card.desc}
                  </p>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "0.6rem 1.5rem",
                      background: "var(--primary-green-pale)",
                      color: "var(--primary-green)",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      borderRadius: "2px",
                    }}
                  >
                    {card.tag}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 08. BOOKING PROCESS SECTION: THE STEPS */}
      <section id="comment" style={{ padding: "4rem 0", background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              RÉSERVATION
            </div>
            <h2 className="font-serif" style={{ fontSize: "clamp(2.2rem, 3.5vw, 3rem)", color: "var(--emerald-900)", fontWeight: 800, margin: "1rem 0" }}>
              Comment réserver son trajet ?
            </h2>
            <p style={{ color: "#475569", fontSize: "1.25rem", marginTop: "1.5rem", maxWidth: "800px", marginLeft: "auto", marginRight: "auto", lineHeight: "1.7" }}>
              Une fois votre inscription validée par le CCAS de Bourg-la-Reine, vous pouvez directement planifier et réserver votre trajet :
            </p>
          </div>

          <div style={{ maxWidth: "860px", margin: "3rem auto 0", display: "flex", flexDirection: "column", gap: "3rem", paddingLeft: "1rem" }}>

            {/* Phone */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.8rem", flexWrap: "wrap" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "rgba(212,175,55,0.12)", border: "2px solid var(--primary-gold)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Phone size={32} style={{ color: "var(--primary-gold)" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.4rem" }}>Téléphone</div>
                <a href="tel:0179717542" style={{ fontSize: "15px", fontWeight: 700, color: "var(--emerald-900)", textDecoration: "none", display: "block", lineHeight: 1.4 }}>
                  01 79 71 75 42
                </a>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.4rem" }}>Lun – Ven · 8h30–17h30</div>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.8rem", flexWrap: "wrap" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "rgba(212,175,55,0.12)", border: "2px solid var(--primary-gold)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Mail size={32} style={{ color: "var(--primary-gold)" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.4rem" }}>Email</div>
                <a href="mailto:lareinette@asad-bourg-la-reine.fr" style={{ fontSize: "15px", fontWeight: 600, color: "var(--emerald-900)", textDecoration: "none", wordBreak: "break-all", display: "block", lineHeight: 1.5 }}>
                  lareinette@asad-bourg-la-reine.fr
                </a>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.4rem" }}>Réponse sous 24h</div>
              </div>
            </div>

            {/* Address */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.8rem", flexWrap: "wrap" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "rgba(212,175,55,0.12)", border: "2px solid var(--primary-gold)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "0.2rem"
              }}>
                <MapPin size={32} style={{ color: "var(--primary-gold)" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "0.4rem" }}>Adresse</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--emerald-900)", lineHeight: 1.5 }}>
                  3-5 Allée Françoise Dolto
                </div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#475569", marginTop: "0.2rem" }}>
                  92340 Bourg-la-Reine
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 06. PRICING SECTION: THE LUXURY MENU */}
      <section id="ou" style={{ padding: "4rem 0", background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              DESTINATIONS & TARIFS
            </div>
            <h2
              className="section-title font-serif"
              style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", color: "var(--emerald-900)", fontWeight: 800 }}
            >
              Une tarification <br />
              <span style={{ color: "var(--primary-gold)", fontStyle: "italic", fontWeight: 300 }}>
                claire et solidaire.
              </span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "3.5rem",
              maxWidth: "1100px",
              margin: "3rem auto 4rem",
              padding: "0 1rem"
            }}
          >
            {/* Column 92 */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3 className="font-serif" style={{ color: "var(--emerald-900)", fontSize: "1.6rem", fontWeight: 800, borderBottom: "2px solid var(--primary-gold)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
                Dans le 92 :
              </h3>
              <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "1.35rem", lineHeight: "1.6", color: "#334155" }}>
                  <span style={{ color: "var(--primary-gold)", fontSize: "1.8rem", lineHeight: "1", userSelect: "none" }}>•</span>
                  <span><strong>Bourg-la-Reine</strong></span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "1.35rem", lineHeight: "1.6", color: "#334155" }}>
                  <span style={{ color: "var(--primary-gold)", fontSize: "1.8rem", lineHeight: "1", userSelect: "none" }}>•</span>
                  <span>Antony , Sceaux , Bagneux</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "1.35rem", lineHeight: "1.6", color: "#334155" }}>
                  <span style={{ color: "var(--primary-gold)", fontSize: "1.8rem", lineHeight: "1", userSelect: "none" }}>•</span>
                  <span>Vanves , Montrouge, Clamart, Chatillon, Chatenay Malabry, Fontenay aux Roses, Le Plessis Robinson</span>
                </li>
              </ul>
            </div>

            {/* Column 94 */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3 className="font-serif" style={{ color: "var(--emerald-900)", fontSize: "1.6rem", fontWeight: 800, borderBottom: "2px solid var(--primary-gold)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
                Dans le 94 :
              </h3>
              <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "1.35rem", lineHeight: "1.6", color: "#334155" }}>
                  <span style={{ color: "var(--primary-gold)", fontSize: "1.8rem", lineHeight: "1", userSelect: "none" }}>•</span>
                  <span>Fresnes, L’Haÿ-les-Roses, Cachan, Arcueil, Villejuif, Gentilly, Malakoff, Le Kremlin-Bicêtre</span>
                </li>
              </ul>
            </div>

            {/* Column Autres */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3 className="font-serif" style={{ color: "var(--emerald-900)", fontSize: "1.6rem", fontWeight: 800, borderBottom: "2px solid var(--primary-gold)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
                Autres destinations :
              </h3>
              <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "1.35rem", lineHeight: "1.6", color: "#334155" }}>
                  <span style={{ color: "var(--primary-gold)", fontSize: "1.8rem", lineHeight: "1", userSelect: "none" }}>•</span>
                  <span>Gares SNCF</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "1.35rem", lineHeight: "1.6", color: "#334155" }}>
                  <span style={{ color: "var(--primary-gold)", fontSize: "1.8rem", lineHeight: "1", userSelect: "none" }}>•</span>
                  <span>Aéroports</span>
                </li>
              </ul>
            </div>
          </div>

          {/* New CTA: Voir tous nos tarifs et détails */}
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <button
              onClick={() => navigate("/tarifs-lareinette")}
              className="btn btn-primary"
              style={{
                fontSize: "1.25rem",
                padding: "1rem 2.5rem",
                borderRadius: "30px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Voir tous nos tarifs et détails
            </button>
          </div>

          {/* Payment Notice Badge */}
          <div
            className="reinette-payment-notice"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "2rem",
              flexWrap: "wrap",
              marginBottom: "4rem",
              maxWidth: "1000px",
              margin: "0 auto 4rem",
            }}
          >
            <div style={{ color: "var(--primary-gold)", marginTop: "0.5rem" }}>
              <CreditCard size={36} strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h4
                className="font-serif"
                style={{
                  fontSize: "1.8rem",
                  color: "var(--emerald-900)",
                  marginBottom: "0.5rem",
                }}
              >
                Modalité de règlement
              </h4>
              <p
                style={{
                  color: "#64748b",
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                  marginBottom: "2rem"
                }}
              >
                Le règlement s'effectue uniquement par{" "}
                <strong style={{ color: "var(--emerald-900)" }}>
                  chèque à l'ordre de l'ASAD
                </strong>{" "}
                directement auprès du chauffeur. Les espèces et cartes bancaires
                ne sont pas acceptées.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
                <p style={{ fontSize: "1rem", color: "#334155", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Phone size={20} style={{ color: "var(--primary-gold)", flexShrink: 0 }} />
                  <a href="tel:0179717542" style={{ fontWeight: 800, color: "var(--emerald-900)", textDecoration: "none" }}>
                    01 79 71 75 42
                  </a>
                </p>
                <p style={{ fontSize: "1rem", color: "#334155", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Mail size={20} style={{ color: "var(--primary-gold)", flexShrink: 0 }} />
                  <a href="mailto:lareinette@asad-bourg-la-reine.fr" style={{ fontWeight: 800, color: "var(--emerald-900)", textDecoration: "none", fontSize: "0.85rem" }}>
                    lareinette@asad-bourg-la-reine.fr
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: HORAIRES SECTION - THE TIMING */}
      <section
        id="quand"
        style={{
          padding: "4rem 0",
          background: "#fff",
          borderTop: "1px solid #e5e0d8",
          borderBottom: "1px solid #e5e0d8",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ color: "var(--primary-gold)", marginBottom: "1rem" }}>
              <Clock size={48} strokeWidth={1} />
            </div>

            <div
              className="section-label"
              style={{ justifyContent: "center", marginBottom: "1rem" }}
            >
              HORAIRES
            </div>

            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                color: "var(--emerald-900)",
                marginBottom: "1.5rem",
                lineHeight: 1.1,
              }}
            >
              Disponibilité <br />
              <span
                style={{
                  color: "var(--primary-gold)",
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                du service.
              </span>
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "1.5rem",
                  color: "var(--emerald-900)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Lundi au Vendredi
              </span>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--primary-gold)",
                }}
              ></span>
              <span
                style={{
                  fontSize: "1.5rem",
                  color: "#64748b",
                  fontWeight: 600,
                }}
              >
                De 8h30 à 17h30
              </span>
            </div>

            <div
              style={{
                marginTop: "2.5rem",
                maxWidth: "1100px",
                margin: "2.5rem auto 0",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: "3rem", alignItems: "center" }}>
                <p style={{ fontSize: "1rem", color: "#334155", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Phone size={32} style={{ color: "var(--primary-gold)" }} />
                  <a href="tel:0179717542" style={{ fontWeight: 900, fontSize: "1.1rem", color: "var(--emerald-900)", textDecoration: "none" }}>
                    01 79 71 75 42
                  </a>
                </p>
                <p style={{ fontSize: "1rem", color: "#334155", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Mail size={32} style={{ color: "var(--primary-gold)" }} />
                  <a href="mailto:lareinette@asad-bourg-la-reine.fr" style={{ fontWeight: 900, fontSize: "1rem", color: "var(--emerald-900)", textDecoration: "none" }}>
                    lareinette@asad-bourg-la-reine.fr
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      <LaReinetteReviews />

      {/* 8. CONTACT SECTION: DUO LAYOUT */}
      <section style={{ padding: "4rem 0", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "1400px" }}>
          <div className="contact-grid">
            <div>
              <div className="section-label">RÉSERVATION & CONTACT</div>
              <h2
                className="font-serif"
                style={{
                  fontSize: "clamp(3rem, 5vw, 4.5rem)",
                  lineHeight: 1,
                  marginBottom: "1.5rem",
                  color: "var(--emerald-900)",
                }}
              >
                Une question ? <br />
                <span
                  style={{
                    color: "var(--primary-green)",
                    fontStyle: "italic",
                    fontWeight: 300,
                  }}
                >
                  Nous sommes à votre écoute.
                </span>
              </h2>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "#64748b",
                  lineHeight: 1.8,
                  maxWidth: "600px",
                }}
              >
                Notre équipe logistique est à votre disposition pour organiser
                vos déplacements et répondre à toutes vos interrogations sur le
                service La Reinette.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <a
                href={`tel:${laReinette.phone.replace(/\s+/g, "")}`}
                className="reinette-call-card"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    color: "var(--primary-gold)",
                  }}
                >
                  <Phone size={48} strokeWidth={1} />
                </div>

                <p
                  style={{
                    fontSize: "0.85rem",
                    letterSpacing: "4px",
                    fontWeight: 800,
                    color: "var(--emerald-900)",
                    opacity: 0.6,
                    marginBottom: "1.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  CENTRE D'APPELS ASAD
                </p>

                <div className="reinette-call-number">{laReinette.phone}</div>

                <p
                  style={{
                    fontSize: "1.1rem",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  Service disponible de{" "}
                  <span
                    style={{ color: "var(--emerald-900)", fontWeight: 700 }}
                  >
                    8h30 à 17h30
                  </span>
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default LaReinette;
