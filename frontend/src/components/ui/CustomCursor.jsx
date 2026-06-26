import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const { isDark } = useTheme();

  useEffect(() => {
    // Only on non-touch devices
    if ('ontouchstart' in window) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const HOVER_SELECTORS = 'a, button, [role="button"], input, textarea, select, .card-hover, .rating-star, [data-cursor="pointer"]';

    let rafId;

    const moveCursor = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const animateRing = () => {
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.15;
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.15;
      ring.style.left = `${ringPosRef.current.x}px`;
      ring.style.top = `${ringPosRef.current.y}px`;
      rafId = requestAnimationFrame(animateRing);
    };

    const onEnter = (e) => {
      if (e.target.closest(HOVER_SELECTORS)) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
        ring.style.transform = 'translate(-50%, -50%) scale(1.5)';
        ring.style.opacity = '0.6';
      }
    };

    const onLeave = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseover', onEnter, { passive: true });
    document.addEventListener('mouseout', onLeave, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{ transform: 'translate(-50%, -50%)' }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{ transform: 'translate(-50%, -50%)' }}
        aria-hidden="true"
      />
    </>
  );
};

export default CustomCursor;
