import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';
import { Calendar, User, ArrowLeft, Tag, Share2, Clock, Bookmark } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();
  const { settings } = useSettings();
  const article = settings.news?.find(n => n.id.toString() === id);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  if (!article) {
    return (
      <div style={{ padding: '200px 0', textAlign: 'center', background: 'var(--bg-creme)', minHeight: '100vh' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--emerald-900)', marginBottom: '20px' }}>Article introuvable</h2>
        <Link to="/actualites" className="btn btn-primary">Retour aux actualités</Link>
      </div>
    );
  }

  return (
    <div className="news-detail-page" style={{ background: '#fff' }}>
      <SEO 
        title={`${article.title} | Journal La Reinette`} 
        description={article.content.substring(0, 160)}
      />

      {/* Article Hero Section */}
      <section style={{ position: 'relative', height: '70vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, y, zIndex: 0 }}>
          <img 
            src={article.image} 
            alt={article.title} 
            style={{ width: '100%', height: '120%', objectFit: 'cover' }}
          />
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)' 
          }} />
        </motion.div>

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingBottom: '80px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: '900px' }}
          >
            <Link to="/actualites" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              color: '#fff', 
              textDecoration: 'none', 
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '8px 20px',
              borderRadius: '100px',
              marginBottom: '40px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <ArrowLeft size={18} /> Retour au journal
            </Link>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
              <span style={{ 
                padding: '6px 16px', 
                background: 'var(--primary-gold)', 
                color: '#fff', 
                borderRadius: '100px', 
                fontSize: '0.8rem', 
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {article.category}
              </span>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                <Clock size={16} /> 4 min de lecture
              </span>
            </div>

            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
              color: '#fff', 
              lineHeight: 1.1,
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              marginBottom: '30px'
            }}>
              {article.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>
                  {article.author.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase' }}>Rédigé par</div>
                  <div style={{ fontSize: '1.1rem' }}>{article.author}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar size={20} className="text-gold" />
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase' }}>Publié le</div>
                  <div style={{ fontSize: '1.1rem' }}>{new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content Section */}
      <section style={{ padding: '100px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '80px', maxWidth: '1200px' }}>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ 
              fontSize: '1.25rem', 
              lineHeight: 1.9, 
              color: '#333',
              whiteSpace: 'pre-wrap',
              fontFamily: "var(--font-sans)"
            }}
          >
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              color: 'var(--primary-green)', 
              marginBottom: '40px',
              fontStyle: 'italic',
              borderLeft: '4px solid var(--primary-gold)',
              paddingLeft: '30px'
            }}>
              {article.content.substring(0, 150)}...
            </div>

            {article.content}

            <div style={{ 
              marginTop: '80px', 
              padding: '60px', 
              background: 'var(--bg-creme)', 
              borderRadius: '40px',
              textAlign: 'center',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}>
              <Tag size={40} style={{ color: 'var(--primary-gold)', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '2rem', color: 'var(--emerald-900)', marginBottom: '20px' }}>Besoin d'un accompagnement ?</h3>
              <p style={{ marginBottom: '35px', color: 'var(--text-muted)' }}>Nos équipes sont à votre disposition pour organiser vos déplacements en toute sérénité à Bourg-la-Reine.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <Link to="/reservation" className="btn btn-primary" style={{ padding: '15px 35px', borderRadius: '100px' }}>Réserver un trajet</Link>
                <Link to="/contact" className="btn btn-secondary" style={{ padding: '15px 35px', borderRadius: '100px' }}>Nous contacter</Link>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <aside>
            <div style={{ sticky: 'top', top: '140px' }}>
              <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '24px', padding: '30px', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '20px', color: 'var(--emerald-900)', fontWeight: 800 }}>Partager l'article</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #eee', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Share2 size={18} /></button>
                  <button style={{ width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #eee', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Bookmark size={18} /></button>
                </div>
              </div>

              <div style={{ background: 'var(--emerald-900)', borderRadius: '24px', padding: '30px', color: '#fff' }}>
                <h4 style={{ fontSize: '1.4rem', marginBottom: '15px', fontFamily: "var(--font-display)" }}>L'ASAD à vos côtés</h4>
                <p style={{ fontSize: '0.95rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '25px' }}>Depuis 25 ans, nous accompagnons les seniors de Bourg-la-Reine pour préserver leur autonomie.</p>
                <Link to="/" style={{ color: 'var(--primary-gold)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  En savoir plus <ArrowLeft style={{ rotate: '180deg' }} size={16} />
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </section>
    </div>
  );
};

export default NewsDetail;
