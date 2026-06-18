import { motion } from 'framer-motion';
import { ShieldCheck, Heart, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

import serenityImage from '../assets/image (2).jpg';

const IconMap = {
  ShieldCheck: ShieldCheck,
  Heart: Heart,
  UserCheck: UserCheck
};

const FeatureHighlight = () => {
  const { settings } = useSettings();
  const { highlight } = settings;

  return (
    <section className="py-lg" style={{ background: 'var(--bg-white)', overflow: 'hidden' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '8rem', alignItems: 'center' }}>

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
        >
          <div className="section-label">{highlight.label}</div>
          <h2 className="section-title">
            {highlight.title} <br />
            <span className="text-gold">{highlight.subtitle}</span>
          </h2>
          <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '550px', lineHeight: 1.8 }}>
            {highlight.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
            {highlight.items.map((item, idx) => {
              const Icon = IconMap[item.iconType] || ShieldCheck;
              const bgColor = idx === 0 ? 'var(--primary-green-pale)' : idx === 1 ? 'var(--primary-gold-light)' : 'rgba(0,0,0,0.05)';
              const iconColor = idx === 0 ? 'var(--primary-green)' : idx === 1 ? 'var(--primary-gold)' : 'var(--text-main)';

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  viewport={{ once: true }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                  <div style={{ color: iconColor, background: bgColor, padding: '0.8rem', borderRadius: '12px' }}>
                    <Icon size={24} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{item.label}</span>
                </motion.div>
              );
            })}
          </div>

          <Link to="/#engagements" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ x: 10 }}
              className="btn btn-primary"
              style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '50px' }}
            >
              {highlight.buttonText} <ShieldCheck size={20} style={{ marginLeft: '10px' }} />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
          style={{ position: 'relative' }}
        >
          {/* Decorative Circle */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              top: '-50px',
              left: '-50px',
              width: '100%',
              height: '100%',
              border: '1px dashed var(--primary-gold)',
              borderRadius: '50%',
              opacity: 0.3,
              zIndex: 0
            }}
          />

          {/* Main Image */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: '32px',
              overflow: 'hidden',
              border: '1px solid #e5e0d8'
            }}
          >
            <img
              src={serenityImage}
              alt="Seniors Sereins à Domicile"
              style={{
                width: '100%',
                display: 'block'
              }}
            />
          </motion.div>

          {/* Overlay Box */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
            viewport={{ once: true }}
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '-40px',
              padding: '2.5rem 3.5rem',
              background: 'var(--primary-gold)',
              color: '#fff',
              borderRadius: '24px',
              textAlign: 'center',
              zIndex: 10,
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "var(--font-display)" }}>{highlight.statValue}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.9 }}>{highlight.statLabel}</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureHighlight;
