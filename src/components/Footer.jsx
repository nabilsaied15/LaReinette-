import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../config/supabase';
import { getNewsletterEmailConfig, sendNewsletterEmail } from '../utils/newsletterEmail';

const Footer = () => {
  const { settings } = useSettings();
  const { general, contact, emergencyNumbers, footer } = settings;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return;

    setStatus('loading');
    try {
      const { error } = await supabase
        .from('newsletters')
        .insert([{ email: trimmedEmail }]);

      if (error && error.code !== '23505') {
        throw error;
      }

      const emailConfig = getNewsletterEmailConfig(settings);
      if (!emailConfig) {
        console.warn('Newsletter EmailJS non configuré — inscription enregistrée sans email de confirmation.');
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
        return;
      }

      const subject =
        settings.emailTemplates?.newsletterWelcomeSubject ||
        'Bienvenue à la newsletter La Reinette — Bourg-la-Reine';
      const message =
        settings.emailTemplates?.newsletterWelcomeMessage ||
        'Merci pour votre inscription à notre newsletter. Vous recevrez nos actualités et conseils pour les seniors.';

      await sendNewsletterEmail(settings, {
        toEmail: trimmedEmail,
        subject,
        message,
      });

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <footer style={{ background: 'var(--bg-dark)', color: '#fff', padding: '8rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Background Element */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '5rem',
          marginBottom: '6rem'
        }}>
          {/* Brand Col */}
          <div style={{ maxWidth: '350px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}
            >
              <div style={{
                width: '45px',
                height: '45px',
                background: 'var(--primary-gold)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(133, 100, 4, 0.3)'
              }}>
                <Heart size={24} color="#fff" fill="white" />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: '1.8rem', letterSpacing: '0.5px' }}>{general.siteName}</h3>
            </motion.div>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, marginBottom: '2.5rem', fontSize: '1rem' }}>
              {footer.tagline}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {(footer.socials || []).map((social, i) => {
                const IconMap = { Facebook, Twitter, Instagram, Linkedin };
                const Icon = IconMap[social.platform] || Mail;
                return (
                  <motion.a
                    key={i}
                    whileHover={{ y: -5, color: 'var(--primary-gold)' }}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.3s ease' }}
                  >
                    <Icon size={22} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '2.5rem', fontFamily: "var(--font-display)", color: 'var(--primary-gold)', letterSpacing: '0.5px' }}>
              {footer.columns?.col1Title || "Service La Reinette"}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', listStyle: 'none' }}>
              {(footer.links || []).map((link, i) => (
                <li key={i}>
                  <motion.div whileHover={{ color: '#fff', x: 8 }} style={{ transition: 'all 0.3s ease' }}>
                    <Link to={link.path} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem' }}>
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
              <li style={{ marginTop: '1rem' }}>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="/forms/Depliant-publicitaire-ASAD.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: 'transparent',
                    border: '1px solid var(--primary-gold)',
                    color: 'var(--primary-gold)',
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                >
                  Guide du Voyageur (PDF)
                </motion.a>
              </li>
            </ul>
          </div>

          {/* Emergency Numbers Col */}
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '2.5rem', fontFamily: "var(--font-display)", color: '#ef4444', letterSpacing: '0.5px' }}>
              {footer.columns?.col2Title || "Numéros d'Urgence"}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', listStyle: 'none' }}>
              {emergencyNumbers.map((item, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.8rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{item.label}</span>
                  <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{item.number}</strong>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '2.5rem', fontFamily: "var(--font-display)", color: 'var(--primary-gold)', letterSpacing: '0.5px' }}>
              {footer.columns?.col3Title || "Contact ASAD"}
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', listStyle: 'none' }}>
              <li style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary-gold)' }}><MapPin size={20} /></div>
                <div>
                  {contact.address}<br />
                  {contact.city}
                </div>
              </li>
              <li style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary-gold)' }}><Phone size={20} /></div>
                01 79 71 75 42
              </li>
              <li style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', alignItems: 'center' }}>
                <div style={{ color: 'var(--primary-gold)' }}><Mail size={20} /></div>
                <a href={`mailto:${contact.formRecipientEmail || contact.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {contact.formRecipientEmail || contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div style={{ maxWidth: '400px' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '2.5rem', fontFamily: "var(--font-display)", color: 'var(--primary-gold)', letterSpacing: '0.5px' }}>
              Newsletter
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Rejoignez notre communauté pour recevoir nos actualités et conseils pour les seniors.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '1rem 1.2rem',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={status === 'loading' || status === 'success'}
                  type="submit"
                  style={{
                    background: status === 'success' ? '#10b981' : 'var(--primary-gold)',
                    border: 'none',
                    width: '54px',
                    height: '54px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: (status === 'loading' || status === 'success') ? 'default' : 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  {status === 'loading' ? (
                    <div className="spinner-small" />
                  ) : status === 'success' ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Send size={20} />
                  )}
                </motion.button>
              </div>
              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 600 }}
                >
                  Merci ! Un email de confirmation vous a été envoyé.
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '1rem', fontWeight: 600 }}
                >
                  Une erreur est survenue. Veuillez réessayer.
                </motion.p>
              )}
            </form>
          </div>

          <style>{`
            .spinner-small {
              width: 20px;
              height: 20px;
              border: 2px solid rgba(255,255,255,0.3);
              border-top-color: #fff;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.3)',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <p>{footer.copyright}</p>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            {(footer.legalLinks || []).map((legal, i) => (
              <motion.div key={i} whileHover={{ color: '#fff' }}>
                <Link to={legal.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {legal.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
