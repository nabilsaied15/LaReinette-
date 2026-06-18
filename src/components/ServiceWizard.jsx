import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, HelpCircle, Heart, Home, ArrowLeft, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const serviceDetails = {
  saad: {
    number: "01",
    title: "SAAD - Aide à Domicile",
    description: "Une gamme complète de services pour faciliter votre vie quotidienne et maintenir votre indépendance.",
    items: [
      "Aide à la préparation des repas",
      "Entretien du logement et des vitres",
      "Entretien du linge et repassage",
      "Accompagnement aux courses et sorties"
    ],
    icon: Home,
    color: 'var(--primary-green)'
  },
  ssiad: {
    number: "02",
    title: "SSIAD - Soins Infirmiers",
    description: "Prise en charge médicale personnalisée sur prescription pour assurer votre bien-être à domicile.",
    items: [
      "Soins d'hygiène et de confort",
      "Coordination des soins médicaux",
      "Suivi par des infirmiers diplômés d'État",
      "Prévention et éducation thérapeutique"
    ],
    icon: Heart,
    color: '#e53e3e'
  },
  reinette: {
    number: "03",
    title: "La Reinette - Transport Adapté",
    description: "Notre service de transport spécialisé pour garantir votre mobilité et vos liens sociaux en toute sécurité.",
    items: [
      "Véhicules adaptés (PMR)",
      "Accompagnement personnalisé",
      "Rendez-vous médicaux et administratifs",
      "Sorties culturelles et loisirs"
    ],
    icon: MapPin,
    color: 'var(--primary-gold)'
  }
};

const ServiceWizard = () => {
  const { settings } = useSettings();
  const { wizard } = settings;
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <section className="py-lg" id="wizard" style={{ background: 'var(--bg-creme)' }}>
      <style>{`
        .wizard-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        @media (max-width: 991px) {
          .wizard-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        .wizard-card {
          padding: 4rem 2rem;
          border: 1px solid #e5e0d8;
          border-radius: 40px;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          width: 100%;
        }
        .wizard-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary-gold);
          background-color: #fdfbf7;
        }
        .wizard-card-icon {
          width: 90px;
          height: 90px;
          border-radius: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2.5rem;
          transition: all 0.5s ease;
        }
        .wizard-card:hover .wizard-card-icon {
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>
      <div className="container">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--primary-gold)',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '1.5rem'
            }}>
              Guichet Mixte
            </span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--emerald-900)', marginBottom: '2rem' }}>
              autour de votre <span style={{ fontStyle: 'italic', color: 'var(--primary-green)' }}>sérénité</span>
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
              Nous proposons des solutions d'aide et de soin adaptées à chaque étape, avec un engagement constant vers le confort et la dignité.
            </p>
          </div>

          <div style={{
            minHeight: '400px',
            position: 'relative'
          }}>
            <AnimatePresence mode='wait'>
              {!selectedCategory ? (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="wizard-grid">
                    {Object.entries(serviceDetails).map(([key, detail]) => {
                      const Icon = detail.icon;
                      return (
                        <motion.button
                          key={key}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedCategory(key)}
                          className="wizard-card"
                        >
                          <div className="wizard-card-icon" style={{
                            backgroundColor: detail.color + '10',
                            color: detail.color,
                          }}>
                            <Icon size={40} strokeWidth={1.5} />
                          </div>
                          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--emerald-900)', marginBottom: '1rem' }}>
                            {detail.title}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}
                >
                  <div>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-gold)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}
                    >
                      <ArrowLeft size={16} /> Retour aux catégories
                    </button>
                    <h3 className="font-serif" style={{ fontSize: '2.8rem', color: 'var(--emerald-900)', marginBottom: '1.5rem' }}>
                      {serviceDetails[selectedCategory].title}
                    </h3>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                      {serviceDetails[selectedCategory].description}
                    </p>
                    <button className="btn btn-primary" style={{ padding: '1.2rem 3rem', borderRadius: '100px' }}>
                      Demander un devis
                    </button>
                  </div>

                  <div style={{ padding: '2rem 0' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary-gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '2rem' }}>Nos prestations :</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1.5rem' }}>
                      {serviceDetails[selectedCategory].items.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'start', color: 'var(--emerald-900)', fontWeight: 600 }}>
                          <CheckCircle2 size={20} style={{ color: 'var(--primary-green)', flexShrink: 0, marginTop: '2px' }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceWizard;
