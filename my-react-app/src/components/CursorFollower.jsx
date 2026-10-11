import React, { useEffect, useRef, useState } from 'react';

export const CursorFollower = () => {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return;

    // Check if touch device - skip custom cursor on mobile
    if (window.matchMedia('(pointer: coarse)').matches) return;

    setIsVisible(true);

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;

    // Fast and smooth quickTo for zero-lag cursor physics
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    // Attach magnetic and text hover listeners to interactive elements
    const handleElementHover = (e) => {
      const target = e.target.closest('[data-cursor]');
      const clickable = e.target.closest('button, a, .milestone-card-item, [role="button"]');

      if (target) {
        const text = target.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsHovered(true);
        gsap.to(ring, {
          scale: 2.2,
          backgroundColor: 'rgba(212, 175, 55, 0.25)',
          borderColor: 'rgba(212, 175, 55, 0.9)',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else if (clickable) {
        setCursorText('');
        setIsHovered(true);
        gsap.to(ring, {
          scale: 1.6,
          backgroundColor: 'rgba(212, 175, 55, 0.15)',
          borderColor: 'rgba(212, 175, 55, 0.8)',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        setCursorText('');
        setIsHovered(false);
        gsap.to(ring, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(212, 175, 55, 0.5)',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    // Magnetic pull on elements with [data-magnetic]
    const handleMagneticMove = (e) => {
      const magneticEl = e.target.closest('[data-magnetic]');
      if (!magneticEl) return;

      const rect = magneticEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.28;
      const deltaY = (e.clientY - centerY) * 0.28;

      gsap.to(magneticEl, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMagneticLeave = (e) => {
      const magneticEl = e.target.closest('[data-magnetic]');
      if (!magneticEl) return;
      gsap.to(magneticEl, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mousemove', handleMagneticMove);
    document.addEventListener('mouseout', handleMagneticLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mousemove', handleMagneticMove);
      document.removeEventListener('mouseout', handleMagneticLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Tiny precise center dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-[#FFF6D6] rounded-full pointer-events-none z-[9999] shadow-[0_0_8px_#D4AF37]"
      />

      {/* Outer fluid aura ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-9 h-9 -ml-[18px] -mt-[18px] rounded-full border border-[#D4AF37]/50 pointer-events-none z-[9998] backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-200"
      >
        {cursorText && (
          <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};
