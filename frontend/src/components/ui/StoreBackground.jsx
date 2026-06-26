import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const STORE_ICONS = ['🛒', '🏪', '⭐', '🛍️', '📦', '🏷️', '🧾', '💳', '📍', '❤️', '🔍', '📱', '🎁', '🔔'];

const StoreBackground = () => {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    const count = Math.min(28, Math.floor((window.innerWidth * window.innerHeight) / 32000));

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'store-bg-icon';
      el.textContent = STORE_ICONS[Math.floor(Math.random() * STORE_ICONS.length)];

      const size = 22 + Math.random() * 18;
      const x = Math.random() * 98;
      const y = Math.random() * 98;
      const delay = Math.random() * 6;
      const duration = 6 + Math.random() * 6;
      const reverse = Math.random() > 0.5;

      el.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        font-size: ${size}px;
        animation: ${reverse ? 'float-reverse' : 'float'} ${duration}s ${delay}s ease-in-out infinite;
        filter: grayscale(0.3);
        transition: opacity 0.5s ease;
      `;
      container.appendChild(el);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default StoreBackground;
