import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const TopBanner = () => {
  const { settings } = useSettings();
  const { topBanner } = settings;

  if (!topBanner.visible) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        width: '100%',
        height: 'var(--top-banner-height)',
        padding: '0.5rem 0',
        background: 'linear-gradient(90deg, var(--emerald-900) 0%, var(--emerald-800) 50%, var(--emerald-900) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1001,
        color: '#fff',
        fontSize: '1.1rem',
        fontWeight: 500,
        letterSpacing: '0.5px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Shimmer Effect */}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 2
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          zIndex: 1
        }}
      />

      <div style={{ 
        position: 'relative', 
        zIndex: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'clamp(0.5rem, 2vw, 1rem)',
        flexDirection: 'row',
        padding: '0 1rem',
        textAlign: 'center'
      }}>
        <span style={{ 
          opacity: 0.95, 
          fontSize: 'clamp(0.75rem, 2.5vw, 1rem)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '200px'
        }} className="banner-text">
          {topBanner.message}
        </span>
        <Link 
          to="/reservation" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--primary-gold)', 
            fontWeight: 800,
            textDecoration: 'none',
            borderBottom: '2px solid var(--primary-gold)',
            paddingBottom: '2px',
            transition: 'all 0.3s ease',
            fontSize: 'clamp(0.75rem, 2.5vw, 1rem)',
            whiteSpace: 'nowrap'
          }}
          className="banner-link"
        >
          {topBanner.linkText} <ArrowRight size={14} />
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 600px) {
          .banner-text { max-width: none !important; }
        }
      `}} />
    </motion.div>
  );
};

export default TopBanner;
