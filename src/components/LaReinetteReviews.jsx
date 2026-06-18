import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Send, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { supabase } from '../config/supabase';

/* Nombre de cartes par page selon la largeur d'écran */
const getPerPage = () => (window.innerWidth <= 768 ? 1 : 4);

const LaReinetteReviews = () => {
  const { settings } = useSettings();
  const staticTestimonials = (settings.testimonials || []).filter((t) => !t.isHidden);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', comment: '', rating: 5 });
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(getPerPage);

  /* Met à jour perPage lors du resize */
  useEffect(() => {
    const onResize = () => {
      const next = getPerPage();
      setPerPage((prev) => {
        if (prev !== next) { setPage(0); return next; }
        return prev;
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const allReviews = useMemo(() => {
    const fromDb = reviews.map((r) => ({
      id: `db-${r.id}`,
      name: r.name,
      role: r.role || 'Bénéficiaire La Reinette',
      content: r.comment,
      rating: Number(r.rating) || 5,
    }));

    const fromSettings = staticTestimonials.map((t, i) => ({
      id: `static-${i}`,
      name: t.name,
      role: t.role || '',
      content: t.content,
      rating: 5,
    }));

    return [...fromDb, ...fromSettings];
  }, [reviews, staticTestimonials]);

  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < allReviews.length; i += perPage) {
      chunks.push(allReviews.slice(i, i + perPage));
    }
    return chunks;
  }, [allReviews, perPage]);

  const maxPage = Math.max(0, pages.length - 1);
  const slidePercent = pages.length > 0 ? 100 / pages.length : 0;

  useEffect(() => {
    setPage((p) => Math.min(p, maxPage));
  }, [maxPage]);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('id, name, comment, rating, created_at')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(24);

      if (!error) setReviews(data || []);
      setIsLoading(false);
    };

    fetchReviews();
  }, []);

  const goPrev = () => {
    if (page <= 0) return;
    setPage((p) => p - 1);
  };

  const goNext = () => {
    if (page >= maxPage) return;
    setPage((p) => p + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');

    const name = formData.name.trim();
    const comment = formData.comment.trim();

    if (!name || !comment) {
      setSubmitMessage('Veuillez remplir tous les champs.');
      return;
    }
    if (comment.length < 10) {
      setSubmitMessage('Le commentaire doit contenir au moins 10 caractères.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('reviews').insert([
      { name, comment, rating: formData.rating, is_approved: true },
    ]);

    if (error) {
      setSubmitMessage("Impossible d'enregistrer votre avis pour le moment.");
      setIsSubmitting(false);
      return;
    }

    setReviews((prev) => [
      { id: Date.now(), name, comment, rating: formData.rating, created_at: new Date().toISOString() },
      ...prev,
    ].slice(0, 24));
    setFormData({ name: '', comment: '', rating: 5 });
    setSubmitMessage('Merci ! Votre témoignage a bien été publié.');
    setPage(0);
    setIsSubmitting(false);
  };

  const ReviewCard = ({ item }) => (
    <article className="reinette-review-card">
      <div className="reinette-review-card-top">
        <Quote size={32} strokeWidth={1} className="reinette-review-quote-icon" aria-hidden />
        <div className="reinette-review-stars" aria-label={`${item.rating} sur 5`}>
          {[1, 2, 3, 4, 5].map((v) => (
            <Star
              key={v}
              size={14}
              fill={v <= item.rating ? 'var(--primary-gold)' : 'transparent'}
              color="var(--primary-gold)"
            />
          ))}
        </div>
      </div>
      <p className="reinette-review-text font-serif">"{item.content}"</p>
      <footer className="reinette-review-author">
        <strong>{item.name}</strong>
        {item.role && <span>{item.role}</span>}
      </footer>
    </article>
  );

  return (
    <section id="avis" className="reinette-reviews-section">
      <div className="container">
        <div className="reinette-reviews-intro">
          <div className="section-label">TÉMOIGNAGES</div>
          <h2 className="section-title font-serif" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--emerald-900)' }}>
            Ce que disent <br />
            <span style={{ fontStyle: 'italic', color: 'var(--primary-gold)', fontWeight: 300 }}>nos bénéficiaires</span>
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: 1.8, maxWidth: '640px', margin: '1.5rem 0 0' }}>
            Découvrez les expériences de ceux qui utilisent La Reinette au quotidien. Vous aussi, partagez votre avis.
          </p>
        </div>

        {isLoading ? (
          <p className="reinette-reviews-loading">Chargement des avis…</p>
        ) : allReviews.length === 0 ? (
          <p className="reinette-reviews-empty">Soyez le premier à laisser un témoignage sur La Reinette.</p>
        ) : (
          <div className="reinette-reviews-carousel">
            <div className="reinette-reviews-viewport">
              <motion.div
                className="reinette-reviews-track"
                style={{ width: `${pages.length * 100}%` }}
                animate={{ x: `-${page * slidePercent}%` }}
                transition={{
                  duration: 0.55,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {pages.map((pageItems, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="reinette-reviews-page"
                    style={{ width: `${slidePercent}%` }}
                  >
                    {pageItems.map((item) => (
                      <ReviewCard key={item.id} item={item} />
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>

            {pages.length > 1 && (
              <div className="reinette-reviews-nav">
                <button
                  type="button"
                  className="reinette-reviews-nav-btn"
                  onClick={goPrev}
                  disabled={page === 0}
                  aria-label="Ligne précédente"
                >
                  <ChevronLeft size={28} />
                </button>

                <span className="reinette-reviews-counter">
                  {page + 1} / {pages.length}
                </span>

                <button
                  type="button"
                  className="reinette-reviews-nav-btn"
                  onClick={goNext}
                  disabled={page >= maxPage}
                  aria-label="Ligne suivante"
                >
                  <ChevronRight size={28} />
                </button>
              </div>
            )}
          </div>
        )}

        <motion.form
          className="reinette-review-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="reinette-review-form-header">
            <MessageSquare size={22} />
            <h3 className="font-serif">Laisser votre témoignage</h3>
          </div>

          <div className="reinette-review-form-grid">
            <input
              type="text"
              placeholder="Votre nom"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              className="reinette-review-input"
            />
            <textarea
              placeholder="Votre expérience avec La Reinette…"
              value={formData.comment}
              onChange={(e) => setFormData((p) => ({ ...p, comment: e.target.value }))}
              required
              rows={4}
              className="reinette-review-textarea"
            />
          </div>

          <div className="reinette-review-form-actions">
            <div className="reinette-review-stars-input">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, rating: v }))}
                  aria-label={`${v} étoiles`}
                  className="reinette-star-btn"
                >
                  <Star
                    size={24}
                    fill={v <= formData.rating ? 'var(--primary-gold)' : 'transparent'}
                    color="var(--primary-gold)"
                  />
                </button>
              ))}
            </div>
            <button type="submit" className="btn btn-primary reinette-review-submit" disabled={isSubmitting}>
              <Send size={18} />
              {isSubmitting ? 'Publication…' : 'Publier mon avis'}
            </button>
          </div>

          {submitMessage && (
            <p className={`reinette-review-feedback ${submitMessage.includes('Merci') ? 'success' : 'error'}`}>
              {submitMessage}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default LaReinetteReviews;
