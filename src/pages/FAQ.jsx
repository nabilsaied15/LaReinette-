import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  HelpCircle,
  Phone,
  MessageSquare,
  Info,
  ShieldCheck,
  CreditCard,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import './FAQ.css';

const PER_COLUMN = 5;
const PER_PAGE = PER_COLUMN * 2;

const categoryIcon = (category) => {
  switch (category) {
    case 'Éligibilité':
      return <UserCheck size={20} />;
    case 'Réservation':
      return <Clock size={20} />;
    case 'Paiement':
      return <CreditCard size={20} />;
    case 'Sécurité':
      return <ShieldCheck size={20} />;
    default:
      return <HelpCircle size={20} />;
  }
};

const FaqItem = ({ item, index, isLastInColumn }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="faq-item"
    style={{
      borderBottom: isLastInColumn ? '1px solid var(--border-subtle)' : undefined,
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '1rem',
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--emerald-900)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div className="faq-item-summary-main">
        <div className="faq-item-icon">{categoryIcon(item.category)}</div>
        <span>{item.q}</span>
      </div>
    </div>
    <p className="faq-item-answer">{item.a}</p>
  </motion.div>
);

const FaqColumn = ({ items }) => (
  <div className="faq-column">
    {items.map((faqItem, i) => (
      <FaqItem
        key={faqItem.q}
        item={faqItem}
        index={i}
        isLastInColumn={i === items.length - 1}
      />
    ))}
  </div>
);

const FAQ = () => {
  const { settings } = useSettings();
  const { faq } = settings;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [page, setPage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = faq.categories || ['Tous', 'Éligibilité', 'Réservation', 'Paiement', 'Sécurité'];

  const filteredFaq = useMemo(
    () =>
      faq.questions.filter((item) => {
        const matchesSearch =
          item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.a.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'Tous' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
      }),
    [faq.questions, searchTerm, activeCategory]
  );

  const pageChunks = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < filteredFaq.length; i += PER_PAGE) {
      chunks.push(filteredFaq.slice(i, i + PER_PAGE));
    }
    return chunks.length ? chunks : [];
  }, [filteredFaq]);

  const maxPage = Math.max(0, pageChunks.length - 1);
  const currentChunk = pageChunks[page] || [];

  const leftColumn = currentChunk.slice(0, PER_COLUMN);
  const rightColumn = currentChunk.slice(PER_COLUMN, PER_PAGE);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, activeCategory]);

  useEffect(() => {
    setPage((p) => Math.min(p, maxPage));
  }, [maxPage]);

  return (
    <div className="faq-page">
      <section className="faq-header-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="faq-header-inner"
          >
            <div className="section-label" style={{ justifyContent: 'center' }}>
              CENTRE D'AIDE
            </div>
            <h1
              className="font-serif"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: 'var(--emerald-900)',
                marginBottom: '2rem',
                lineHeight: 1.2,
              }}
            >
              Comment pouvons-nous <br />
              <span style={{ color: 'var(--primary-gold)', fontStyle: 'italic', fontWeight: 400 }}>
                vous aider ?
              </span>
            </h1>

            <div className="faq-search-wrap">
              <Search size={22} className="faq-search-icon" />
              <input
                type="text"
                className="faq-search-input"
                placeholder="Rechercher une question (ex: tarif, handicap...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="faq-categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`faq-category-btn ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="faq-list-section">
        <div className="container faq-list-container">
          <AnimatePresence mode="popLayout">
            {filteredFaq.length > 0 ? (
              <>
                <div className="faq-rows">
                  <div className="faq-row-pair">
                    <FaqColumn items={leftColumn} />
                    <FaqColumn items={rightColumn} />
                  </div>
                </div>

                {pageChunks.length > 1 && (
                  <div className="faq-pagination">
                    <button
                      type="button"
                      className="faq-pagination-btn"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      aria-label="Questions précédentes"
                    >
                      <ChevronLeft size={26} />
                    </button>
                    <span className="faq-pagination-label">
                      {page + 1} / {pageChunks.length}
                    </span>
                    <button
                      type="button"
                      className="faq-pagination-btn"
                      onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                      disabled={page >= maxPage}
                      aria-label="Questions suivantes"
                    >
                      <ChevronRight size={26} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="faq-empty"
              >
                Désolé, aucune question ne correspond à votre recherche.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="faq-cta-section">
        <div className="container faq-cta-inner">
          <HelpCircle size={36} style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }} />
          <h2
            className="font-serif"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '1rem', lineHeight: 1.2 }}
          >
            Vous n'avez pas trouvé{' '}
            <span style={{ color: 'var(--primary-gold)', fontStyle: 'italic', fontWeight: 400 }}>
              votre réponse ?
            </span>
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Notre équipe est à votre disposition par téléphone ou par message pour toute question spécifique.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', fontWeight: 700 }}>
              <Phone size={28} />
              <a href={`tel:${settings.contact.logisticsPhone}`} style={{ color: '#fff', textDecoration: 'none' }}>{settings.contact.logisticsPhone}</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 600 }}>
              <MessageSquare size={24} style={{ color: 'var(--primary-gold)' }} />
              <a href={`mailto:${settings.contact.email}`} style={{ color: '#fff', textDecoration: 'none' }}>{settings.contact.email}</a>
            </div>
          </div>
        </div>
        <Info size={300} className="faq-cta-deco" aria-hidden />
      </section>
    </div>
  );
};

export default FAQ;
