import { useState, useEffect, useRef } from 'react';

/**
 * Animated number counter.
 * Counts from 0 to `target` over `duration` ms when `active` is true.
 */
export function useCountUp(target, options = {}) {
  const {
    duration = 1200,
    active = true,
    decimals = 0,
  } = options;

  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active || target === 0) {
      setValue(active ? target : 0);
      return;
    }

    startRef.current = performance.now();
    
    function animate(now) {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      
      setValue(Number(current.toFixed(decimals)));
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, active, decimals]);

  return value;
}

export default useCountUp;
