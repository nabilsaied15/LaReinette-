import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="cookie-consent-wrapper"
        >
          <div className="cookie-consent-container">
            {/* Icon Column */}
            <div className="cookie-icon-box">
              <ShieldCheck size={32} />
            </div>

            {/* Text Column */}
            <div className="cookie-text-box">
              <h4>Respect de votre vie privée</h4>
              <p>
                Nous utilisons des cookies pour améliorer votre expérience sur notre plateforme et analyser notre trafic. 
                Certains sont essentiels au bon fonctionnement du site. En cliquant sur "Tout accepter", vous consentez à l'utilisation de tous les cookies.
                <Link to="/faq" className="cookie-link">En savoir plus</Link>
              </p>
            </div>

            {/* Actions Column */}
            <div className="cookie-actions">
              <button 
                onClick={handleDecline}
                className="btn-decline"
              >
                Refuser
              </button>
              <button 
                onClick={handleAccept}
                className="btn-accept"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;

