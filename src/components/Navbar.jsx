import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Phone, Menu, X, Car, Crown, Plus, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import logo from '../assets/la-reinette-logo.png';

const Navbar = () => {
  const { settings } = useSettings();
  const { general } = settings;
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [weather, setWeather] = React.useState({ temp: '--', icon: '☀️' });

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=48.7788&longitude=2.3161&current_weather=true');
        const data = await res.json();
        const code = data.current_weather.weathercode;

        let icon = '☀️';
        if (code >= 1 && code <= 3) icon = '☁️';
        if (code >= 45 && code <= 48) icon = '🌫️';
        if (code >= 51 && code <= 67) icon = '🌧️';
        if (code >= 71 && code <= 77) icon = '❄️';
        if (code >= 80 && code <= 82) icon = '🌦️';
        if (code >= 95) icon = '⛈️';

        setWeather({
          temp: Math.round(data.current_weather.temperature),
          icon
        });
      } catch (e) {
        console.error("Météo non disponible");
      }
    };
    fetchWeather();
  }, []);

  // Close menu when route changes
  React.useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const navLinks = [
    {
      name: 'La Reinette',
      path: '/la-reinette',
      submenu: [
        { name: "C'EST QUOI ?", path: '/la-reinette#quoi' },
        { name: 'POUR QUI ?', path: '/la-reinette#qui' },
        { name: 'Comment réserver son trajet ?', path: '/la-reinette#comment' },
        { name: 'Les destinations', path: '/la-reinette#ou' },
        { name: 'Les horaires', path: '/la-reinette#quand' },
        { name: 'Les tarifs', path: '/tarifs-lareinette' },
        { name: 'Réserver un trajet', path: '/reservation' },
        { name: 'Avis clients', path: '/la-reinette#avis' }
      ]
    },

    {
      name: "L'ASAD",
      path: '/asad',
      submenu: [
        { name: "Nos Pôles d'Expertise", path: '/asad#quoi' },
        { name: "À qui s'adresse l'ASAD", path: '/asad#qui' },
        { name: "Pourquoi choisir l'ASAD ?", path: '/asad#pourquoi' }
      ]
    },
    { name: 'La Reinette FAQ', path: '/faq' }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass"
      style={{
        position: 'fixed',
        top: 'var(--top-banner-height)',
        left: 0,
        right: 0,
        height: 'var(--navbar-height)',
        padding: '0 clamp(1rem, 4vw, 4rem)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Left: Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
          >
            <Crown size={26} color="#D4AF37" fill="#D4AF37" strokeWidth={1} style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }} />
            <span
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: 'var(--emerald-900)',
                fontFamily: "var(--font-display)",
                letterSpacing: '1px',
                textTransform: 'uppercase',
                lineHeight: 1
              }}
            >
              La Reinette
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <ul style={{
          display: 'none',
          gap: '2.5rem',
          fontWeight: 700,
          fontSize: '0.9rem',
          listStyle: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          padding: '0 2rem'
        }} className="desktop-menu">
          {navLinks.map(link => (
            <li key={link.path}
              style={{ position: 'relative' }}
              onMouseEnter={() => link.submenu && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link to={link.path} style={{
                  color: location.pathname === link.path ? 'var(--primary-green)' : 'inherit',
                  transition: 'color 0.3s',
                  textDecoration: 'none'
                }}>
                  {link.name}
                </Link>
                {link.submenu && <Plus size={14} style={{ color: 'var(--primary-gold)', cursor: 'pointer' }} />}
              </div>

              {/* Submenu Dropdown */}
              <AnimatePresence>
                {link.submenu && activeDropdown === link.name && (
                  <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#fff',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                      padding: '1rem',
                      minWidth: '220px',
                      listStyle: 'none',
                      marginTop: '1rem',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {link.submenu.map(sub => (
                      <li key={sub.name} style={{ marginBottom: '0.5rem' }}>
                        <Link
                          to={sub.path}
                          style={{
                            textDecoration: 'none',
                            color: 'var(--text-main)',
                            fontSize: '0.85rem',
                            display: 'block',
                            padding: '0.6rem 1rem',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-creme)';
                            e.currentTarget.style.color = 'var(--primary-gold)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-main)';
                          }}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* Right: Weather & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(212, 175, 55, 0.05)',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            fontSize: '0.75rem',
            fontWeight: 700,
            border: '1px solid rgba(212, 175, 55, 0.1)'
          }} className="weather-widget">
            <span>{weather.icon} {weather.temp}°C</span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              padding: '0.5rem',
              borderRadius: '10px',
              background: isMenuOpen ? 'var(--primary-gold-light)' : 'transparent',
              color: 'var(--primary-gold)',
              display: 'flex',
              alignItems: 'center',
              border: 'none'
            }}
            className="mobile-toggle"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <button
            className="btn btn-primary desktop-call"
            style={{
              display: 'none',
              padding: '0.7rem 1.5rem',
              borderRadius: '50px',
              fontSize: '0.85rem'
            }}
            onClick={() => window.location.href = `tel:${general.mainPhone.replace(/\s+/g, '')}`}
          >
            <Phone size={16} /> <span style={{ marginLeft: '0.5rem' }}>{general.mainPhone}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(6px)',
                zIndex: 2000
              }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              style={{
                position: 'fixed',
                top: 0, right: 0,
                width: 'min(300px, 88%)',
                height: '100dvh',
                background: 'var(--emerald-900)',
                zIndex: 2001,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {/* Header du drawer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem 1.5rem 1.25rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}>
                {/* Logo mini */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Crown size={20} color="#D4AF37" fill="#D4AF37" strokeWidth={1} />
                  <span style={{
                    fontSize: '1.1rem', fontWeight: 900,
                    color: '#fff', letterSpacing: '1px',
                    textTransform: 'uppercase', fontFamily: 'var(--font-display)'
                  }}>
                    La Reinette
                  </span>
                </div>
                {/* Bouton fermer */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    width: '40px', height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Météo pill */}
              <div style={{
                margin: '1rem 1.5rem 0',
                padding: '0.6rem 1rem',
                borderRadius: '50px',
                background: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: 'fit-content',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--primary-gold)',
              }}>
                {weather.icon} {weather.temp}°C — Bourg-la-Reine
              </div>

              {/* Liens */}
              <nav style={{ flex: 1, padding: '1.25rem 1rem 1rem' }}>
                {navLinks.map((link) => (
                  <div key={link.path} style={{ marginBottom: '0.25rem' }}>
                    {/* Lien principal */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.1rem 1rem',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        background: activeDropdown === link.name
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(255,255,255,0.05)',
                        transition: 'background 0.2s',
                        marginBottom: '0.15rem',
                      }}
                      onClick={() => link.submenu
                        ? setActiveDropdown(activeDropdown === link.name ? null : link.name)
                        : null
                      }
                    >
                      {link.submenu ? (
                        <span style={{
                          fontSize: '1.15rem', fontWeight: 800, color: '#fff', lineHeight: 1.2,
                        }}>
                          {link.name}
                        </span>
                      ) : (
                        <Link
                          to={link.path}
                          style={{
                            fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2,
                            color: location.pathname === link.path ? 'var(--primary-gold)' : '#fff',
                            textDecoration: 'none', flex: 1,
                          }}
                        >
                          {link.name}
                        </Link>
                      )}
                      {link.submenu && (
                        <motion.div
                          animate={{ rotate: activeDropdown === link.name ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ marginLeft: '0.5rem', flexShrink: 0 }}
                        >
                          <ChevronDown size={20} color="rgba(255,255,255,0.7)" />
                        </motion.div>
                      )}
                    </div>

                    {/* Sous-menu — sans le lien "Voir la page" */}
                    <AnimatePresence>
                      {link.submenu && activeDropdown === link.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            marginLeft: '1rem',
                            marginBottom: '0.5rem',
                            borderLeft: '3px solid rgba(212,175,55,0.5)',
                            paddingLeft: '0.75rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.15rem',
                          }}>
                            {link.submenu.map((sub) => (
                              <Link
                                key={sub.name}
                                to={sub.path}
                                style={{
                                  display: 'block',
                                  padding: '0.85rem 0.75rem',
                                  color: 'rgba(255,255,255,0.85)',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  fontSize: '1rem',
                                  borderRadius: '10px',
                                  lineHeight: 1.3,
                                }}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              {/* CTA appel en bas */}
              <div style={{
                padding: '1rem 1.5rem 8rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}>
                <a
                  href={`tel:${general.mainPhone.replace(/\s+/g, '')}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '1rem 1rem',
                    borderRadius: '14px',
                    background: 'var(--primary-gold)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '1.2rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 18px rgba(212,175,55,0.4)',
                    letterSpacing: '0.5px',
                  }}
                >
                  <Phone size={24} />
                  {general.mainPhone}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (min-width: 768px) {
          .desktop-menu { display: flex !important; gap: 1.25rem !important; font-size: 0.82rem !important; padding: 0 1rem !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .weather-widget { display: flex !important; }
          .desktop-call { display: none !important; }
        }
        @media (min-width: 1025px) {
          .desktop-menu { gap: 2.5rem !important; font-size: 0.9rem !important; }
          .weather-widget { display: flex !important; }
          .desktop-call { display: flex !important; }
        }
      `}} />
    </motion.nav>
  );
};

export default Navbar;
