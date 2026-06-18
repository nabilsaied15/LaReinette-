import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  ClipboardCheck,
  MapPin,
  Clock,
  Heart,
  ShieldCheck,
  Stethoscope,
  Phone,
  Mail,
  Car,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Home,
  Bath,
  Utensils,
  ShoppingCart,
  Trees,
  Sparkles,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import SEO from "../components/SEO";

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

import supportBg from "../assets/support-bg.png";
import parkSenior from "../assets/istockphoto-1276778124-612x612.jpg";
import heroBg from "../assets/hero-bg.jpg";
import heroPng from "../assets/hero.png";
import voitureAsad from "../assets/voitureasad.jpg";
import imageHome from "../assets/image (2).jpg";
import imageCare from "../assets/image.jpg";



const Asad = () => {
  const { settings, isSettingsLoading } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
  }, [location.hash]);

  if (isSettingsLoading) return null;

  const services = [
    {
      title: "SAAD",
      subtitle: "Aides à domicile",
      desc: "Après étude de vos besoins par notre évaluatrice, nous vous offrons “Aide & Accompagnement à votre domicile et à l'extérieur” sur mesure et en tenant compte de votre budget.",
      icon: Heart,
      color: "#3b82f6",
      phone: "01 43 50 43 77",
      phoneHref: "0143504377",
      email: "contact@asad-bourg-la-reine.fr",
      contacts: [
        { label: "Toilette", icon: Bath },
        { label: "Repas", icon: Utensils },
        { label: "Courses", icon: ShoppingCart },
        { label: "Promenade", icon: Trees },
        { label: "Entretien de votre domicile", icon: Sparkles },
      ],
    },
    {
      title: "SSIAD",
      subtitle: "Soins infirmiers et soins d'hygiène à domicile",
      desc: "Sur prescription de votre médecin traitant, nous vous accompagnons dans vos soins d'hygiène corporelle, dans la préparation et la prise de vos médicaments et dans la réalisation des soins techniques infirmiers.",
      icon: Stethoscope,
      color: "#10b981",
      phone: "01 43 50 43 77",
      phoneHref: "0143504377",
      email: "contact@asad-bourg-la-reine.fr",
      contacts: [
        { label: "Aide à la toilette", icon: Bath },
        { label: "Aide à l'habillage", icon: ShieldCheck },
        { label: "Transfert du lit vers le fauteuil", icon: Home },
        { label: "Aide à l'élimination", icon: ClipboardCheck },
        { label: "Remplacement des changes", icon: Sparkles },
      ],
    },
    {
      title: "Téléassistance",
      subtitle: "Sécurité 24h/24",
      desc: "Pour profiter de votre séjour à domicile en toute sécurité et sérénité pour vous-mêmes et vos proches, vous êtes reliés en permanence avec un centre d'appel qui organise les secours en cas de difficultés à votre domicile.",
      icon: ShieldCheck,
      color: "#f59e0b",
      phone: "01 43 50 43 77",
      phoneHref: "0143504377",
      email: "contact@asad-bourg-la-reine.fr",
      contacts: [
        { label: "Accompagnement à domicile", icon: Home },
        { label: "Présence rassurante", icon: Heart },
        { label: "Lien avec les proches", icon: Users },
        { label: "Sécurité au quotidien", icon: ShieldCheck },
      ],
    },
    {
      title: "La Reinette",
      subtitle: "Mobilité de Confiance",
      desc: "Séjourner à domicile ne doit pas rimer avec isolement, grâce au concours de la ville de Bourg-la-Reine, vous bénéficiez de La Reinette, un transport à la demande de porte à porte réservé aux seniors pour se déplacer en toute liberté.",
      icon: Car,
      color: "#064e3b",
      phone: "01 79 71 75 42",
      phoneHref: "0179717542",
      email: "lareinette@asad-bourg-la-reine.fr",
      contacts: [
        { label: "Porte à porte", icon: MapPin },
        { label: "Déplacements libres", icon: Car },
        { label: "Sorties médicales", icon: Stethoscope },
        { label: "Courses", icon: ShoppingCart },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: "#fff" }}
    >
      <SEO
        title="L'ASAD Association de Soins et d'Aide à Domicile"
        description="L'ASAD accompagne les seniors à Bourg-la-Reine depuis 1961. Découvrez nos services de SAAD, SSIAD et transport."
      />

      {/* HERO SECTION: THE PRESTIGE ASAD */}
      <section
        style={{
          paddingTop: "120px",
          paddingBottom: "4rem",
          background: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ maxWidth: "1400px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "8rem",
              alignItems: "center",
            }}
            className="asad-hero-grid"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="asad-hero-content"
            >
              <motion.span
                variants={itemVariants}
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  letterSpacing: "4px",
                  color: "var(--primary-gold)",
                  textTransform: "uppercase",
                  marginBottom: "2rem",
                  display: "block",
                }}
              >
                NOTRE ASSOCIATION
              </motion.span>

              <motion.h1
                variants={itemVariants}
                className="font-serif asad-hero-title"
                style={{
                  fontSize: "clamp(2.4rem, 4.2vw, 4rem)",
                  color: "var(--emerald-900)",
                  lineHeight: 1.08,
                  marginBottom: "3rem",
                  fontWeight: 900,
                  letterSpacing: "-2px",
                }}
              >
                <span className="asad-hero-title-line">
                  L'ASAD organise avec vous
                </span>
                <span
                  className="asad-hero-title-accent asad-hero-title-line"
                  style={{
                    fontStyle: "italic",
                    color: "var(--primary-gold)",
                    fontWeight: 300,
                    letterSpacing: "-1px",
                  }}
                >
                  votre séjour à domicile !
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                style={{
                  fontSize: "1.4rem",
                  color: "#64748b",
                  maxWidth: "650px",
                  lineHeight: 1.6,
                  fontWeight: 400,
                  marginBottom: "4rem",
                }}
              >
                Depuis 1961, l'ASAD est une association réginaburgienne de
                référence de l'aide et des soins à domicile à Bourg-la-Reine.
                Une association engagée pour la dignité et le bien-être des
                seniors pendant leur séjour à domicile.
              </motion.p>

              <motion.div variants={itemVariants}>
                <button
                  onClick={() => navigate("/contact")}
                  className="btn btn-primary"
                  style={{
                    padding: "1.5rem 4rem",
                    borderRadius: "100px",
                    background: "var(--emerald-900)",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    boxShadow: "0 10px 30px rgba(6, 78, 59, 0.15)",
                  }}
                >
                  Nous contacter
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
              style={{ position: "relative" }}
              className="asad-hero-media"
            >
              {/* Luxury Halo behind the image */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "140%",
                  height: "140%",
                  background:
                    "radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 65%)",
                  zIndex: -1,
                }}
              />

              <img
                src={supportBg}
                alt="Extérieur de l'ASAD"
                style={{
                  width: "100%",
                  maxWidth: "560px",
                  height: "auto",
                  borderRadius: "32px",
                  marginLeft: "0",
                  display: "block",
                  maskImage:
                    "radial-gradient(circle at center, black 65%, transparent 98%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at center, black 65%, transparent 98%)",
                  filter: "brightness(1.02) contrast(1.05)",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 1200px) {
          .asad-hero-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 3rem !important;
          }

          .asad-hero-content {
            order: 1;
          }

          .asad-hero-media {
            order: 2;
            max-width: 560px;
            width: 100%;
            margin: 0 auto;
          }

          .asad-hero-title {
            white-space: normal !important;
          }

          .asad-hero-title-line {
            display: block;
          }

          .asad-hero-title-accent {
            display: block;
          }
        }

        @media (min-width: 1201px) {
          .asad-hero-title {
            white-space: normal;
          }
        }

        @media (max-width: 768px) {
          .asad-hero-title {
            font-size: 2rem !important;
            line-height: 1.15 !important;
            letter-spacing: -1px !important;
            margin-bottom: 2rem !important;
          }

          .asad-hero-title-line {
            display: block;
          }

          .asad-hero-title-accent {
            display: block;
            margin-left: 0 !important;
          }

          .asad-hero-grid {
            gap: 2rem !important;
          }

          .asad-hero-media {
            max-width: 100% !important;
          }

          .asad-hero-media img {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            border-radius: 24px !important;
          }

          .asad-service-row {
            grid-template-columns: 1fr !important;
          }

          .asad-service-text,
          .asad-service-image-wrap {
            order: initial !important;
          }

          .asad-service-text {
            padding: 1.5rem !important;
          }

          .asad-service-image,
          .asad-service-image-wrap {
            min-height: 90px !important;
          }
        }
      `,
        }}
      />

      {/* 2. NOS PÔLES D'EXPERTISE */}
      <section id="quoi" style={{ padding: "4rem 0", background: "#fff" }}>
        <div
          className="container"
          style={{ maxWidth: "100%", width: "100%", padding: "0 2rem 0 4rem" }}
        >
          <div
            className="asad-expertise-intro"
            style={{
              display: "block",
              marginBottom: "6rem",
            }}
          >
            <div
              style={{
                textAlign: "left",
                borderLeft: "1px solid var(--border-subtle)",
                paddingLeft: "3rem",
                width: "100%",
                maxWidth: "100%",
              }}
              className="asad-section-intro"
            >
              <h2
                className="font-serif"
                style={{
                  fontSize: "clamp(1.8rem, 2.6vw, 2.6rem)",
                  color: "var(--emerald-900)",
                  lineHeight: 1.15,
                  marginBottom: "0",
                  width: "100%",
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                  textAlign: "left",
                }}
              >
                Une offre complète de services pour faciliter votre séjour à
                domicile
              </h2>
            </div>
          </div>

          <div style={{ display: "grid", gap: "1.25rem", width: "100%" }}>
            {services.map((s, i) => {
              const imageByIndex = [supportBg, parkSenior, heroBg, voitureAsad];
              const imageSrc = imageByIndex[i] || supportBg;
              const isReverse = i % 2 === 1 || i === 3;

              return (
                <React.Fragment key={i}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    onClick={() => s.path && navigate(s.path)}
                    style={{
                      background: "transparent",
                      borderRadius: "0",
                      border: "none",
                      boxShadow: "none",
                      overflow: "visible",
                      cursor: s.path ? "pointer" : "default",
                      width: "100%",
                      padding: "1.25rem 0",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div
                      className="asad-service-row"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {/* Titre et sous-titre */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "0.75rem",
                          flexWrap: "wrap",
                          marginLeft: "3rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "clamp(1.4rem, 2.2vw, 1.8rem)",
                            fontWeight: 900,
                            color: "var(--primary-gold)",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            lineHeight: 1.15,
                          }}
                        >
                          {i + 1 + " . "} {s.title}
                        </div>

                        <h3
                          className="font-serif"
                          style={{
                            fontSize: "clamp(1.4rem, 2.2vw, 1.8rem)",
                            marginBottom: "0",
                            color: "var(--emerald-900)",
                            lineHeight: 1.15,
                          }}
                        >
                          {s.subtitle}
                        </h3>
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          color: "#64748b",
                          lineHeight: 1.7,
                          fontSize: "1rem",
                          margin: 0,
                          maxWidth: "700px",
                          marginLeft: "3rem",
                        }}
                      >
                        {s.desc}
                      </p>
                    </div>

                    {/* Exemples de services */}
                    {s.contacts ? (
                      <div
                        style={{
                          width: "100%",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1.5rem",
                          paddingTop: "1.5rem",
                          maxWidth: "800px",
                          margin: "0 auto",
                        }}
                      >
                        {/* Colonne gauche */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                          }}
                        >
                          {s.contacts.slice(0, Math.ceil(s.contacts.length / 2)).map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              style={{
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: "var(--primary-gold)",
                                lineHeight: 1.4,
                              }}
                            >
                              - {item.label}
                            </div>
                          ))}
                        </div>

                        {/* Colonne droite */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                          }}
                        >
                          {s.contacts.slice(Math.ceil(s.contacts.length / 2)).map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              style={{
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: "var(--primary-gold)",
                                lineHeight: 1.4,
                              }}
                            >
                              - {item.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* Contact : icônes uniquement */}
                    <div style={{
                      padding: "1rem 0 0.5rem 0",
                      marginTop: "0.5rem",
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      gap: "2.5rem",
                      alignItems: "center",
                    }} className="asad-contact-row">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "1.1rem", color: "var(--emerald-900)", fontWeight: 700 }}>
                        <Phone size={20} color="var(--primary-gold)" />
                        <a href={`tel:${s.phoneHref}`} style={{ color: "inherit", textDecoration: "none" }}>{s.phone}</a>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.95rem", color: "#334155", fontWeight: 600 }}>
                        <Mail size={20} color="var(--primary-gold)" />
                        <a href={`mailto:${s.email}`} style={{ color: "inherit", textDecoration: "none" }}>{s.email}</a>
                      </div>
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. NOS PARTENAIRES */}
      <section style={{ padding: "2rem 0 4rem 0", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "1400px" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 800,
                letterSpacing: "3px",
                color: "var(--primary-gold)",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              ILS NOUS SOUTIENNENT
            </div>
            <h2
              className="font-serif"
              style={{ fontSize: "3rem", color: "var(--emerald-900)" }}
            >
              Nos partenaires institutionnels
            </h2>
          </div>

          <div
            className="asad-partners-list"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "6rem",
              flexWrap: "wrap",
              opacity: 0.7,
            }}
          >
            {/* Using some placeholder/representative partner logos or names if actual logos aren't available */}
            {[
              "Ville de Bourg-la-Reine",
              "CCAS",
              "Département des Hauts-de-Seine",
              "ARS Île-de-France",
            ].map((partner, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  color: "var(--emerald-900)",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "1px",
                }}
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FINAL PRESTIGE CTA */}
      <section style={{ margin: "0", padding: "0" }}>
        <div
          style={{
            background: "var(--emerald-900)",
            padding: "5rem 2rem",
            textAlign: "center",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Elegant Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: "-5%",
              right: "-2%",
              fontSize: "12rem",
              opacity: 0.03,
              color: "#fff",
              fontFamily: "var(--font-sans)",
              pointerEvents: "none",
            }}
          >
            ASAD
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                marginBottom: "1.5rem",
                lineHeight: 1.1,
              }}
            >
              Besoin d'un{" "}
              <span
                style={{ fontStyle: "italic", color: "var(--primary-gold)" }}
              >
                accompagnement ?
              </span>
            </h2>
            <p
              style={{
                fontSize: "1.2rem",
                opacity: 0.9,
                maxWidth: "650px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Nos équipes d'experts sont à votre disposition pour vous guider
              vers le service le plus adapté à votre situation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment" style={{ padding: "5rem 0", background: "#fff" }}>
        <div className="container" style={{ maxWidth: "780px", padding: "0 1.5rem" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 className="font-serif" style={{
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              color: "var(--emerald-900)", fontWeight: 900, lineHeight: 1.2, margin: 0,
            }}>
              Comment ça marche ?
            </h2>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              {
                num: "1", title: "Nous vous appelons",
                desc: "L'ASAD prend contact avec vous et organise une visite à domicile pour comprendre vos besoins.",
                icon: Phone, iconColor: "#10b981", bg: "#e8f4f0",
              },
              {
                num: "2", title: "Nous préparons votre devis",
                desc: "Un budget adapté à votre situation. Nous gérons toutes les démarches pour vous.",
                icon: ClipboardCheck, iconColor: "#d4af37", bg: "#fef9ec",
              },
              {
                num: "3", title: "Nous choisissons ensemble",
                desc: "Nous sélectionnons un intervenant de confiance, selon vos préférences.",
                icon: Users, iconColor: "#6366f1", bg: "#eef2ff",
              },
              {
                num: "4", title: "Vous profitez de chez vous",
                desc: "Une prestation de qualité, pour que vous soyez heureux à votre domicile.",
                icon: Heart, iconColor: "#ef4444", bg: "#fef2f2",
              },
              {
                num: "5", title: "Nous restons à vos côtés",
                desc: "Un suivi continu, des ajustements selon vos besoins, à chaque étape.",
                icon: ShieldCheck, iconColor: "#22c55e", bg: "#f0fdf4",
              },
            ].map((step, i, arr) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                style={{
                  display: "flex",
                  gap: "1.75rem",
                  alignItems: "flex-start",
                  paddingBottom: i < arr.length - 1 ? "2.5rem" : "0",
                  position: "relative",
                }}
              >
                {/* Colonne gauche : numéro + ligne */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: "56px" }}>
                  {/* Cercle numéro */}
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "50%",
                    background: step.bg,
                    border: `2px solid ${step.iconColor}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <step.icon size={26} color={step.iconColor} strokeWidth={1.8} />
                  </div>
                  {/* Ligne verticale entre les étapes */}
                  {i < arr.length - 1 && (
                    <div style={{
                      width: "2px", flex: 1, minHeight: "2.5rem",
                      background: "linear-gradient(to bottom, #e8e2d6, transparent)",
                      marginTop: "0.5rem",
                    }} />
                  )}
                </div>

                {/* Texte */}
                <div style={{ paddingTop: "0.75rem" }}>
                  <div style={{
                    display: "inline-block",
                    background: "var(--emerald-900)",
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    padding: "0.2rem 0.7rem",
                    borderRadius: "100px",
                    marginBottom: "0.6rem",
                  }}>
                    ÉTAPE {step.num}
                  </div>
                  <h3 style={{
                    fontSize: "1.25rem", fontWeight: 800,
                    color: "var(--emerald-900)", lineHeight: 1.3, margin: "0 0 0.5rem",
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    color: "#64748b", lineHeight: 1.75, fontSize: "1rem", margin: 0,
                  }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI CHOISIR L'ASAD */}
      <section id="pourquoi" style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container">

          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 className="font-serif" style={{ fontSize: '2.5rem', color: 'var(--emerald-900)', marginBottom: '1.5rem' }}>
              Pourquoi choisir l'ASAD ?
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
              Depuis 1961, nous accompagnons les seniors de Bourg-la-Reine avec expertise, humanité et engagement.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }} className="pourquoi-grid">
            {[
              {
                icon: ShieldCheck, color: "#10b981", bg: "#e8f4f0",
                title: "Plus de 60 ans d'expérience",
                desc: "Association réginaburgienne fondée en 1961, l'ASAD est un acteur de référence reconnu par les institutions locales et régionales."
              },
              {
                icon: Users, color: "#3b82f6", bg: "#eff6ff",
                title: "Une équipe pluridisciplinaire",
                desc: "Auxiliaires de vie, infirmiers, coordinatrices : nos professionnels qualifiés forment une équipe soudée autour de votre bien-être."
              },
              {
                icon: Heart, color: "#ef4444", bg: "#fef2f2",
                title: "Un accompagnement sur mesure",
                desc: "Chaque bénéficiaire est unique. Nous évaluons vos besoins à domicile pour construire un plan d'aide adapté à votre situation et votre budget."
              },
              {
                icon: Building2, color: "#064e3b", bg: "#e8f4f0",
                title: "Partenariats institutionnels",
                desc: "En lien direct avec la Ville, le CCAS, le Département et l'ARS, nous bénéficions d'un réseau solide pour vous offrir le meilleur service."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                style={{
                  padding: '2rem 1.5rem',
                  background: '#f8fafc',
                  borderRadius: '24px',
                  border: '1px solid #f1f5f9',
                  textAlign: 'center',
                  aspectRatio: '1 / 1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '280px',
                  margin: '0 auto'
                }}
              >
                <div style={{
                  width: '60px', height: '60px',
                  background: item.bg,
                  color: item.color,
                  borderRadius: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  flexShrink: 0
                }}>
                  <item.icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--emerald-900)' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* ===== HERO ===== */
        @media (max-width: 991px) {
          .asad-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .asad-hero-content { order: 1; }
          .asad-hero-media {
            order: 2;
            max-width: 100% !important;
            margin: 0 auto;
          }
          .asad-hero-media img {
            max-width: 100% !important;
            border-radius: 24px !important;
          }
          .asad-hero-title {
            white-space: normal !important;
            font-size: 2.2rem !important;
            letter-spacing: -1px !important;
          }
          .asad-hero-title-line,
          .asad-hero-title-accent { display: block; }
        }

        @media (max-width: 576px) {
          .asad-hero-title {
            font-size: 1.8rem !important;
            line-height: 1.15 !important;
          }
        }

        /* ===== SECTION INTRO h2 ===== */
        @media (max-width: 768px) {
          .asad-section-intro h2 {
            white-space: normal !important;
            font-size: 1.4rem !important;
          }
          .asad-section-intro {
            padding-left: 1rem !important;
          }
        }

        /* ===== SERVICES : contacts grid ===== */
        @media (max-width: 576px) {
          .asad-contacts-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* ===== CONTACT TÉLÉPHONE / EMAIL ===== */
        @media (max-width: 640px) {
          .asad-contact-row {
            flex-direction: column !important;
            gap: 1.5rem !important;
            align-items: flex-start !important;
          }
        }

        /* ===== PARTENAIRES ===== */
        @media (max-width: 640px) {
          .asad-partners-list {
            gap: 2rem !important;
            font-size: 1rem !important;
          }
        }

        /* ===== COMMENT ÇA MARCHE — mobile vertical ===== */

        /* ===== SERVICES — réduit le padding gauche sur mobile ===== */
        @media (max-width: 768px) {
          #quoi .container {
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
          }
        }

        /* ===== POURQUOI CHOISIR L'ASAD GRID RESPONSIVE ===== */
        @media (max-width: 991px) {
          .pourquoi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 576px) {
          .pourquoi-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `,
        }}
      />
    </motion.div>
  );
};

export default Asad;
