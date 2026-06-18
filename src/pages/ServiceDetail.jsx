import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Heart, 
  Home, 
  Bell, 
  Info, 
  Phone,
  Clock,
  Users
} from 'lucide-react';
import SEO from '../components/SEO';

const ServiceDetail = ({ type: propType }) => {
  const { type: paramType } = useParams();
  const type = propType || paramType;
  const navigate = useNavigate();
  const { settings, isSettingsLoading } = useSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  if (isSettingsLoading) return null;

  const serviceData = settings.ssiadSaad[type];
  if (!serviceData) {
    return (
      <div style={{ padding: '200px 0', textAlign: 'center' }}>
        <h2>Service non trouvé</h2>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'saad': return <Home size={48} />;
      case 'ssiad': return <Heart size={48} />;
      case 'teleassistance': return <Bell size={48} />;
      default: return <ShieldCheck size={48} />;
    }
  };

  const getThemeColor = () => {
    switch (type) {
      case 'saad': return 'var(--primary-green)';
      case 'ssiad': return 'var(--primary-gold)';
      case 'teleassistance': return '#3b82f6'; // Blue for safety
      default: return 'var(--emerald-900)';
    }
  };

  const themeColor = getThemeColor();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: '#fff', minHeight: '100vh' }}
    >
      <SEO 
        title={`${serviceData.title} - ASAD Bourg-la-Reine`}
        description={serviceData.description}
      />

      {/* Hero Section */}
      <section style={{ 
        padding: '160px 0 100px', 
        background: `linear-gradient(135deg, ${themeColor}08 0%, #fff 100%)`,
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div className="container">
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ x: -5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              background: 'none',
              border: 'none',
              color: themeColor,
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '3rem'
            }}
          >
            <ArrowLeft size={18} /> Retour à l'accueil
          </motion.button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }} className="service-hero-grid">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: `${themeColor}15`, 
                color: themeColor,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2.5rem'
              }}>
                {getIcon()}
              </div>
              <h1 className="font-serif" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', color: 'var(--emerald-900)', lineHeight: 1.1, marginBottom: '2rem' }}>
                {serviceData.title.split(' - ')[0]} <br />
                <span style={{ color: themeColor, fontStyle: 'italic', fontWeight: 300 }}>{serviceData.title.split(' - ')[1] || ''}</span>
              </h1>
              <p style={{ fontSize: '1.3rem', color: '#64748b', lineHeight: 1.6, maxWidth: '600px', marginBottom: '3rem' }}>
                {serviceData.description}
              </p>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <button 
                  onClick={() => navigate('/contact')}
                  className="btn btn-primary"
                  style={{ background: themeColor, border: 'none', padding: '1.2rem 2.5rem', borderRadius: '100px', fontWeight: 800 }}
                >
                  Demander ce service
                </button>
                <a 
                  href={`tel:${settings.general.mainPhone}`}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    textDecoration: 'none', 
                    color: 'var(--emerald-900)',
                    fontWeight: 700
                  }}
                >
                  <Phone size={20} /> {settings.general.mainPhone}
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              style={{ position: 'relative' }}
            >
              <div style={{ 
                borderRadius: '40px', 
                overflow: 'hidden', 
                boxShadow: '0 40px 80px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0'
              }}>
                <img 
                  src={type === 'saad' ? 'https://images.unsplash.com/photo-1581578731522-745d05db972a?auto=format&fit=crop&w=800&q=80' : 
                       type === 'ssiad' ? 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80' :
                       'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&w=800&q=80'} 
                  alt={serviceData.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              
              {/* Floating Stat Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  bottom: '40px',
                  left: '-30px',
                  background: '#fff',
                  padding: '2rem',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem'
                }}
              >
                <div style={{ background: `${themeColor}10`, color: themeColor, padding: '1rem', borderRadius: '15px' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald-900)' }}>Qualité Certifiée</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Accompagnement d'Excellence</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
            
            {/* Features List */}
            <div>
              <h2 className="font-serif" style={{ fontSize: '2.5rem', color: 'var(--emerald-900)', marginBottom: '3rem' }}>
                Nos prestations <br /> <span style={{ color: themeColor, fontStyle: 'italic' }}>incluses</span>
              </h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {serviceData.points.map((point, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1.5rem', 
                      padding: '1.5rem', 
                      background: '#f9fafb', 
                      borderRadius: '16px',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <CheckCircle2 size={24} style={{ color: themeColor }} />
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#475569' }}>{point}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ 
                padding: '3rem', 
                background: 'var(--emerald-900)', 
                color: '#fff', 
                borderRadius: '32px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Users size={120} style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: "var(--font-display)" }}>Public concerné</h3>
                <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6 }}>{serviceData.public}</p>
              </div>

              <div style={{ 
                padding: '3rem', 
                background: 'var(--bg-creme)', 
                border: '1px solid #e5e0d8', 
                borderRadius: '32px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--primary-gold)' }}>
                  <Info size={24} />
                  <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--emerald-900)', fontFamily: "var(--font-display)" }}>Modalités d'accès</h3>
                </div>
                <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>{serviceData.access}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '0 0 120px' }}>
        <div className="container">
          <div style={{ 
            background: `linear-gradient(135deg, ${themeColor} 0%, var(--emerald-900) 100%)`,
            padding: '6rem 4rem',
            borderRadius: '48px',
            textAlign: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <h2 className="font-serif" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Prêt à en bénéficier ?</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto 4rem' }}>
              Nos conseillers sont à votre écoute pour définir ensemble l'accompagnement le plus adapté à vos besoins et à votre situation.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/contact')}
                style={{ 
                  padding: '1.5rem 4rem', 
                  borderRadius: '100px', 
                  background: '#fff', 
                  color: themeColor, 
                  border: 'none', 
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
              >
                Nous contacter
              </button>
              <button 
                onClick={() => window.location.href = `tel:${settings.general.mainPhone}`}
                style={{ 
                  padding: '1.5rem 4rem', 
                  borderRadius: '100px', 
                  background: 'transparent', 
                  color: '#fff', 
                  border: '2px solid rgba(255,255,255,0.3)', 
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                Appeler le {settings.general.mainPhone}
              </button>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 991px) {
          .service-hero-grid { grid-template-columns: 1fr !important; gap: 4rem !important; }
        }
      `}} />
    </motion.div>
  );
};

export default ServiceDetail;
