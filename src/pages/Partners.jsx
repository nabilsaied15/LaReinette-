import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, ExternalLink, Activity, Users, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import mairieImg from '../assets/mairie.jpg';
import './Partners.css';

const Partners = () => {
  const { settings } = useSettings();
  const { partners } = settings;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="partners-page">
      <div className="container">
        <header className="partners-hero">
          <div className="partners-hero-text">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="partners-hero-label"
            >
              HISTOIRE & ORIGINES
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-serif partners-hero-title"
            >
              Les Fondateurs de <br />{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--primary-gold)', fontWeight: 300, letterSpacing: '-1px' }}>
                La Reinette.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="partners-hero-description"
            >
              Derrière chaque trajet se cache une vision humaniste née en 1961. Découvrez les fondateurs et l'équipe qui font vivre l'excellence de l'accompagnement au quotidien.
            </motion.p>
          </div>

          <motion.div
            className="partners-hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          >
            <div className="partners-hero-frame" aria-hidden="true" />
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
              alt="Partenariats"
              className="partners-hero-img"
            />
          </motion.div>
        </header>

        <section className="partners-pillars">
          <div className="partners-pillar">
            <div className="partners-pillar-tag">L'HÉRITAGE</div>
            <Activity size={28} style={{ color: 'var(--emerald-900)', marginBottom: '1.5rem' }} strokeWidth={1.2} />
            <h3 className="font-serif">Fondation (1961)</h3>
            <p>
              L'ASAD a été fondée par une équipe de visionnaires engagés pour transformer le maintien à domicile en un service d'excellence.
            </p>
          </div>
          <div className="partners-pillar">
            <div className="partners-pillar-tag">LA VISION</div>
            <Users size={28} style={{ color: 'var(--emerald-900)', marginBottom: '1.5rem' }} strokeWidth={1.2} />
            <h3 className="font-serif">Mobilité pour Tous</h3>
            <p>
              L'idée de La Reinette est née de la volonté d'offrir une liberté de mouvement totale aux aînés de Bourg-la-Reine.
            </p>
          </div>
          <div className="partners-pillar">
            <div className="partners-pillar-tag">L'ENGAGEMENT</div>
            <Heart size={28} style={{ color: 'var(--emerald-900)', marginBottom: '1.5rem' }} strokeWidth={1.2} />
            <h3 className="font-serif">Dévouement Humain</h3>
            <p>
              Chaque membre de l'équipe fondatrice a insufflé des valeurs de respect et de dignité qui perdurent encore aujourd'hui.
            </p>
          </div>
        </section>

        <section className="partners-mairi-section">
          <div className="partners-section-intro">
            <div className="partners-section-tag">CONFIANCE MUNICIPALE</div>
            <h2 className="font-serif partners-section-title">
              Un projet porté par <br />{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--primary-gold)' }}>la Ville de Bourg la Reine.</span>
            </h2>
          </div>

          <div className="partners-mairi-card">
            <div>
              <h3 className="font-serif">Une alliance pour le bien-être de nos aînés</h3>
              <p>
                Dès son lancement, la Mairie de Bourg-la-Reine a accordé sa pleine confiance à l'ASAD pour porter le projet "La Reinette". Ce partenariat public-associatif unique permet de garantir un service de transport accompagné de haute qualité, sécurisé et accessible financièrement à tous les seniors de la commune.
              </p>
              <div className="partners-mairi-stats">
                <div className="partners-mairi-stat">
                  <div className="partners-mairi-stat-value">2025</div>
                  <div className="partners-mairi-stat-label">LANCEMENT</div>
                </div>
                <div className="partners-mairi-stat-divider" aria-hidden="true" />
                <div className="partners-mairi-stat">
                  <div className="partners-mairi-stat-value">100%</div>
                  <div className="partners-mairi-stat-label">SOUTIEN CCAS</div>
                </div>
              </div>
            </div>
            <div className="partners-mairi-visual">
              <img src={mairieImg} alt="Hôtel de Ville de Bourg-la-Reine" className="partners-mairi-img" />
              <div className="partners-mairi-badge">
                <MapPin size={16} color="var(--primary-gold)" />
                <span>Hôtel de Ville</span>
              </div>
            </div>
          </div>
        </section>

        <section className="partners-media-section">
          <div className="partners-section-intro">
            <div className="partners-section-tag">MÉDIAS & ACTUALITÉS</div>
            <h2 className="font-serif partners-section-title">
              On parle de <br />{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--primary-gold)' }}>La Reinette en ligne.</span>
            </h2>
          </div>

          <div className="partners-media-grid">
            {[
              {
                source: 'BLR Mag #501',
                title: "Le transport à la demande 'La Reinette' s'élance",
                excerpt: "Le magazine municipal de juin-juillet 2025 consacre sa une à ce nouveau dispositif expérimental pour faciliter les déplacements des aînés.",
                date: 'Juin 2025',
                page: 'Page 9',
                url: 'https://www.calameo.com/read/005032716cfc08a9e541b'
              },
              {
                source: 'Site de la Ville',
                title: 'Un service de transport à la demande pour les seniors',
                excerpt: "Retrouvez toutes les modalités d'inscription et de fonctionnement de ce nouveau service de mobilité solidaire.",
                date: 'Juillet 2025',
                page: 'Article en ligne',
                url: 'https://www.bourg-la-reine.fr/actualite/23096/10319-un-service-de-transport-a-la-demande-pour-les-seniors-reginaburgiens.htm'
              },
              {
                source: 'BLR Mag #503',
                title: 'Mobilité Solidaire : Le succès de La Reinette',
                excerpt: "Trois mois après son lancement, découvrez le bilan positif et les témoignages des premiers bénéficiaires de ce service accompagné.",
                date: 'Octobre 2025',
                page: 'Page 11',
                url: 'https://www.calameo.com/read/005032716f060e2139364'
              }
            ].map((article, idx) => (
              <motion.a
                key={idx}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="partners-article-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {article.source}
                  </span>
                </div>
                <h3 className="font-serif">{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="partners-article-footer">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{article.date}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-gold)' }}>{article.page}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--emerald-900)', borderBottom: '1px solid var(--primary-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    LIRE L'ARTICLE <ExternalLink size={12} />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      </div>

      <section className="partners-values-section">
        <div className="partners-values-decor" aria-hidden="true" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="partners-values-header">
            <span>CHARTE DE CONFIANCE</span>
            <h2 className="font-serif partners-section-title">
              Une collaboration <span style={{ fontStyle: 'italic', color: 'var(--primary-gold)' }}>d'excellence.</span>
            </h2>
          </div>
          <div className="partners-values-grid">
            <div className="partners-value-item">
              <div style={{ color: 'var(--primary-gold)', marginBottom: '2.5rem' }}>
                <Shield size={48} strokeWidth={1} />
              </div>
              <h3 className="font-serif">Certification d'État</h3>
              <p>Tous nos processus sont conformes aux normes rigoureuses de l'ARS et du Conseil Départemental.</p>
            </div>
            <div className="partners-value-item">
              <div style={{ color: 'var(--primary-gold)', marginBottom: '2.5rem' }}>
                <Activity size={48} strokeWidth={1} />
              </div>
              <h3 className="font-serif">Transparence</h3>
              <p>Un suivi digitalisé en temps réel pour une coordination fluide avec tous les intervenants médicaux.</p>
            </div>
            <div className="partners-value-item">
              <div style={{ color: 'var(--primary-gold)', marginBottom: '2.5rem' }}>
                <Heart size={48} strokeWidth={1} />
              </div>
              <h3 className="font-serif">Éthique</h3>
              <p>Une charte éthique stricte garantissant le respect de la dignité et de l'intimité de chaque bénéficiaire.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
