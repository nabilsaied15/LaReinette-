import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';
import { Calendar, User, ArrowRight, Tag, Search, Filter, Speaker } from 'lucide-react';

const News = () => {
  const { settings } = useSettings();
  const newsItems = settings.news || [];
  const [filter, setFilter] = React.useState('Tous');
  const categories = ['Tous', ...new Set(newsItems.map(item => item.category))];

  const speak = (e, text) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  const filteredNews = filter === 'Tous' 
    ? newsItems 
    : newsItems.filter(item => item.category === filter);

  return (
    <div className="news-page" style={{ background: '#fff', minHeight: '100vh' }}>
      <SEO 
        title="Journal de La Reinette | Conseils & Actualités" 
        description="Le journal officiel de l'ASAD Bourg-la-Reine : conseils pour seniors, vie locale et actualités de notre service de transport."
      />

      {/* Hero Section Premium */}
      <section style={{ 
        padding: '4rem 0 6rem', 
        background: 'linear-gradient(135deg, var(--bg-creme) 0%, #fff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '100%', 
          opacity: 0.03,
          backgroundImage: 'radial-gradient(var(--primary-green) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '800px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '8px 20px', 
                background: 'rgba(21, 87, 36, 0.1)', 
                color: 'var(--primary-green)', 
                borderRadius: '100px', 
                fontSize: '0.85rem', 
                fontWeight: 700,
                marginBottom: '24px' 
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-green)', display: 'block' }} />
              DÉCOUVREZ NOTRE JOURNAL
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ 
                fontSize: 'clamp(3rem, 6vw, 4.5rem)', 
                color: 'var(--emerald-900)', 
                marginBottom: '30px', 
                lineHeight: 1.1,
                fontFamily: "var(--font-display)"
              }}
            >
              Conseils & <span style={{ color: 'var(--primary-gold)' }}>Vie Locale.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ 
                fontSize: '1.3rem', 
                color: 'var(--text-muted)', 
                lineHeight: 1.6,
                maxWidth: '650px'
              }}
            >
              Votre rendez-vous hebdomadaire pour tout savoir sur le bien-être des seniors à Bourg-la-Reine et l'actualité de votre service de mobilité.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section style={{ padding: '40px 0', borderBottom: '1px solid #f0f0f0', sticky: 'top', top: '100px', background: '#fff', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px' }}>
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '100px',
                  border: filter === cat ? 'none' : '1px solid #eee',
                  background: filter === cat ? 'var(--primary-green)' : 'transparent',
                  color: filter === cat ? '#fff' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: filter === cat ? '0 10px 20px rgba(21, 87, 36, 0.15)' : 'none'
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid Premium */}
      <section style={{ padding: '80px 0 120px' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
            gap: '50px 40px' 
          }}>
            <AnimatePresence mode='popLayout'>
              {filteredNews.map((item, index) => (
                <motion.article 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  style={{ height: '100%' }}
                >
                  <Link to={`/actualites/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'block' }}>
                    <motion.div
                      whileHover={{ y: -15 }}
                      style={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ 
                        position: 'relative', 
                        height: '280px', 
                        borderRadius: '32px', 
                        overflow: 'hidden',
                        marginBottom: '25px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                      }}>
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{ 
                          position: 'absolute', 
                          top: '20px', 
                          right: '20px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          padding: '6px 16px',
                          borderRadius: '100px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: 'var(--primary-green)',
                          textTransform: 'uppercase'
                        }}>
                          {item.category}
                        </div>
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} className="text-gold" />
                            {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ccc' }} />
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={14} className="text-gold" />
                            {item.author}
                          </span>
                        </div>

                        <h2 style={{ 
                          fontSize: '1.8rem', 
                          color: 'var(--emerald-900)', 
                          marginBottom: '20px',
                          lineHeight: 1.3,
                          fontFamily: "var(--font-display)",
                          fontWeight: 800
                        }}>
                          {item.title}
                        </h2>

                        <p style={{ 
                          color: 'var(--text-muted)', 
                          lineHeight: 1.7,
                          marginBottom: '25px',
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {item.content}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            color: 'var(--primary-green)', 
                            fontWeight: 800,
                            fontSize: '1rem'
                          }}>
                            Lire l'article <ArrowRight size={20} />
                          </div>
                          <button 
                            onClick={(e) => speak(e, item.title + ". " + item.content)}
                            style={{ 
                              background: 'var(--primary-gold-light)', 
                              color: 'var(--primary-gold)', 
                              border: 'none', 
                              borderRadius: '50%', 
                              width: '44px', 
                              height: '44px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            title="Écouter l'article"
                          >
                            <Speaker size={20} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {filteredNews.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '100px 0' }}
            >
              <Search size={64} style={{ color: '#eee', marginBottom: '20px' }} />
              <h3 style={{ color: 'var(--emerald-900)' }}>Aucun article trouvé dans cette catégorie</h3>
              <button onClick={() => setFilter('Tous')} className="btn btn-text" style={{ color: 'var(--primary-green)', marginTop: '20px' }}>
                Afficher tous les articles
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
