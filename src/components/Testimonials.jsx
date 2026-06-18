import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Send, MessageSquare } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../config/supabase';

const Testimonials = () => {
  const { settings } = useSettings();
  const testimonials = (settings.testimonials || []).filter(t => !t.isHidden);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    rating: 5
  });

  const mergedTestimonials = useMemo(() => {
    const dynamicReviews = reviews.map((review) => ({
      id: `db-${review.id}`,
      content: review.comment,
      name: review.name,
      rating: review.rating
    }));

    return [...dynamicReviews, ...testimonials];
  }, [reviews, testimonials]);

  // Duplicate for seamless loop
  const tripleTestimonials = [...mergedTestimonials, ...mergedTestimonials, ...mergedTestimonials];

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('id, name, comment, rating, created_at')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Erreur chargement avis:', error.message);
        setIsLoadingReviews(false);
        return;
      }

      setReviews(data || []);
      setIsLoadingReviews(false);
    };

    fetchReviews();
  }, []);

  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitMessage('');

    const name = formData.name.trim();
    const comment = formData.comment.trim();

    if (!name || !comment || !formData.rating) {
      setSubmitMessage('Veuillez remplir tous les champs.');
      return;
    }

    if (comment.length < 10) {
      setSubmitMessage('Le commentaire doit contenir au moins 10 caracteres.');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('reviews').insert([
      {
        name,
        comment,
        rating: formData.rating,
        is_approved: true
      }
    ]);

    if (error) {
      console.error("Erreur d'enregistrement de l'avis:", error.message);
      setSubmitMessage("Impossible d'enregistrer votre avis pour le moment.");
      setIsSubmitting(false);
      return;
    }

    const freshReview = {
      id: Date.now(),
      name,
      comment,
      rating: formData.rating,
      created_at: new Date().toISOString()
    };

    setReviews((prev) => [freshReview, ...prev].slice(0, 12));
    setFormData({ name: '', comment: '', rating: 5 });
    setSubmitMessage('Merci ! Votre avis a bien ete enregistre.');
    setIsSubmitting(false);
  };

  return (
    <section style={{ padding: '8rem 0', background: 'var(--bg-creme)', overflow: 'hidden', position: 'relative' }}>
      {/* Decorative Background Icon */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ 
          position: 'absolute', 
          top: '-10%', 
          left: '-5%', 
          color: 'rgba(212, 175, 55, 0.03)', 
          zIndex: 0 
        }}
      >
        <Quote size={500} strokeWidth={0.5} />
      </motion.div>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .testimonial-marquee {
            display: flex;
            gap: 2.5rem;
            width: fit-content;
            animation: marquee 60s linear infinite;
            position: relative;
            zIndex: 1;
          }
          .testimonial-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '6rem' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>LA PAROLE À NOS BÉNÉFICIAIRES</div>
          <h2 className="section-title">La voix de <br /> <span className="text-gold">ceux qui nous font confiance</span></h2>
        </motion.div>
      </div>

      <div className="container" style={{ maxWidth: '900px', marginBottom: '4rem', position: 'relative', zIndex: 1 }}>
        <motion.form
          onSubmit={handleSubmitReview}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: 'transparent',
            borderTop: '1px solid #e5e0d8',
            padding: '2rem 1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', color: 'var(--emerald-900)' }}>
            <MessageSquare size={18} />
            <strong style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Laisser votre témoignage</strong>
          </div>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Votre nom"
              required
              style={{
                width: '100%',
                border: '1px solid #e5e0d8',
                borderRadius: '0',
                padding: '1rem',
                fontSize: '1rem',
                background: 'transparent'
              }}
            />
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder="Votre expérience avec nos services..."
              required
              rows={4}
              style={{
                width: '100%',
                border: '1px solid #e5e0d8',
                borderRadius: '0',
                padding: '1rem',
                fontSize: '1rem',
                background: 'transparent',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => handleStarClick(starValue)}
                  style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                  aria-label={`${starValue} etoiles`}
                >
                  <Star
                    size={22}
                    fill={starValue <= formData.rating ? 'var(--primary-gold)' : 'transparent'}
                    color="var(--primary-gold)"
                  />
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '50px' }}
            >
              <Send size={16} />
              {isSubmitting ? 'Publication...' : 'Publier'}
            </button>
          </div>

          {submitMessage && (
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: submitMessage.includes('Merci') ? 'var(--primary-green)' : '#b42318' }}>
              {submitMessage}
            </p>
          )}
        </motion.form>
      </div>

      {/* Marquee Container */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div className="testimonial-marquee">
          {!isLoadingReviews && tripleTestimonials.length === 0 && (
            <p style={{ color: 'var(--text-muted)', padding: '0 2rem' }}>
              Aucun avis pour le moment.
            </p>
          )}
          {tripleTestimonials.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              style={{
                background: 'transparent',
                padding: '3rem',
                width: '400px',
                flexShrink: 0,
                borderTop: '1px solid #e5e0d8',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                transition: 'background-color 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ color: 'var(--primary-gold)', opacity: 0.3 }}>
                  <Quote size={40} strokeWidth={1} />
                </div>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {[...Array(5)].map((_, starIdx) => {
                    const itemRating = Number(item.rating) || 5;
                    return (
                      <Star
                        key={starIdx}
                        size={12}
                        fill={starIdx < itemRating ? 'var(--primary-gold)' : 'transparent'}
                        color="var(--primary-gold)"
                      />
                    );
                  })}
                </div>
              </div>

              <p style={{
                fontSize: '1.2rem',
                color: 'var(--text-main)',
                lineHeight: 1.7,
                fontFamily: 'var(--font-sans)',
                minHeight: '120px'
              }}>
                "{item.content}"
              </p>

              <div style={{ marginTop: 'auto', paddingTop: '1.2rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--emerald-900)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  {item.name}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gradient overlays for smooth fading at edges */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, bottom: 0,
          width: '150px',
          background: 'linear-gradient(to right, var(--bg-creme), transparent)',
          pointerEvents: 'none',
          zIndex: 2
        }} />
        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0,
          width: '150px',
          background: 'linear-gradient(to left, var(--bg-creme), transparent)',
          pointerEvents: 'none',
          zIndex: 2
        }} />
      </div>
    </section>
  );
};

export default Testimonials;
