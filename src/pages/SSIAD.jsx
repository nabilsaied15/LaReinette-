import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { 
  Heart, 
  CheckCircle2, 
  ArrowLeft, 
  Phone, 
  Stethoscope, 
  ShieldCheck,
  Activity,
  ClipboardCheck,
  UserCheck,
  Plus,
  Cross,
  Microscope,
  FileText,
  Ambulance,
  Star,
  ChevronDown,
  PhoneCall,
  Info,
  MapPin
} from 'lucide-react';
import SEO from '../components/SEO';
import mairieImg from '../assets/mairie.jpg';

const SSIAD = () => {
  const navigate = useNavigate();
  const { settings, isSettingsLoading } = useSettings();
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isSettingsLoading) return null;

  const data = settings?.ssiadSaad?.ssiad || {
    title: "SSIAD - Soins Infirmiers",
    description: "Service de Soins Infirmiers à Domicile pour votre santé.",
    public: "S'adresse aux personnes âgées de 60 ans et plus ou handicapées.",
    access: "Sur prescription médicale uniquement."
  };

  const medicalExpertise = [
    {
      title: "Hygiène & Confort",
      desc: "Toilettes médicalisées et soins de bien-être assurés par nos aides-soignants.",
      icon: UserCheck
    },
    {
      title: "Soins Infirmiers",
      desc: "Pansements complexes, injections, prélèvements et suivi des perfusions.",
      icon: Stethoscope
    },
    {
      title: "Suivi Thérapeutique",
      desc: "Gestion des traitements, surveillance des constantes et éducation.",
      icon: Activity
    },
    {
      title: "Coordination",
      desc: "Lien permanent avec votre médecin traitant et l'hôpital.",
      icon: ClipboardCheck
    }
  ];

  const faqs = [
    {
      q: "Comment bénéficier du service SSIAD ?",
      a: "Une prescription médicale est indispensable. Contactez-nous ensuite pour organiser une visite d'évaluation par notre infirmière coordinatrice."
    },
    {
      q: "Combien coûte le service SSIAD ?",
      a: "Les soins dispensés par le SSIAD sont pris en charge à 100% par l'Assurance Maladie. Vous n'avez aucune avance de frais à faire."
    },
    {
      q: "Quelle est la zone d'intervention ?",
      a: "Nous intervenons sur la ville de Bourg-la-Reine et les communes limitrophes selon les places disponibles dans notre service agréé."
    }
  ];

  const themeColor = "#3b82f6"; // Same blue as Teleassistance

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: '#fff', color: '#1a1a1a' }}
    >
      <SEO 
        title="SSIAD - Expertise Médicale à Domicile - ASAD Bourg-la-Reine"
        description="L'expertise hospitalière chez vous. Soins infirmiers et d'hygiène remboursés à 100% par l'Assurance Maladie."
      />

      {/* HERO SECTION - Blue Theme */}
      <section style={{ 
        padding: '140px 0 100px', 
        background: 'linear-gradient(180deg, #f0f7ff 0%, #fff 100%)',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '6rem', alignItems: 'center' }} className="ssiad-hero-grid">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', color: '#fbbf24' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>Soins agréés par l'Assurance Maladie</span>
              </div>
              
              <h1 className="font-serif" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: '#0f172a', lineHeight: 1.1, marginBottom: '2rem', fontWeight: 900 }}>
                L'expertise médicale <br />
                <span style={{ color: themeColor, fontStyle: 'italic', fontWeight: 300 }}>directement chez vous.</span>
              </h1>
              
              <p style={{ fontSize: '1.3rem', color: '#64748b', lineHeight: 1.6, maxWidth: '650px', marginBottom: '3.5rem' }}>
                {data.description} Nos équipes soignantes diplômées vous accompagnent pour garantir votre santé et votre confort en toute sécurité.
              </p>

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => navigate('/contact')}
                  style={{ 
                    padding: '1.5rem 3.5rem', 
                    borderRadius: '8px', 
                    background: themeColor, 
                    color: '#fff', 
                    fontWeight: 800, 
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)'
                  }}
                >
                  Contacter la coordination
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                    <PhoneCall size={20} color={themeColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Standard Médical</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{settings.general.mainPhone}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{ borderRadius: '40px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" 
                    alt="Soins infirmiers à domicile - SSIAD"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
                <div style={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  right: '-20px', 
                  background: '#fff', 
                  padding: '1.5rem', 
                  borderRadius: '20px', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <Plus size={24} color={themeColor} />
                  <span style={{ fontWeight: 800 }}>Soins Conventionnés</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EXPERTISE GRID - Blue Theme Icons */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 className="font-serif" style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '1.5rem' }}>Nos domaines d'intervention</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Une prise en charge médicale pluridisciplinaire et coordonnée.</p>
          </div>

          <div className="expertise-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            {medicalExpertise.map((m, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                style={{
                  padding: '3rem',
                  background: '#f8fafc',
                  borderRadius: '24px',
                  border: '1px solid #f1f5f9',
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  width: '70px', 
                  height: '70px', 
                  background: '#eff6ff', 
                  color: themeColor, 
                  borderRadius: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 2rem'
                }}>
                  <m.icon size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>{m.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO BLOCKS - Blue Theme */}
      <section style={{ padding: '100px 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }} className="ssiad-info-grid">
            <div style={{ padding: '4rem', background: '#1e293b', color: '#fff', borderRadius: '40px' }}>
              <h3 className="font-serif" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Public Concerné</h3>
              <p style={{ fontSize: '1.2rem', opacity: 0.8, lineHeight: 1.7, marginBottom: '3rem' }}>{data.public}</p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color={themeColor} /> Personnes de +60 ans</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color={themeColor} /> Personnes handicapées</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color={themeColor} /> Affections de longue durée</li>
              </ul>
            </div>
            <div style={{ padding: '4rem', background: '#fff', border: `1px solid #e2e8f0`, borderRadius: '40px' }}>
              <h3 className="font-serif" style={{ fontSize: '2rem', marginBottom: '2rem', color: '#0f172a' }}>Modalités d'accès</h3>
              <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.7, marginBottom: '2rem' }}>{data.access}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: '#f0f7ff', borderRadius: '16px', color: themeColor }}>
                <FileText size={24} />
                <span style={{ fontWeight: 700 }}>Prescription médicale obligatoire</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL TRUST - LA MAIRIE */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '6rem', 
            alignItems: 'center',
            background: '#f8fafc',
            padding: '5rem',
            borderRadius: '40px',
            border: '1px solid #e2e8f0'
          }} className="ssiad-trust-grid">
            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
                <img 
                  src={mairieImg} 
                  alt="Hôtel de Ville de Bourg-la-Reine"
                  style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                background: '#fff',
                padding: '0.8rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                border: '1px solid #e2e8f0'
              }}>
                <MapPin size={16} color={themeColor} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '1px', textTransform: 'uppercase' }}>Hôtel de Ville</span>
              </div>
            </div>
            <div>
              <div style={{ color: themeColor, fontWeight: 800, fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Confiance Municipale</div>
              <h2 className="font-serif" style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '2rem' }}>Une alliance pour le bien-être de nos aînés</h2>
              <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                Dès son lancement, la Mairie de Bourg-la-Reine a accordé sa pleine confiance à l'ASAD pour porter le projet "La Reinette". Ce partenariat public-associatif unique permet de garantir un service de transport accompagné de haute qualité, sécurisé et accessible financièrement à tous les seniors de la commune.
              </p>
              <div style={{ display: 'flex', gap: '3rem' }}>
                <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>2025</div>
                  <div style={{ fontSize: '0.8rem', color: themeColor, fontWeight: 800 }}>LANCEMENT</div>
                </div>
                <div style={{ width: '1px', background: '#e2e8f0' }} />
                <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>100%</div>
                  <div style={{ fontSize: '0.8rem', color: themeColor, fontWeight: 800 }}>SOUTIEN CCAS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="font-serif" style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '5rem' }}>Questions Fréquentes</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                style={{ 
                  background: '#fff', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  border: '1px solid #f1f5f9'
                }}
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  style={{ 
                    width: '100%', 
                    padding: '2rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transform: activeFaq === i ? 'rotate(180deg)' : 'rotate(0)', 
                      transition: 'transform 0.3s ease',
                      color: themeColor
                    }} 
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 2rem 2.5rem', color: '#64748b', lineHeight: 1.8 }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '0 0 120px' }}>
        <div className="container">
          <div style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
            borderRadius: '40px', 
            padding: '8rem 4rem', 
            textAlign: 'center', 
            color: '#fff' 
          }}>
            <h2 className="font-serif" style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>Besoin de soins à domicile ?</h2>
            <p style={{ fontSize: '1.3rem', opacity: 0.8, maxWidth: '700px', margin: '0 auto 4rem' }}>
              Nos infirmières coordinatrices sont à votre disposition pour organiser votre prise en charge en lien avec votre médecin.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/contact')}
                style={{ 
                  padding: '1.8rem 5rem', 
                  borderRadius: '12px', 
                  background: themeColor, 
                  color: '#fff', 
                  border: 'none', 
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                Demander une prise en charge
              </button>
              <button 
                onClick={() => window.location.href = `tel:${settings.general.mainPhone}`}
                style={{ 
                  padding: '1.8rem 5rem', 
                  borderRadius: '12px', 
                  background: 'transparent', 
                  color: '#fff', 
                  border: '2px solid rgba(255,255,255,0.2)', 
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                Parler à une infirmière
              </button>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 991px) {
          .ssiad-hero-grid { grid-template-columns: 1fr !important; gap: 4rem !important; text-align: center !important; }
          .ssiad-hero-grid > div { align-items: center !important; }
          .ssiad-info-grid { grid-template-columns: 1fr !important; }
          .ssiad-trust-grid { grid-template-columns: 1fr !important; padding: 3rem !important; gap: 3rem !important; }
        }
      `}} />
    </motion.div>
  );
};

export default SSIAD;
