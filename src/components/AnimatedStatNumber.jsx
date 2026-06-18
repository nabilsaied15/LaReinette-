import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/**
 * Compteur qui monte quand l'élément entre dans le viewport.
 */
export function useCountUp(target, { duration = 2200, enabled = true } = {}) {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, target]);

  useEffect(() => {
    if (!enabled) return;
    if (!hasStarted) return;

    let frameId;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeOutCubic(progress);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [hasStarted, target, duration, enabled]);

  return { value, ref, hasStarted };
}

const AnimatedStatNumber = ({ end, format, delay = 0, className = 'chiffres-stat-number' }) => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { value, ref } = useCountUp(end, { duration: 2200 + delay, enabled: !prefersReducedMotion });

  const display = prefersReducedMotion ? format(end) : format(value);

  return (
    <div ref={ref} className={className} aria-label={format(end)}>
      {display}
    </div>
  );
};

export default AnimatedStatNumber;
