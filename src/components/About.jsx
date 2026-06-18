import { motion } from 'framer-motion';
import { CheckCircle2, Award, Heart, Leaf } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const About = () => {
  const { settings } = useSettings();
  const { about, services } = settings;

  return (
    <section id="about" className="py-lg" style={{ backgroundColor: '#fff', position: 'relative', overflow: 'hidden' }}>

      {/* Decorative Background Icon */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        style={{ position: 'absolute', top: '-10%', right: '-5%', color: 'rgba(0,0,0,0.02)', zIndex: 0 }}
      >
        <Leaf size={400} strokeWidth={0.5} />
      </motion.div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="about-grid" style={{ 
          display: 'grid', 
          gap: '4rem', 
          alignItems: 'center'
        }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          style={{ position: 'relative' }}
        >
          {/* Decorative Gold Frame */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            width: '100px',
            height: '100px',
            borderTop: '2px solid var(--primary-gold)',
            borderLeft: '2px solid var(--primary-gold)',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            borderBottom: '2px solid var(--primary-gold)',
            borderRight: '2px solid var(--primary-gold)',
            zIndex: 0
          }} />

          <div style={{
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            border: '1px solid #e5e0d8'
          }}>
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8 }}
              src="/assets/coordinator.png"
              alt="Portrait Senior Coordination"
              style={{
                width: '100%',
                display: 'block',
                aspectRatio: '1/1',
                objectFit: 'cover'
              }}
            />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.5 }}
            viewport={{ once: true }}
            className="stats-badge"
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '-40px',
              background: 'var(--bg-dark)',
              color: '#fff',
              padding: '2rem',
              zIndex: 2,
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem'
            }}
          >
            <div style={{ color: 'var(--primary-gold)', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
              <Award size={40} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-gold)', fontFamily: 'var(--font-sans)', lineHeight: 1 }}>{about.experienceYears}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '0.5rem' }}>{about.experienceLabel}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Heart size={20} className="text-gold" fill="currentColor" />
            <div className="section-label" style={{ marginBottom: 0 }}>{about.label}</div>
          </div>
          <h2 className="section-title">
            {about.title} <br />
            <span style={{ color: 'var(--primary-gold)' }}>{about.subtitle}</span>
          </h2>

          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            {about.description}
          </p>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem', listStyle: 'none' }}>
            {about.points.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
              >
                <div style={{ background: 'var(--primary-green-pale)', color: 'var(--primary-green)', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
                  <CheckCircle2 size={20} strokeWidth={3} />
                </div>
                <span style={{ fontSize: '1.05rem', fontWeight: 500 }}>{point}</span>
              </motion.li>
            ))}
          </ul>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const servicesSection = document.getElementById('services');
              if (servicesSection) {
                const navbarOffset = 140;
                const top = servicesSection.getBoundingClientRect().top + window.scrollY - navbarOffset;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }}
            className="btn btn-primary"
            style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}
          >
            Découvrir notre histoire
          </motion.button>
        </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .about-grid {
          grid-template-columns: 1fr;
          gap: 4rem;
        }
        @media (min-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr 1fr;
            gap: 6rem;
          }
        }
        @media (max-width: 768px) {
          .section-title {
            font-size: 2.2rem !important;
          }
          .stats-badge {
            left: 0 !important;
            bottom: -20px !important;
            padding: 1.5rem !important;
          }
        }
      `}} />
    </section>
  );
};

export default About;
