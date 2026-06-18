import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle2, Phone, MapPin } from 'lucide-react';
import emailjs from '@emailjs/browser';
import DOMPurify from 'dompurify';
import { supabase } from '../config/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CONTACT_SUBJECT_OPTIONS,
  getContactSubjectLabel,
  buildContactMessageTemplate,
} from '../data/contactSubjects';
import { validateContactForm, isContactSpam } from '../utils/contactValidation';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';
import mascotImg from '../assets/contact-grenouille.jpg';
import './Contact.css';

const Contact = () => {
  const { settings } = useSettings();
  const contact = settings?.contact || {};
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjectMotif: '',
    subjectOther: '',
    message: '',
    website: '' // Champ Honeypot (anti-spam)
  });
  const [errors, setErrors] = useState({});
  const [formStartTime, setFormStartTime] = useState(Date.now());

  useEffect(() => {
    window.scrollTo(0, 0);
    setFormStartTime(Date.now());
  }, []);

  useEffect(() => {
    const motif = searchParams.get('motif');
    const zone = searchParams.get('zone');
    if (!motif || !CONTACT_SUBJECT_OPTIONS.some((o) => o.value === motif)) return;

    const decodedZone = zone ? decodeURIComponent(zone) : '';
    setFormData((prev) => ({
      ...prev,
      subjectMotif: motif,
      message: buildContactMessageTemplate(motif, { zone: decodedZone }),
    }));
  }, [searchParams]);

  const handleMotifChange = (e) => {
    const motif = e.target.value;
    const zone = searchParams.get('zone');
    const decodedZone = zone ? decodeURIComponent(zone) : '';

    setFormData((prev) => ({
      ...prev,
      subjectMotif: motif,
      message: motif ? buildContactMessageTemplate(motif, { zone: decodedZone }) : '',
    }));
  };

  const validate = () => {
    const { valid, errors: newErrors } = validateContactForm(formData);
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isContactSpam({ website: formData.website, formStartTime })) {
      console.warn("Spam silencieusement bloqué.");
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    const { emailjs: emailjsConfig, emailTemplates, contact: contactSettings } = settings;
    const contactConfig = emailjsConfig?.contact;
    const labels = emailTemplates?.labels || {};
    const recipient = contactSettings?.formRecipientEmail || contactSettings?.email;

    try {
      const sanitizedMessage = DOMPurify.sanitize(formData.message);
      const subjectLabel = getContactSubjectLabel(formData.subjectMotif, formData.subjectOther);
      const sanitizedSubject = DOMPurify.sanitize(subjectLabel);
      const sanitizedName = DOMPurify.sanitize(formData.name);

      try {
        await supabase.from('contacts').insert([{
          email: formData.email,
          subject: sanitizedSubject,
          message: sanitizedMessage
        }]);
      } catch (dbError) {
        console.error("Erreur de sauvegarde Supabase (Contact):", dbError);
      }

      if (contactConfig?.serviceId && contactConfig?.templateId && contactConfig?.publicKey) {
        const htmlTable = `
          <div style="font-family: sans-serif;">
            <h2 style="color: #064e3b;">${labels.contactTitle || "Nouveau message de contact"}</h2>
            <p><strong>Nom :</strong> ${sanitizedName}</p>
            <p><strong>Téléphone :</strong> ${formData.phone}</p>
            <p><strong>${labels.contactFrom || "De :"}</strong> ${formData.email}</p>
            <p><strong>${labels.contactSubject || "Sujet :"}</strong> ${sanitizedSubject}</p>
            <div style="margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #064e3b;">
              ${sanitizedMessage.replace(/\n/g, '<br>')}
            </div>
          </div>
        `;

        await emailjs.send(
          contactConfig.serviceId,
          contactConfig.templateId,
          {
            to_email: recipient,
            from_name: sanitizedName,
            user_email: formData.email,
            user_phone: formData.phone,
            subject: `[CONTACT] - ${sanitizedSubject}`,
            message_html: htmlTable,
            nom: sanitizedName,
            user_subject: sanitizedSubject,
            message: sanitizedMessage
          },
          contactConfig.publicKey
        );
        setIsSubmitted(true);
      } else {
        const data = new FormData();
        data.append("Nom", sanitizedName);
        data.append("Email", formData.email);
        data.append("Téléphone", formData.phone);
        data.append("Sujet", sanitizedSubject);
        data.append("Message", sanitizedMessage);
        data.append("_subject", `[CONTACT SITE] - ${sanitizedSubject}`);

        const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
          method: "POST",
          body: data
        });

        if (response.ok) setIsSubmitted(true);
        else throw new Error("Erreur d'envoi");
      }
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      alert("Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="success-view">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="success-card"
        >
          <div className="success-icon-box">
            <CheckCircle2 size={60} />
          </div>
          <h2 className="font-serif success-title">{contact.successTitle}</h2>
          <p className="success-message">
            {contact.successMessage}
          </p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Contact"
        description="Contactez La Reinette pour toute question concernant nos services de transport pour seniors."
      />
      <div className="contact-page">
        <div className="container" style={{ maxWidth: '1400px' }}>

          <div className="contact-header-wrapper">
            <div className="contact-header-text">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="contact-header-label"
              >
                Contact & Support
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-serif contact-header-title"
              >
                Parlons de votre  <br />
                <span style={{ fontStyle: 'italic', color: 'var(--primary-green)' }}> Prochaines destinations</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="contact-header-description"
              >
                Une question sur nos trajets, nos tarifs ou besoin d'une réservation particulière ? Notre équipe est à votre écoute pour organiser vos déplacements en toute sérénité.
              </motion.p>
            </div>

            <div className="contact-mascot-container">
              <div className="contact-mascot-halo" aria-hidden="true" />
              <img src={mascotImg} alt="Mascot La Reinette" className="contact-mascot-img" />
            </div>
          </div>

          <div className="contact-grid">

            {/* Left Side: Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="contact-info-list">
                {[
                  { icon: Mail, label: 'Email', value: contact.email, color: 'var(--primary-green)' },
                  { icon: Phone, label: 'Téléphone', value: contact.standardPhone, color: 'var(--primary-gold)' },
                  { icon: MapPin, label: 'Adresse', value: contact.address, color: 'var(--emerald-900)' }
                ].map((item, idx) => (
                  <div key={idx} className="contact-info-item">
                    <div className="contact-info-icon-box" style={{ background: item.color + '08', color: item.color, border: `1px solid ${item.color}15` }}>
                      <item.icon size={30} />
                    </div>
                    <div>
                      <div className="contact-info-label">{item.label}</div>
                      <div className="contact-info-value">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-map-container">
                <iframe
                  title="Google Maps - Bourg-la-Reine"
                  src="https://maps.google.com/maps?q=3-5+allée+Françoise+Dolto,+92340+Bourg-la-Reine&hl=fr&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="contact-form-container"
            >
              <h2 className="font-serif contact-form-title">Envoyez un message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                {/* CHAMP HONEYPOT INVISIBLE */}
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <label htmlFor="website">Ne pas remplir ceci si vous êtes humain</label>
                  <input type="text" id="website" name="website" tabIndex="-1" autoComplete="off" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Votre Nom</label>
                  <input
                    type="text"
                    placeholder="Jean Dupont"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="jean@exemple.fr"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Téléphone</label>
                    <input
                      type="tel"
                      placeholder="06 12 34 56 78"
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-motif">Motif de votre demande</label>
                  <select
                    id="contact-motif"
                    className={`form-input form-select ${errors.subjectMotif ? 'error' : ''}`}
                    value={formData.subjectMotif}
                    onChange={handleMotifChange}
                  >
                    <option value="">— Choisissez un motif —</option>
                    {CONTACT_SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.subjectMotif && <span className="error-message">{errors.subjectMotif}</span>}
                </div>

                {formData.subjectMotif === 'autre' && (
                  <div className="form-group">
                    <label htmlFor="contact-motif-autre">Précisez le sujet</label>
                    <input
                      id="contact-motif-autre"
                      type="text"
                      placeholder="Décrivez brièvement votre demande"
                      className={`form-input ${errors.subjectOther ? 'error' : ''}`}
                      value={formData.subjectOther}
                      onChange={(e) => setFormData({ ...formData, subjectOther: e.target.value })}
                    />
                    {errors.subjectOther && <span className="error-message">{errors.subjectOther}</span>}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="contact-message">Votre message</label>
                  <textarea
                    id="contact-message"
                    rows={10}
                    placeholder={
                      formData.subjectMotif === 'autre'
                        ? 'Décrivez librement votre demande...'
                        : "Choisissez un motif : un modèle avec des points à remplir apparaîtra ici."
                    }
                    className={`form-textarea ${errors.message ? 'error' : ''}`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="btn btn-primary btn-submit"
                >
                  {isSubmitting ? 'Envoi en cours...' : <><Send size={24} /> Envoyer le message</>}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
