import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { 
  Bell, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  Heart,
  Activity,
  Home,
  Headphones,
  Signal,
  Smartphone,
  Calendar,
  AlertCircle,
  ChevronDown,
  Star,
  Info,
  ExternalLink,
  ShieldAlert,
  Wifi,
  Package
} from 'lucide-react';
import SEO from '../components/SEO';

const Teleassistance = () => {
  const navigate = useNavigate();
  const { settings, isSettingsLoading } = useSettings();
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isSettingsLoading) return null;

  const data = settings?.ssiadSaad?.teleassistance || {
    title: "Téléassistance - Sécurité 24h/24",
    description: "Un dispositif simple et efficace pour alerter les secours.",
    public: "S'adresse aux personnes vivant seules à leur domicile.",
    access: "Souscription simple auprès de l'ASAD."
  };

  const offers = [
    {
      title: "Pack Classique",
      price: "24.90",
      taxPrice: "12.45",
      features: [
        "Transmetteur GSM 4G/5G",
        "Médaillon ou Bracelet SOS",
        "Étanche sous la douche",
        "Veille 24h/24 et 7j/7",
        "Installation à domicile",
        "Maintenance incluse"
      ],
      popular: false
    },
    {
      title: "Pack Mobilité",
      price: "29.90",
      taxPrice: "14.95",
      features: [
        "Dispositif Géolocalisable",
        "Bouton SOS extérieur",
        "Détection de chute brutale",
        "Application pour les aidants",
        "Batterie haute autonomie",
        "Veille active 24h/24"
      ],
      popular: true
    },
    {
      title: "Pack Sérénité +",
      price: "39.90",
      taxPrice: "19.95",
      features: [
        "Caméra de levée de doute",
        "Micro & Haut-parleur 2 voies",
        "Vision nocturne HD",
        "Alertes intrusion incluses",
        "Stockage cloud sécurisé",
        "Priorité intervention"
      ],
      popular: false
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Alerte Déclenchée",
      desc: "Une simple pression sur le bouton ou une chute détectée lance l'appel immédiat.",
      icon: Zap
    },
    {
      number: "02",
      title: "Analyse Immédiate",
      desc: "Un opérateur qualifié dialogue avec vous via le haut-parleur en moins de 30s.",
      icon: Headphones
    },
    {
      number: "03",
      title: "Secours Mobilisés",
      desc: "Nous prévenons vos proches ou les services d'urgence (SAMU/Pompiers) si nécessaire.",
      icon: ShieldAlert
    }
  ];

  const faqs = [
    {
      q: "Ai-je besoin d'une ligne téléphonique fixe ?",
      a: "Non, nos dispositifs sont équipés de leur propre carte SIM multi-opérateurs. Ils fonctionnent partout sans abonnement téléphonique supplémentaire."
    },
    {
      q: "Le matériel fonctionne-t-il sous la douche ?",
      a: "Oui, nos médaillons et montres sont certifiés IP67. Il est d'ailleurs fortement conseillé de les porter sous la douche, lieu fréquent de chutes."
    },
    {
      q: "Comment bénéficier de la réduction d'impôt ?",
      a: "Notre service est agréé Service à la Personne. Vous recevez chaque année une attestation fiscale vous permettant de déduire 50% de vos cotisations de vos impôts."
    },
    {
      q: "Que se passe-t-il en cas de coupure de courant ?",
      a: "Nos boîtiers disposent d'une batterie de secours interne assurant un fonctionnement continu pendant 48h en cas de coupure électrique."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: '#fff', color: '#1a1a1a' }}
    >
      <SEO 
        title="Téléassistance Personnes Âgées - ASAD Bourg-la-Reine"
        description="Sécurisez votre maintien à domicile avec notre service de téléassistance 24h/7j. Réduction fiscale 50% et matériel dernière génération."
      />

      {/* --- REFINED HERO SECTION --- */}
      <section style={{ 
        padding: '140px 0 100px', 
        background: 'linear-gradient(180deg, #f0f7ff 0%, #fff 100%)',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '6rem', alignItems: 'center' }} className="tele-hero-grid">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', color: '#fbbf24' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>Service noté 4.9/5 par nos abonnés</span>
              </div>
              
              <h1 className="font-serif" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: '#0f172a', lineHeight: 1.1, marginBottom: '2rem', fontWeight: 900 }}>
                Votre sécurité assurée <br />
                <span style={{ color: '#3b82f6', fontStyle: 'italic', fontWeight: 300 }}>au quotidien, 24h/24.</span>
              </h1>
              
              <p style={{ fontSize: '1.3rem', color: '#64748b', lineHeight: 1.6, maxWidth: '650px', marginBottom: '3.5rem' }}>
                {data.description} Profitez de votre domicile en toute liberté avec une assistance humaine immédiate à portée de main.
              </p>

              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    const element = document.getElementById('offres');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{ 
                    padding: '1.5rem 3rem', 
                    borderRadius: '8px', 
                    background: '#3b82f6', 
                    color: '#fff', 
                    fontWeight: 800, 
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)'
                  }}
                >
                  Voir nos formules
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                    <PhoneCall size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Appel Gratuit</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{settings.general.mainPhone}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '4rem', display: 'flex', gap: '3rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#10b981" /> Sans engagement
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color="#10b981" /> 50% de crédit d'impôt
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
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80" 
                    alt="Téléassistance - sécurité 24h/24 pour seniors"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    background: '#fff',
                    padding: '2rem',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ background: '#dcfce7', color: '#10b981', padding: '10px', borderRadius: '10px' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>Protection Active</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 className="font-serif" style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '1.5rem' }}>Comment ça fonctionne ?</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Une assistance simple et efficace en 3 étapes clés.</p>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', position: 'relative' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: '#eff6ff', 
                  color: '#3b82f6', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 2.5rem',
                  position: 'relative',
                  zIndex: 2,
                  boxShadow: '0 10px 20px rgba(59, 130, 246, 0.1)'
                }}>
                  <step.icon size={32} />
                  <span style={{ 
                    position: 'absolute', 
                    top: '-5px', 
                    right: '-5px', 
                    width: '30px', 
                    height: '30px', 
                    background: '#3b82f6', 
                    color: '#fff', 
                    borderRadius: '50%', 
                    fontSize: '0.8rem', 
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {step.number}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>{step.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING OFFERS SECTION --- */}
      <section id="offres" style={{ padding: '100px 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 className="font-serif" style={{ fontSize: '3rem', color: '#0f172a', marginBottom: '1.5rem' }}>Nos formules d'abonnement</h2>
            <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
              Des solutions adaptées à votre mode de vie, sans frais cachés et avec un matériel de pointe.
            </p>
          </div>

          <div className="offers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {offers.map((offer, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                style={{
                  background: offer.popular ? '#fff' : '#fff',
                  padding: '4rem 3rem',
                  borderRadius: '24px',
                  boxShadow: offer.popular ? '0 30px 60px rgba(59, 130, 246, 0.1)' : '0 10px 30px rgba(0,0,0,0.02)',
                  border: offer.popular ? '2px solid #3b82f6' : '1px solid #f1f5f9',
                  position: 'relative'
                }}
              >
                {offer.popular && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px', 
                    background: '#3b82f6', 
                    color: '#fff', 
                    padding: '6px 16px', 
                    borderRadius: '100px', 
                    fontSize: '0.75rem', 
                    fontWeight: 900,
                    textTransform: 'uppercase'
                  }}>
                    Le plus choisi
                  </div>
                )}
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>{offer.title}</h3>
                <div style={{ marginBottom: '3rem' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                    {offer.price}€<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 400 }}>/mois</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700, marginTop: '5px' }}>
                    Soit {offer.taxPrice}€ après crédit d'impôt*
                  </div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 4rem', display: 'grid', gap: '1.2rem' }}>
                  {offer.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569' }}>
                      <CheckCircle2 size={18} color="#3b82f6" /> {feat}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => navigate('/contact')}
                  style={{ 
                    width: '100%', 
                    padding: '1.2rem', 
                    borderRadius: '12px', 
                    background: offer.popular ? '#3b82f6' : '#f1f5f9', 
                    color: offer.popular ? '#fff' : '#0f172a', 
                    fontWeight: 800, 
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Choisir cette offre
                </button>
              </motion.div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '4rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            *Crédit d'impôt de 50% au titre des Services à la Personne (selon législation en vigueur).
          </p>
        </div>
      </section>

      {/* --- REASSURANCE / VALUES SECTION --- */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container">
          <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#3b82f6', marginBottom: '1.5rem' }}><Clock size={40} strokeWidth={1} /></div>
              <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Réactivité record</h4>
              <p style={{ color: '#64748b' }}>Appel traité en moins de 30 secondes par nos centres français.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#3b82f6', marginBottom: '1.5rem' }}><ShieldCheck size={40} strokeWidth={1} /></div>
              <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Zéro Engagement</h4>
              <p style={{ color: '#64748b' }}>Liberté totale, résiliation possible à tout moment sans frais.</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#3b82f6', marginBottom: '1.5rem' }}><Wifi size={40} strokeWidth={1} /></div>
              <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Réseau Multi-opérateurs</h4>
              <p style={{ color: '#64748b' }}>Sélection automatique du meilleur signal disponible (GSM).</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#3b82f6', marginBottom: '1.5rem' }}><Package size={40} strokeWidth={1} /></div>
              <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Matériel Offert</h4>
              <p style={{ color: '#64748b' }}>Mise à disposition gratuite de tout l'équipement nécessaire.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section style={{ padding: '100px 0', background: '#f8fafc' }}>
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
                      color: '#3b82f6'
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

      {/* --- FINAL CTA --- */}
      <section style={{ padding: '100px 0 140px', background: '#fff' }}>
        <div className="container">
          <div style={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
            borderRadius: '40px', 
            padding: '8rem 4rem', 
            textAlign: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, background: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }} />
            <h2 className="font-serif" style={{ fontSize: '3.5rem', marginBottom: '2rem', position: 'relative' }}>Protégez ceux que vous aimez.</h2>
            <p style={{ fontSize: '1.3rem', opacity: 0.8, maxWidth: '800px', margin: '0 auto 4rem', fontWeight: 300, position: 'relative' }}>
              Inscrivez-vous en 5 minutes ou demandez une documentation gratuite pour découvrir nos solutions en détail.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', position: 'relative' }}>
              <button 
                onClick={() => navigate('/contact')}
                style={{ 
                  padding: '1.8rem 5rem', 
                  borderRadius: '12px', 
                  background: '#3b82f6', 
                  color: '#fff', 
                  border: 'none', 
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                Demander un devis
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
                Appeler un conseiller
              </button>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 991px) {
          .tele-hero-grid { grid-template-columns: 1fr !important; gap: 4rem !important; text-align: center !important; }
          .tele-hero-grid > div { align-items: center !important; }
        }
      `}} />
    </motion.div>
  );
};

export default Teleassistance;
