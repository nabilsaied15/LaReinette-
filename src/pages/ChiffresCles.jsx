import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShieldCheck, Award, Building2 } from 'lucide-react';
import SEO from '../components/SEO';
import AnimatedStatNumber from '../components/AnimatedStatNumber';
import './ChiffresCles.css';

const ChiffresCles = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const testimonials = [
    {
      text: "Ce qui me touche le plus, c'est la confiance que les personnes âgées m'accordent. Au-delà d'un trajet en toute sécurité, c'est un vrai moment de partage et d'écoute au quotidien.",
      initial: "H",
      name: "Hubert",
      role: "Chauffeur depuis 5 ans"
    },
    {
      text: "Chaque matin, je sais que ma mission dépasse le simple fait de conduire. C'est un sourire échangé, une aide pour porter les courses, un bras sur lequel s'appuyer. Nous sommes les gardiens de leur mobilité.",
      initial: "P",
      name: "Pascal",
      role: "Chauffeur depuis 2 ans"
    }
  ];

  const stats = [
    {
      title: 'Trajets annuels',
      end: 15,
      format: (n) => `${n}k+`,
      delay: 0,
    },
    {
      title: 'Satisfaction',
      end: 98,
      format: (n) => `${n}%`,
      delay: 120,
    },
    {
      title: "Ans d'engagement",
      end: 60,
      format: (n) => `${n}+`,
      delay: 240,
    },
    {
      title: 'Sérénité',
      end: 24,
      format: (n) => `${n}/7`,
      delay: 360,
    },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Sécurité avant tout",
      desc: "Notre flotte de véhicules est scrupuleusement entretenue et adaptée (TPMR) pour assurer un transport sans le moindre risque, quelles que soient les conditions."
    },
    {
      icon: Award,
      title: "Formation Spécifique",
      desc: "Tous nos chauffeurs possèdent l'attestation de formation aux premiers secours (AFPS) et sont formés aux besoins spécifiques liés au vieillissement."
    },
    {
      icon: Building2,
      title: "Soutien Institutionnel",
      desc: "En partenariat étroit avec le CCAS et la Ville de Bourg-la-Reine, nous garantissons un service public de proximité, encadré et contrôlé."
    }
  ];

  return (
    <div className="chiffres-page">
      <SEO
        title="Chiffres Clés & Engagements | La Reinette"
        description="Découvrez l'impact de La Reinette en chiffres et l'engagement de nos chauffeurs."
      />

      <section className="chiffres-header">
        <div className="container chiffres-header-inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="chiffres-header-badge">Transparence & Résultats</div>
            <h1 className="font-serif chiffres-header-title">
              L'excellence <br />{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--primary-gold)', fontWeight: 300 }}>
                en quelques chiffres.
              </span>
            </h1>
            <p className="chiffres-header-desc">
              Parce que la confiance se construit chaque jour, découvrez l'impact réel de l'ASAD Bourg-la-Reine sur le maintien de la mobilité et du lien social de nos aînés.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="chiffres-main-section">
        <div className="container" style={{ maxWidth: '1400px' }}>
          <div className="chiffres-hero-grid">
            <div className="chiffres-stats-intro">
              <div className="section-label">CHIFFRES CLÉS</div>
              <h2 className="font-serif chiffres-stats-title">
                Un impact réel sur la <br />
                <span style={{ color: 'var(--primary-gold)', fontStyle: 'italic', fontWeight: 300 }}>
                  vie de nos aînés.
                </span>
              </h2>

              <div className="chiffres-stats-grid">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.title}
                    className="chiffres-stat-item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <AnimatedStatNumber
                      end={stat.end}
                      format={stat.format}
                      delay={stat.delay}
                    />
                    <div className="chiffres-stat-label">{stat.title}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="chiffres-testimonial"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="chiffres-quote-deco" aria-hidden="true">"</div>

              <div className="chiffres-testimonial-inner">
                <div className="chiffres-testimonial-nav">
                  <h4>L'engagement de nos chauffeurs</h4>
                  <div className="chiffres-testimonial-buttons">
                    <button
                      type="button"
                      className="chiffres-nav-btn"
                      aria-label="Témoignage précédent"
                      onClick={() => setActiveTestimonial(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                    >
                      <ChevronLeft size={18} strokeWidth={1} />
                    </button>
                    <button
                      type="button"
                      className="chiffres-nav-btn"
                      aria-label="Témoignage suivant"
                      onClick={() => setActiveTestimonial(prev => (prev + 1) % testimonials.length)}
                    >
                      <ChevronRight size={18} strokeWidth={1} />
                    </button>
                  </div>
                </div>

                <div className="chiffres-testimonial-content">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, filter: 'blur(4px)' }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="font-serif chiffres-testimonial-text">
                        "{testimonials[activeTestimonial].text}"
                      </p>

                      <div className="chiffres-testimonial-author">
                        <div className="chiffres-author-avatar">
                          {testimonials[activeTestimonial].initial}
                        </div>
                        <div>
                          <div className="chiffres-author-name">{testimonials[activeTestimonial].name}</div>
                          <div className="chiffres-author-role">{testimonials[activeTestimonial].role}</div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="chiffres-pillars-section">
        <div className="container">
          <div className="chiffres-pillars-header">
            <div className="section-label" style={{ justifyContent: 'center' }}>NOS FONDATIONS</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--emerald-900)', marginBottom: '1.5rem' }}>
              Pourquoi <span style={{ color: 'var(--primary-gold)', fontStyle: 'italic', fontWeight: 300 }}>ces résultats ?</span>
            </h2>
            <p>
              Ces chiffres ne sont pas le fruit du hasard, mais le résultat d'une organisation exigeante et de valeurs profondément ancrées.
            </p>
          </div>

          <div className="chiffres-pillars-grid">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                className="chiffres-pillar-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="chiffres-pillar-icon">
                  <pillar.icon size={36} strokeWidth={1.5} />
                </div>
                <h4>{pillar.title}</h4>
                <p>{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChiffresCles;
