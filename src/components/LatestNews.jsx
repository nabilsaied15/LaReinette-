import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { ArrowRight, Calendar, User, ChevronRight } from 'lucide-react';

const LatestNews = () => {
  const { settings } = useSettings();
  const latestNews = (settings.news || []).slice(0, 3);

  if (latestNews.length === 0) return null;

  return (
    <section style={{ 
      padding: '120px 0', 
      background: 'linear-gradient(180deg, #fff 0%, var(--bg-creme) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{ 
        position: 'absolute', 
        top: '-10%', 
        right: '-5%', 
        width: '400px', 
        height: '400px', 
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '80px' 
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ 
              background: 'rgba(21, 87, 36, 0.08)',
              color: 'var(--primary-green)',
              padding: '8px 24px',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '2px',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}
          >
            Le Journal de La Reinette
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', 
              color: 'var(--emerald-900)',
              marginBottom: '24px',
              maxWidth: '800px',
              lineHeight: 1.1,
              fontFamily: 'var(--font-sans)'
            }}
          >
            Derniers Conseils & <span style={{ color: 'var(--primary-gold)', position: 'relative' }}>
              Actualités
              <svg style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%' }} viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="var(--primary-gold)" strokeWidth="2" fill="transparent" opacity="0.4" />
              </svg>
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ 
              color: 'var(--text-muted)',
              fontSize: '1.2rem',
              maxWidth: '600px',
              lineHeight: 1.6
            }}
          >
            Restez informés sur la vie locale de Bourg-la-Reine et découvrez nos astuces pour un quotidien serein.
          </motion.p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '40px' 
        }}>
          {latestNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              style={{ height: '100%' }}
            >
              <Link to={`/actualites/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
                <motion.div
                  whileHover={{ y: -15 }}
                  style={{ 
                    background: '#fff', 
                    borderRadius: '32px', 
                    overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(0,0,0,0.03)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.8s ease'
                      }} 
                      className="news-image"
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '20px', 
                      left: '20px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      padding: '8px 16px',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: 'var(--primary-green)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {item.category}
                    </div>
                  </div>

                  <div style={{ padding: '40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '15px', 
                      fontSize: '0.85rem', 
                      color: 'var(--text-muted)', 
                      marginBottom: '20px' 
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} style={{ color: 'var(--primary-gold)' }} />
                        {new Date(item.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ccc' }} />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} style={{ color: 'var(--primary-gold)' }} />
                        {item.author}
                      </span>
                    </div>

                    <h3 style={{ 
                      fontSize: '1.6rem', 
                      color: 'var(--emerald-900)', 
                      marginBottom: '20px', 
                      lineHeight: 1.3,
                      fontWeight: 800,
                      fontFamily: 'var(--font-sans)'
                    }}>
                      {item.title}
                    </h3>

                    <p style={{ 
                      color: 'var(--text-muted)', 
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      marginBottom: '30px',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {item.content}
                    </p>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      color: 'var(--primary-green)', 
                      fontWeight: 800,
                      fontSize: '0.95rem'
                    }}>
                      Continuer la lecture
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '80px', textAlign: 'center' }}
        >
          <Link to="/actualites" className="btn btn-primary" style={{ 
            padding: '18px 40px', 
            borderRadius: '100px',
            fontSize: '1rem',
            boxShadow: '0 15px 30px rgba(21, 87, 36, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            Parcourir tout le journal <ChevronRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestNews;
