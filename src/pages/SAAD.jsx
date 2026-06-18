import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { 
  Home, 
  CheckCircle2, 
  ArrowLeft, 
  Phone, 
  Users, 
  ShieldCheck,
  ClipboardCheck,
  ShoppingBag,
  Utensils,
  Sparkles,
  Heart,
  Smile,
  Clock,
  MapPin,
  Star,
  ChevronDown,
  PhoneCall,
  Mail,
  Info
} from 'lucide-react';
import SEO from '../components/SEO';

const SAAD = () => {
  const navigate = useNavigate();
  const { settings, isSettingsLoading } = useSettings();
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isSettingsLoading) return null;

  const data = settings?.ssiadSaad?.saad || {
    title: "SAAD - Aide & Accompagnement",
    description: "Service d'Aide et d'Accompagnement à Domicile pour préserver votre autonomie.",
    public: "S'adresse aux seniors souhaitant un soutien quotidien.",
    access: "Contactez l'ASAD pour une évaluation de vos besoins."
  };

  const services = [
    {
      title: "Toilette",
      desc: "Aide à la toilette et aux soins d'hygiène quotidienne dans le respect de votre dignité et votre confort.",
      img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Repas",
      desc: "Préparation de repas équilibrés et adaptés à vos goûts et besoins nutritionnels.",
      img: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Courses",
      desc: "Réalisation de vos courses alimentaires et autres achats du quotidien selon vos souhaits.",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Promenade",
      desc: "Accompagnement lors de promenades et sorties pour rompre l'isolement et garder le lien social.",
      img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Entretien de votre domicile",
      desc: "Ménage, repassage et rangement pour un foyer propre, sain et agréable à vivre.",
      img: "https://images.unsplash.com/photo-1581578731522-745d05db972a?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const faqs = [
    {
      q: "Comment sont sélectionnés vos intervenants ?",
      a: "Tous nos auxiliaires de vie sont diplômés ou disposent d'une expérience significative. Ils sont recrutés pour leurs compétences techniques mais aussi pour leurs qualités humaines."
    },
    {
      q: "Puis-je bénéficier d'aides financières ?",
      a: "Oui, selon votre situation, vous pouvez être éligible à l'APA (Allocation Personnalisée d'Autonomie), à la PCH, ou bénéficier du crédit d'impôt de 50%."
    },
    {
      q: "Y a-t-il un engagement de durée ?",
      a: "Non, nos contrats sont flexibles. Vous pouvez suspendre ou modifier les interventions avec un simple préavis, sans frais de résiliation."
    }
  ];

  const themeColor = "#3b82f6";

  const phone = settings?.general?.mainPhone || "01 79 71 75 42";
  const email = settings?.general?.contactEmail || settings?.contact?.email || "lareinette@asad-bourg-la-reine.fr";
  const address = settings?.contact?.address || "3-5, allée Françoise Dolto";
  const city = settings?.contact?.city || "92340 Bourg-la-Reine";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: '#fff', color: '#1a1a1a' }}
    >
      <SEO 
        title="SAAD - Aide à Domicile de Qualité - ASAD Bourg-la-Reine"
        description="Vivez sereinement chez vous avec un accompagnement sur mesure. Ménage, repas et aide sociale de haute qualité."
      />

      {/* HERO SECTION */}
      <section style={{ 
        padding: '140px 0 100px', 
        background: 'linear-gradient(180deg, #f0f7ff 0%, #fff 100%)',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '6rem', alignItems: 'center' }} className="saad-hero-grid">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', color: '#fbbf24' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>Accompagnement certifié Qualité</span>
              </div>
              
              <h1 className="font-serif" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', color: '#0f172a', lineHeight: 1.1, marginBottom: '2rem', fontWeight: 900 }}>
                L'aide à domicile <br />
                <span style={{ color: themeColor, fontStyle: 'italic', fontWeight: 300 }}>en toute confiance.</span>
              </h1>
              
              <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.6, maxWidth: '650px', marginBottom: '3.5rem' }}>
                {data.description} Nous mettons à votre service des professionnels dévoués pour simplifier votre quotidien et préserver votre autonomie.
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button 
                  onClick={() => navigate('/contact')}
                  style={{ 
                    padding: '1.2rem 2.5rem', 
                    borderRadius: '8px', 
                    background: themeColor, 
                    color: '#fff', 
                    fontWeight: 800, 
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)'
                  }}
                >
                  Demander un devis
                </button>
                <a 
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.8rem',
                    textDecoration: 'none',
                    padding: '1.2rem 2rem',
                    borderRadius: '8px',
                    border: `2px solid ${themeColor}`,
                    color: themeColor,
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <PhoneCall size={20} />
                  {phone}
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="saad-hero-img"
            >
              <div style={{ position: 'relative' }}>
                <div style={{ borderRadius: '40px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80" 
                    alt="Aide à domicile - auxiliaire de vie avec une personne âgée"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-20px', 
                  right: '-20px', 
                  background: '#fff', 
                  padding: '1.2rem 1.5rem', 
                  borderRadius: '20px', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem'
                }}>
                  <Heart size={24} color="#ef4444" fill="#ef4444" />
                  <span style={{ fontWeight: 800 }}>Présence Humaine</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT BAND ─── */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ 
              display: 'inline-block', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '3px',
              textTransform: 'uppercase', color: themeColor, marginBottom: '1rem'
            }}>Nous joindre</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#fff', margin: 0 }}>
              Contactez le SAAD
            </h2>
          </div>

          <div className="saad-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>

            {/* Phone */}
            <motion.a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              whileHover={{ y: -6, boxShadow: '0 30px 60px rgba(59,130,246,0.25)' }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                gap: '1.2rem', padding: '2.5rem 2rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '90px', height: '90px', borderRadius: '50%',
                background: `rgba(59,130,246,0.15)`,
                border: `2px solid ${themeColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Phone size={38} color={themeColor} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                  Téléphone
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: '#fff', letterSpacing: '0.5px' }}>
                  {phone}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.6rem' }}>
                  Lun – Ven · 8h30–17h30
                </div>
              </div>
            </motion.a>

            {/* Email */}
            <motion.a
              href={`mailto:${email}`}
              whileHover={{ y: -6, boxShadow: '0 30px 60px rgba(59,130,246,0.25)' }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                gap: '1.2rem', padding: '2.5rem 2rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '90px', height: '90px', borderRadius: '50%',
                background: `rgba(59,130,246,0.15)`,
                border: `2px solid ${themeColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Mail size={38} color={themeColor} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                  Email
                </div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: '#fff', wordBreak: 'break-all', lineHeight: 1.5 }}>
                  {email}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.6rem' }}>
                  Réponse sous 24h
                </div>
              </div>
            </motion.a>

            {/* Address */}
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 30px 60px rgba(59,130,246,0.25)' }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                gap: '1.2rem', padding: '2.5rem 2rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                cursor: 'default',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '90px', height: '90px', borderRadius: '50%',
                background: `rgba(59,130,246,0.15)`,
                border: `2px solid ${themeColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <MapPin size={38} color={themeColor} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                  Adresse
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: '#fff', lineHeight: 1.5 }}>
                  {address}
                </div>
                <div style={{ fontSize: "15px", color: '#94a3b8', marginTop: '0.3rem', fontWeight: 600 }}>
                  {city}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#0f172a', marginBottom: '1.5rem' }}>Nos prestations sur-mesure</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Un accompagnement complet pour tous les besoins de la vie quotidienne.</p>
          </div>

          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
            {services.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, boxShadow: '0 30px 60px rgba(59,130,246,0.12)' }}
                style={{
                  background: '#fff',
                  borderRadius: '24px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'box-shadow 0.3s ease'
                }}
              >
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={s.img}
                    alt={s.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '60px',
                    background: 'linear-gradient(transparent, rgba(15,23,42,0.5))'
                  }} />
                </div>
                <div style={{ padding: '1.8rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.8rem', color: '#0f172a' }}>{s.title}</h3>
                  <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INFO BLOCKS */}
      <section style={{ padding: '100px 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }} className="saad-info-grid">
            <div style={{ padding: '4rem', background: '#1e293b', color: '#fff', borderRadius: '40px' }}>
              <h3 className="font-serif" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Public Concerné</h3>
              <p style={{ fontSize: '1.2rem', opacity: 0.8, lineHeight: 1.7, marginBottom: '3rem' }}>{data.public}</p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color={themeColor} /> Personnes âgées</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color={themeColor} /> Personnes en situation de handicap</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={18} color={themeColor} /> Retour d'hospitalisation</li>
              </ul>
            </div>
            <div style={{ padding: '4rem', background: '#fff', border: `1px solid #e2e8f0`, borderRadius: '40px' }}>
              <h3 className="font-serif" style={{ fontSize: '2rem', marginBottom: '2rem', color: '#0f172a' }}>Modalités d'accès</h3>
              <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.7, marginBottom: '2rem' }}>{data.access}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: '#f0f7ff', borderRadius: '16px', color: themeColor }}>
                <Info size={24} />
                <span style={{ fontWeight: 700 }}>Crédit d'impôt de 50% applicable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', textAlign: 'center', marginBottom: '5rem' }}>Questions Fréquentes</h2>
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
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transform: activeFaq === i ? 'rotate(180deg)' : 'rotate(0)', 
                      transition: 'transform 0.3s ease',
                      color: themeColor,
                      flexShrink: 0,
                      marginLeft: '1rem'
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
            padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 4rem)', 
            textAlign: 'center', 
            color: '#fff' 
          }}>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '2rem' }}>Besoin d'un accompagnement ?</h2>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', opacity: 0.8, maxWidth: '700px', margin: '0 auto 4rem' }}>
              Nos coordinateurs se déplacent gratuitement chez vous pour évaluer vos besoins et mettre en place une aide personnalisée.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/contact')}
                style={{ 
                  padding: 'clamp(1rem, 2vw, 1.8rem) clamp(2rem, 4vw, 5rem)', 
                  borderRadius: '12px', 
                  background: themeColor, 
                  color: '#fff', 
                  border: 'none', 
                  fontWeight: 900,
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  cursor: 'pointer'
                }}
              >
                Nous contacter
              </button>
              <button 
                onClick={() => window.location.href = `tel:${phone.replace(/\s+/g, '')}`}
                style={{ 
                  padding: 'clamp(1rem, 2vw, 1.8rem) clamp(2rem, 4vw, 5rem)', 
                  borderRadius: '12px', 
                  background: 'transparent', 
                  color: '#fff', 
                  border: '2px solid rgba(255,255,255,0.2)', 
                  fontWeight: 800,
                  fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                  cursor: 'pointer'
                }}
              >
                Appeler le {phone}
              </button>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Hero grid ── */
        .saad-hero-grid { grid-template-columns: 1.2fr 0.8fr; }
        @media (max-width: 991px) {
          .saad-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
            text-align: center !important;
          }
          .saad-hero-img { display: none; }
        }

        /* ── Contact band ── */
        .saad-contact-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) {
          .saad-contact-grid { grid-template-columns: 1fr !important; }
        }

        /* ── Info grid ── */
        .saad-info-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) {
          .saad-info-grid { grid-template-columns: 1fr !important; }
          .saad-info-grid > div { padding: 2.5rem !important; border-radius: 24px !important; }
        }

        /* ── Services ── */
        @media (max-width: 480px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }

        /* ── Global spacing on small screens ── */
        @media (max-width: 600px) {
          .container { padding-left: 1.2rem !important; padding-right: 1.2rem !important; }
        }
      `}} />
    </motion.div>
  );
};

export default SAAD;
