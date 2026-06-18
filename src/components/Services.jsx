import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Heart, User, Bell, X, CheckCircle2, Star, PhoneCall, Info, Sparkles, Utensils, Users, ClipboardCheck, Stethoscope, Activity, UserCheck, Plus, FileText, Zap, Headphones, ShieldCheck, ShieldAlert, Clock, Wifi, Package, ChevronDown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const IconMap = {
  Home: Home,
  Heart: Heart,
  User: User,
  Bell: Bell
};

const Services = () => {
  const { settings } = useSettings();
  const { services } = settings;
  const [selectedService, setSelectedService] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const closeModal = () => {
    setSelectedService(null);
    setActiveFaq(null);
    document.body.style.overflow = 'auto';
  };

  const openModal = (service) => {
    const title = service.title.split(' - ')[0];
    setSelectedService(title);
    document.body.style.overflow = 'hidden';
  };

  // --- CONTENT RENDERERS (PORTED FROM PREVIOUS PAGES) ---

  const renderSAAD = () => {
    const data = settings.ssiadSaad.saad;
    const themeColor = "#3b82f6";
    const saadServices = [
      { title: "Aide au Quotidien", desc: "Entretien du domicile, repassage et rangement.", icon: Sparkles },
      { title: "Repas & Courses", desc: "Préparation de menus et réalisation des achats.", icon: Utensils },
      { title: "Vie Sociale", desc: "Compagnie, sorties et activités.", icon: Users },
      { title: "Administratif", desc: "Aide à la gestion des courriers.", icon: ClipboardCheck }
    ];
    return (
      <div style={{ color: '#1a1a1a' }}>
        <div style={{ background: 'linear-gradient(180deg, #f0f7ff 0%, #fff 100%)', padding: '4rem 2rem', borderRadius: '24px', marginBottom: '3rem' }}>
          <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>L'aide à domicile <span style={{ color: themeColor, fontStyle: 'italic', fontWeight: 300 }}>en toute confiance.</span></h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>{data.description}</p>
        </div>
        <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {saadServices.map((s, i) => (
            <div key={i} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ color: themeColor, marginBottom: '1rem' }}><s.icon size={28} /></div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{s.title}</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ padding: '2rem', background: '#1e293b', color: '#fff', borderRadius: '20px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Public Concerné</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{data.public}</p>
          </div>
          <div style={{ padding: '2rem', background: '#f0f7ff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '1rem' }}>Modalités d'accès</h4>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{data.access}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderSSIAD = () => {
    const data = settings.ssiadSaad.ssiad;
    const themeColor = "#3b82f6";
    const medicalExpertise = [
      { title: "Hygiène & Confort", desc: "Toilettes médicalisées.", icon: UserCheck },
      { title: "Soins Infirmiers", desc: "Pansements, injections.", icon: Stethoscope },
      { title: "Suivi Thérapeutique", desc: "Gestion des traitements.", icon: Activity },
      { title: "Coordination", desc: "Lien avec le médecin traitant.", icon: ClipboardCheck }
    ];
    return (
      <div style={{ color: '#1a1a1a' }}>
        <div style={{ background: 'linear-gradient(180deg, #f0f7ff 0%, #fff 100%)', padding: '4rem 2rem', borderRadius: '24px', marginBottom: '3rem' }}>
          <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>L'expertise médicale <span style={{ color: themeColor, fontStyle: 'italic', fontWeight: 300 }}>directement chez vous.</span></h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>{data.description}</p>
        </div>
        <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {medicalExpertise.map((s, i) => (
            <div key={i} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ color: themeColor, marginBottom: '1rem' }}><s.icon size={28} /></div>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{s.title}</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ padding: '2rem', background: '#1e293b', color: '#fff', borderRadius: '20px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Public Concerné</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{data.public}</p>
          </div>
          <div style={{ padding: '2rem', background: '#f0f7ff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '1rem' }}>Modalités d'accès</h4>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{data.access}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderTeleassistance = () => {
    const data = settings.ssiadSaad.teleassistance;
    const themeColor = "#3b82f6";
    const steps = [
      { n: "01", t: "Alerte Déclenchée", d: "Bouton SOS ou détection chute.", i: Zap },
      { n: "02", t: "Analyse Immédiate", d: "Opérateur en moins de 30s.", i: Headphones },
      { n: "03", t: "Secours Mobilisés", d: "Alerte proches ou SAMU.", i: ShieldAlert }
    ];
    const offers = [
      { t: "Pack Classique", p: "24.90", tp: "12.45" },
      { t: "Pack Mobilité", p: "29.90", tp: "14.95", pop: true },
      { t: "Pack Sérénité +", p: "39.90", tp: "19.95" }
    ];
    return (
      <div style={{ color: '#1a1a1a' }}>
        <div style={{ background: 'linear-gradient(180deg, #f0f7ff 0%, #fff 100%)', padding: '4rem 2rem', borderRadius: '24px', marginBottom: '3rem' }}>
          <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 900 }}>Votre sécurité assurée <span style={{ color: themeColor, fontStyle: 'italic', fontWeight: 300 }}>au quotidien.</span></h2>
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>{data.description}</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '2rem' }}>Comment ça fonctionne ?</h3>
          <div className="step-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: themeColor }}>
                  <s.i size={24} />
                </div>
                <h5 style={{ fontWeight: 800, fontSize: '0.9rem' }}>{s.t}</h5>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {offers.map((o, i) => (
            <div key={i} style={{
              padding: '2rem',
              background: '#fff',
              borderRadius: '20px',
              border: o.pop ? `2px solid ${themeColor}` : '1px solid #e2e8f0',
              textAlign: 'center',
              position: 'relative'
            }}>
              {o.pop && <div style={{ position: 'absolute', top: '-10px', right: '10px', background: themeColor, color: '#fff', padding: '2px 10px', borderRadius: '10px', fontSize: '0.7rem' }}>Populaire</div>}
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{o.t}</h4>
              <div style={{ fontSize: '2rem', fontWeight: 900 }}>{o.p}€<span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/mois</span></div>
              <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '5px' }}>{o.tp}€ après crédit d'impôt</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-lg" style={{ backgroundColor: 'var(--bg-creme)' }} id="services">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '6rem' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>VOTRE MOBILITÉ</div>
          <h2 className="section-title">La Reinette. <br /> <span className="text-gold" style={{ fontStyle: 'italic' }}>La SéReinité.</span></h2>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '2rem auto 0', fontSize: '1.2rem' }}>
            Bien plus qu'un simple trajet, nous vous offrons un accompagnement attentionné et sécurisé pour préserver votre lien avec la vie locale.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}
        >
          {services.items.map((service, index) => {
            const IconComponent = IconMap[service.iconType] || Home;
            const titlePrefix = service.title.split(' - ')[0];
            const isSpecialService = ['SAAD', 'SSIAD', 'Téléassistance'].includes(titlePrefix);

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                onClick={() => isSpecialService ? openModal(service) : window.location.href = service.link}
                whileHover={{
                  y: -5,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  cursor: 'pointer'
                }}
                style={{
                  background: 'transparent',
                  padding: '4rem 2rem',
                  borderTop: '1px solid #e5e0d8',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  height: '100%',
                  transition: 'background-color 0.3s ease'
                }}
              >
                {/* Background Number */}
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  fontSize: '6rem',
                  fontWeight: 900,
                  color: 'rgba(0, 0, 0, 0.03)',
                  fontFamily: "var(--font-display)",
                  zIndex: 0
                }}>
                  0{index + 1}
                </span>

                {/* Big Background Icon Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '-20px',
                  opacity: 0.02,
                  color: 'var(--text-main)',
                  zIndex: 0,
                  transform: 'rotate(-15deg)'
                }}>
                  <IconComponent size={200} strokeWidth={1} />
                </div>

                <div style={{
                  width: '75px',
                  height: '75px',
                  borderRadius: '16px',
                  background: 'rgba(0,0,0,0.03)',
                  color: 'var(--primary-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <IconComponent size={32} />
                </div>

                <div style={{ zIndex: 1 }}>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-main)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                    {service.title}
                  </h3>

                  {service.points && (
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.8rem'
                    }}>
                      {service.points.map((point, idx) => (
                        <li key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          fontSize: '1.05rem',
                          color: '#4b5563',
                          lineHeight: 1.4
                        }}>
                          <span style={{
                            width: '8px',
                            height: '2px',
                            background: 'var(--primary-green)',
                            flexShrink: 0
                          }} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* --- MODAL FOR IN-PAGE DETAILS --- */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                background: '#fff',
                borderRadius: '32px',
                boxShadow: '0 50px 100px rgba(0,0,0,0.2)',
                overflowY: 'auto',
                position: 'relative'
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <X size={20} />
              </button>

              <div style={{ padding: '4rem' }}>
                {selectedService === 'SAAD' && renderSAAD()}
                {selectedService === 'SSIAD' && renderSSIAD()}
                {selectedService === 'Téléassistance' && renderTeleassistance()}

                <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => window.location.href = '/contact'}
                    style={{ padding: '1.2rem 3rem', borderRadius: '12px', background: '#3b82f6', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                  >
                    Demander un devis gratuit
                  </button>
                  <button
                    onClick={() => window.location.href = `tel:${settings.general.mainPhone}`}
                    style={{ padding: '1.2rem 3rem', borderRadius: '12px', background: 'transparent', color: '#0f172a', fontWeight: 800, border: '1px solid #e2e8f0', cursor: 'pointer' }}
                  >
                    Appeler un conseiller
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 768px) {
          .bento-grid, .info-grid, .step-grid { grid-template-columns: 1fr !important; }
          .contact-footer-btns { flex-direction: column !important; }
          .modal-content-wrapper { padding: 2rem 1rem !important; }
        }
      `}} />
    </section>
  );
};

export default Services;
