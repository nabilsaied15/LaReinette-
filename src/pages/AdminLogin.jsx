import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { verifyAdminCredentials, login, isAdmin } = useSettings();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      navigate('/direction/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedPassword = DOMPurify.sanitize(password);

    if (verifyAdminCredentials(sanitizedEmail, sanitizedPassword)) {
      setStep(2);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  const handleSubmitStep2 = (e) => {
    e.preventDefault();
    const sanitizedPin = DOMPurify.sanitize(pin);
    if (login(sanitizedPin)) {
      navigate('/direction/admin/dashboard');
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <>
      <SEO title="Connexion Admin" description="Espace sécurisé d'administration." />
      <div style={{ minHeight: '100vh', background: 'var(--bg-creme)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '180px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%',
          maxWidth: '450px',
          background: '#fff',
          padding: '4rem 3rem',
          borderRadius: '32px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          style={{
            width: '80px',
            height: '80px',
            background: 'var(--emerald-900)',
            color: 'var(--primary-gold)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2.5rem'
          }}
        >
          {step === 1 ? <Lock size={36} /> : <ShieldCheck size={36} />}
        </motion.div>

        <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--emerald-900)' }}>Espace Admin</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
           {step === 1 ? "Connectez-vous pour gérer le contenu du site." : "Veuillez saisir votre Code PIN d'authentification à 6 chiffres."}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSubmitStep1} style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-gold)' }} />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.2rem 1.2rem 1.2rem 4rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-creme)',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-gold)' }} />
              <input
                type="password"
                placeholder="Mot de passe"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.2rem 1.2rem 1.2rem 4rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-creme)',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#e53e3e', fontSize: '0.9rem', fontWeight: 600 }}
              >
                Identifiants incorrects. Veuillez réessayer.
              </motion.p>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '1.2rem',
                borderRadius: '12px',
                fontSize: '1.1rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1rem'
              }}
            >
              Étape suivante <ChevronRight size={20} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitStep2} style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <ShieldCheck size={18} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-gold)' }} />
              <input
                type="password"
                placeholder="Code PIN (secret)"
                maxLength="6"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.2rem 1.2rem 1.2rem 4rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-creme)',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5rem',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#e53e3e', fontSize: '0.9rem', fontWeight: 600 }}
              >
                Code PIN invalide. Accès refusé.
              </motion.p>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '1.2rem',
                borderRadius: '12px',
                fontSize: '1.1rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '1rem'
              }}
            >
              Vérifier et Se connecter <ShieldCheck size={20} />
            </button>
          </form>
        )}

        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '2.5rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            margin: '2.5rem auto 0'
          }}
        >
          <ArrowLeft size={16} /> Retour au site
        </button>
      </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
