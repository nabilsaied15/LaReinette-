import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Hospital, 
  Building2, 
  Plane, 
  Map,
  Navigation2,
  Search,
  Info,
  Calendar
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';

const Destinations = () => {
  const { settings, isSettingsLoading } = useSettings();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('Tous');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isSettingsLoading || !settings || !settings.laReinette) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fcfcfd' }}>
      <div className="loader">Chargement...</div>
    </div>
  );

  const laReinette = settings.laReinette;
  const pricing = laReinette.pricing || [];
  const zones = ['Tous', ...new Set(pricing.map(p => p.zone))];
  
  const filteredPricing = pricing.filter(p => {
    const matchesSearch = (p.location || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (p.zone || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'Tous' || p.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  const getIcon = (zone) => {
    const z = zone.toLowerCase();
    if (z.includes('locale')) return <Building2 size={24} />;
    if (z.includes('limitrophe')) return <Map size={24} />;
    if (z.includes('hospital')) return <Hospital size={24} />;
    if (z.includes('distance')) return <Plane size={24} />;
    return <Navigation2 size={24} />;
  };

  return (
    <div style={{ background: '#fcfcfd', minHeight: '100vh', padding: 'clamp(80px, 15vw, 120px) 0 100px' }}>
      <SEO 
        title="Catalogue des Destinations - La Reinette"
        description="Découvrez l'ensemble de nos zones de transport et demandez votre tarif personnalisé."
      />

      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Navigation & Header */}
        <div style={{ marginBottom: 'clamp(2rem, 8vw, 5rem)' }}>
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ x: -5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              background: 'none',
              border: 'none',
              color: 'var(--primary-green)',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '2rem'
            }}
          >
            <ArrowLeft size={18} /> Retour au service
          </motion.button>
          
          <h1 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--emerald-900)', marginBottom: '1.5rem' }}>
            Où souhaitez-vous <span style={{ color: 'var(--primary-green)', fontStyle: 'italic' }}>aller ?</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.6 }}>
            Explorez nos zones de couverture. Pour garantir la solidarité du service, nos tarifs sont calculés au plus juste selon votre destination.
          </p>
        </div>

        {/* Filters & Search */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1.5rem', 
          marginBottom: '4rem',
          padding: '2rem',
          background: '#fff',
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Rechercher une ville, un hôpital..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3.5rem',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                background: '#f9fafb'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {zones.map(zone => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: selectedZone === zone ? 'var(--primary-green)' : '#f3f4f6',
                  color: selectedZone === zone ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Destinations */}
        <motion.div 
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredPricing.map((item, i) => (
              <DestinationCard key={item.location} item={item} icon={getIcon(item.zone)} phone={laReinette.phone} navigate={navigate} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPricing.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <MapPin size={48} style={{ color: 'var(--border-subtle)', marginBottom: '1.5rem' }} />
            <h3 style={{ color: 'var(--emerald-900)' }}>Aucune destination ne correspond à votre recherche</h3>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedZone('Tous');}}
              style={{ color: 'var(--primary-green)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '1rem' }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ 
          marginTop: 'clamp(4rem, 10vw, 8rem)', 
          padding: 'clamp(2rem, 5vw, 4rem)', 
          borderRadius: '40px', 
          background: 'var(--emerald-900)',
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
            Une destination spécifique ?
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 3rem', position: 'relative', zIndex: 1 }}>
            Notre service est flexible. Si votre destination n'est pas listée, contactez-nous pour étudier votre demande.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            <button onClick={() => navigate('/contact')} className="btn" style={{ background: 'var(--primary-gold)', color: '#000', fontWeight: 800 }}>
              Nous contacter
            </button>
            <button onClick={() => window.location.href=`tel:${laReinette.phone}`} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              Appeler l'ASAD
            </button>
          </div>
          <MapPin size={300} style={{ position: 'absolute', bottom: '-100px', right: '-100px', opacity: 0.05 }} />
        </div>
      </div>
    </div>
  );
};

const DestinationCard = ({ item, icon, phone, navigate }) => {
  const [showPrice, setShowPrice] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: 'var(--primary-green-pale)', 
          color: 'var(--primary-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: 800, 
          padding: '0.4rem 0.8rem', 
          background: '#f3f4f6', 
          borderRadius: '20px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase'
        }}>
          {item.zone}
        </span>
      </div>

      <h3 style={{ fontSize: '1.5rem', color: 'var(--emerald-900)', marginBottom: '1rem', fontWeight: 700 }}>
        {item.location}
      </h3>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flex: 1 }}>
        {(item.features || []).slice(0, 3).map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <CheckCircle2 size={14} style={{ color: 'var(--primary-green)' }} />
            {f}
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <AnimatePresence mode="wait">
          {!showPrice ? (
            <motion.button
              key="btn-show"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrice(true)}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--primary-green)',
                background: 'transparent',
                color: 'var(--primary-green)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem'
              }}
            >
              <Info size={18} /> Consulter le tarif
            </motion.button>
          ) : (
            <motion.div
              key="price-info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'var(--bg-creme)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--primary-gold)',
                textAlign: 'center'
              }}
            >
              {item.callOnly ? (
                <div style={{ color: 'var(--emerald-900)', fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: 800, marginBottom: '0.3rem' }}>Tarif sur demande :</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <Phone size={14} style={{ color: 'var(--primary-gold)' }} />
                    <strong>{phone}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                    <Search size={14} style={{ color: 'var(--primary-gold)' }} />
                    <span>{settings.general.email}</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{item.aller}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.6, display: 'block' }}>Aller</span>
                  </div>
                  <div style={{ width: '1px', height: '20px', background: 'rgba(0,0,0,0.1)' }} />
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{item.ar}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.6, display: 'block' }}>A/R</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => navigate('/reservation')}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '12px',
            border: 'none',
            background: 'var(--primary-green)',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem'
          }}
        >
          <Calendar size={18} /> Réserver
        </button>
      </div>
    </motion.div>
  );
};

export default Destinations;
