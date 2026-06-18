import React from 'react';
import { useLocation } from 'react-router-dom';
import './ScrollingBanner.css';

const SparklesIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="48" 
    height="48" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="var(--primary-gold, #D4AF37)" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="banner-crown"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="m5 3 1 2" />
    <path d="m19 21 1-2" />
    <path d="m5 21 1-2" />
    <path d="m19 3 1-2" />
  </svg>
);

const MOBILE_MQ = '(max-width: 768px)';
const SCROLL_THRESHOLD = 60;
const SCROLL_DELTA = 8;

const ScrollingBanner = () => {
  const location = useLocation();
  const [hidden, setHidden] = React.useState(false);
  const lastScrollY = React.useRef(0);

  const isLaReinette = location.pathname === '/' || location.pathname.includes('/la-reinette');

  React.useEffect(() => {
    if (!isLaReinette) return undefined;

    const mq = window.matchMedia(MOBILE_MQ);

    const onScroll = () => {
      if (!mq.matches) {
        setHidden(false);
        return;
      }

      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (y <= SCROLL_THRESHOLD) {
        setHidden(false);
      } else if (delta > SCROLL_DELTA) {
        setHidden(true);
      } else if (delta < -SCROLL_DELTA) {
        setHidden(false);
      }

      lastScrollY.current = y;
    };

    const onResize = () => {
      if (!mq.matches) setHidden(false);
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener('change', onResize);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', onResize);
      window.removeEventListener('resize', onResize);
    };
  }, [isLaReinette]);

  if (!isLaReinette) {
    return null;
  }

  return (
    <div className={`scrolling-banner-container${hidden ? ' banner-hidden' : ''}`}>
      <div className="banner-premium-text">
        <SparklesIcon />
        <span>LA REINETTE — MOBILITÉ SOLIDAIRE</span>
      </div>
    </div>
  );
};

export default ScrollingBanner;
