import React, { useState, useEffect } from 'react';
import { Type, Contrast, ZoomIn, PhoneCall, AudioLines, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccessibilityToolbar = () => {
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('accessibility-large-text', isLargeText);
  }, [isLargeText]);

  useEffect(() => {
    document.documentElement.classList.toggle('accessibility-high-contrast', isHighContrast);
  }, [isHighContrast]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9; // Slightly slower for seniors
    window.speechSynthesis.speak(utterance);
  };

  // Global click-to-read listener
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!isTTSEnabled) return;
      
      // Prevent reading if clicking the toolbar controls
      if (e.target.closest('.accessibility-controls-panel')) return;

      // Extract text from clicked element
      let textToRead = '';
      if (e.target.innerText) textToRead = e.target.innerText;
      else if (e.target.alt) textToRead = e.target.alt;
      else if (e.target.getAttribute('aria-label')) textToRead = e.target.getAttribute('aria-label');

      if (textToRead && textToRead.trim().length > 1) {
        e.preventDefault();
        e.stopPropagation();
        speak(textToRead);
        
        // Visual feedback
        const originalOutline = e.target.style.outline;
        e.target.style.outline = '3px solid var(--primary-gold)';
        setTimeout(() => {
          e.target.style.outline = originalOutline;
        }, 1000);
      }
    };

    if (isTTSEnabled) {
      document.addEventListener('click', handleGlobalClick, true);
      document.body.style.cursor = 'help';
    } else {
      document.removeEventListener('click', handleGlobalClick, true);
      document.body.style.cursor = 'default';
    }

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      document.body.style.cursor = 'default';
    };
  }, [isTTSEnabled]);

  return (
    <div style={{ position: 'fixed', left: '20px', bottom: '30px', zIndex: 9999 }}>
        <AnimatePresence>
        {isOpen && (
          <motion.div
            className="accessibility-controls-panel"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'absolute',
              bottom: '80px',
              left: 0,
              width: '280px',
              backgroundColor: 'var(--emerald-900)',
              padding: '1.5rem',
              borderRadius: '24px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span id="acc-title" style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Accessibilité</span>
                <button 
                  onClick={() => setIsOpen(false)} 
                  aria-label="Fermer le menu d'accessibilité"
                  style={{ background: 'none', color: '#fff', opacity: 0.5 }}
                >
                  <X size={18} aria-hidden="true" />
                </button>
            </div>

            <button
              onClick={() => setIsLargeText(!isLargeText)}
              className="btn"
              aria-pressed={isLargeText}
              aria-label={isLargeText ? "Désactiver le texte agrandi" : "Activer le texte agrandi"}
              style={{
                background: isLargeText ? 'var(--primary-gold)' : 'rgba(255,255,255,0.1)',
                color: '#fff', padding: '1rem', width: '100%', justifyContent: 'flex-start',
                borderRadius: '12px'
              }}
            >
              <Type size={20} aria-hidden="true" /> {isLargeText ? 'Texte Normal' : 'Texte Plus Grand'}
            </button>

            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className="btn"
              aria-pressed={isHighContrast}
              aria-label={isHighContrast ? "Désactiver le mode haut contraste" : "Activer le mode haut contraste"}
              style={{
                background: isHighContrast ? 'var(--primary-gold)' : 'rgba(255,255,255,0.1)',
                color: '#fff', padding: '1rem', width: '100%', justifyContent: 'flex-start',
                borderRadius: '12px'
              }}
            >
              <Contrast size={20} aria-hidden="true" /> {isHighContrast ? 'Mode Standard' : 'Haut Contraste'}
            </button>

            <button
              onClick={() => {
                const next = !isTTSEnabled;
                setIsTTSEnabled(next);
                if (next) speak("Mode lecture activé. Cliquez sur n'importe quel texte pour l'écouter.");
                else window.speechSynthesis.cancel();
              }}
              className="btn"
              aria-pressed={isTTSEnabled}
              aria-label={isTTSEnabled ? "Désactiver la synthèse vocale" : "Activer la synthèse vocale (cliquer pour lire)"}
              style={{
                background: isTTSEnabled ? 'var(--primary-gold)' : 'rgba(255,255,255,0.1)',
                color: '#fff', padding: '1rem', width: '100%', justifyContent: 'flex-start',
                borderRadius: '12px'
              }}
            >
              <AudioLines size={20} aria-hidden="true" /> {isTTSEnabled ? 'Désactiver Lecture' : 'Synthèse Vocale'}
            </button>

            <a
              href="tel:15"
              className="btn"
              aria-label="Appeler les urgences (15)"
              style={{ 
                padding: '1rem', 
                width: '100%', 
                justifyContent: 'flex-start', 
                backgroundColor: '#ef4444', 
                color: '#fff',
                borderRadius: '12px',
                marginTop: '0.5rem'
              }}
            >
              <PhoneCall size={20} aria-hidden="true" /> Urgence (15)
            </a>
          </motion.div>
        )}
        </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="acc-title"
        aria-label="Ouvrir les options d'accessibilité"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-gold)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-premium)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {isOpen ? <X size={28} aria-hidden="true" /> : <ZoomIn size={28} aria-hidden="true" />}
      </motion.button>
    </div>
  );
};

export default AccessibilityToolbar;
