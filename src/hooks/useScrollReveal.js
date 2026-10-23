import { useEffect, useRef, useCallback } from 'react';

/**
 * Scroll-triggered reveal animation via IntersectionObserver.
 * Returns a ref callback — attach to any element.
 * The element should have the CSS class `reveal` (or `reveal-scale`, `reveal-left`, etc.)
 * This hook adds `reveal-visible` when the element enters the viewport.
 */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -60px 0px',
    once = true,
  } = options;

  const observerRef = useRef(null);
  const elementsRef = useRef(new Set());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            if (once) {
              observerRef.current?.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove('reveal-visible');
          }
        });
      },
      { threshold, rootMargin }
    );

    // Observe any elements already registered
    elementsRef.current.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin, once]);

  // Ref callback — attach to elements
  const revealRef = useCallback((node) => {
    if (node) {
      elementsRef.current.add(node);
      observerRef.current?.observe(node);
    }
  }, []);

  return revealRef;
}

/**
 * Convenience: observe all `.reveal` children inside a container.
 * Attach the returned ref to a parent container.
 */
export function useScrollRevealContainer(options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -40px 0px',
      }
    );

    const elements = container.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return containerRef;
}

export default useScrollReveal;
