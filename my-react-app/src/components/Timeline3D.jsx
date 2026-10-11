import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PlayIcon, Volume2Icon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon, CalendarIcon, MapPinIcon } from './Icons';

export const Timeline3D = ({ chaptersList, onSelectChapter, onAddMemory, onPlayMovie }) => {
  const containerRef = useRef(null);
  const cardsWrapperRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const ringCanvasRef = useRef(null);

  // Active index state (smoothly animated via GSAP)
  const [activeIndex, setActiveIndex] = useState(2); // Start at Chapter 3 (The Wedding)
  const activeIndexRef = useRef(2);

  // GSAP drag & momentum state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentDragXRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const targetIndexRef = useRef(2);
  const animFrameRef = useRef(null);
  const currentProgressRef = useRef(2); // Fractional index for smooth lerp

  const totalChapters = chaptersList.length;

  // 1. Floating Gold Dust Particle Canvas (HTML5 Canvas / Three.js feel)
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const particles = [];
    const count = 75;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.1,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let reqId;
    const render = () => {
      reqId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
        grad.addColorStop(0, `rgba(255, 246, 214, ${Math.max(0.1, Math.min(0.9, p.alpha))})`);
        grad.addColorStop(0.5, `rgba(212, 175, 55, ${Math.max(0.05, Math.min(0.6, p.alpha * 0.7))})`);
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. Interactive 3D Gold Solitaire Ring Artifact (Three.js)
  useEffect(() => {
    const canvas = ringCanvasRef.current;
    if (!canvas || !window.THREE) return;

    const THREE = window.THREE;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambLight);

    const pLight1 = new THREE.PointLight(0xfff6d6, 3, 20);
    pLight1.position.set(3, 4, 3);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0xd4af37, 2, 20);
    pLight2.position.set(-3, -2, 2);
    scene.add(pLight2);

    const ringGroup = new THREE.Group();
    const torusGeo = new THREE.TorusGeometry(1.0, 0.16, 24, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdfbe5b,
      metalness: 0.95,
      roughness: 0.18,
    });
    const ringBand = new THREE.Mesh(torusGeo, goldMat);
    ringGroup.add(ringBand);

    const gemGeo = new THREE.OctahedronGeometry(0.35, 1);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.05,
      transmission: 0.85,
      ior: 2.4,
      transparent: true,
      opacity: 0.95,
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gemMesh.position.set(0, 1.15, 0);
    ringGroup.add(gemMesh);

    const prongGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8);
    for (let i = 0; i < 4; i++) {
      const prong = new THREE.Mesh(prongGeo, goldMat);
      const angle = (i * Math.PI) / 2;
      prong.position.set(Math.cos(angle) * 0.18, 1.05, Math.sin(angle) * 0.18);
      ringGroup.add(prong);
    }

    ringGroup.rotation.x = 0.45;
    ringGroup.rotation.y = 0.3;
    scene.add(ringGroup);

    let reqId;
    let clock = new THREE.Clock();
    const animateRing = () => {
      reqId = requestAnimationFrame(animateRing);
      const t = clock.getElapsedTime();
      ringGroup.rotation.y = t * 0.6;
      ringGroup.rotation.z = Math.sin(t * 0.8) * 0.15;
      renderer.render(scene, camera);
    };
    animateRing();

    return () => {
      cancelAnimationFrame(reqId);
      renderer.dispose();
    };
  }, []);

  // 3. GSAP 3D Spatial Calculation Loop
  // Updates CSS 3D transforms (translateZ, translateX, rotateY, scale, blur, opacity)
  const updateSpatialPositions = useCallback((progress) => {
    const gsap = window.gsap;
    const cards = document.querySelectorAll('.spatial-3d-card');
    if (!cards || cards.length === 0) return;

    cards.forEach((card, idx) => {
      const diff = idx - progress; // distance from center (can be fractional)
      const absDiff = Math.abs(diff);

      // Core formula from specification:
      // Active: scale(1.08), translateZ(0px), blur(0px), full opacity, subtle gold border glow
      // Neighboring: rotateY(±25deg), translateZ(-200px to -800px), blur(4px to 12px), lower opacity
      const translateX = diff * 280; // horizontal spacing in px
      const translateZ = -absDiff * 260; // push back in 3D depth
      const rotateY = gsap ? gsap.utils.clamp(-45, 45, -diff * 25) : -diff * 25; // tilt inward
      const scale = Math.max(0.75, 1.08 - absDiff * 0.14);
      const opacity = Math.max(0.15, 1.0 - absDiff * 0.32);
      const blurPx = Math.max(0, (absDiff - 0.2) * 5.5);
      const zIndex = Math.round(100 - absDiff * 10);

      // Apply CSS 3D transforms directly
      card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.filter = blurPx > 0.5 ? `blur(${blurPx}px)` : 'none';
      card.style.zIndex = zIndex;
      card.style.pointerEvents = absDiff < 0.8 ? 'auto' : 'none';

      // Border glow on active card
      if (absDiff < 0.4) {
        card.classList.add('active-spatial-card');
      } else {
        card.classList.remove('active-spatial-card');
      }
    });
  }, []);

  // Continuous physics RAF loop with damping
  useEffect(() => {
    const loop = () => {
      animFrameRef.current = requestAnimationFrame(loop);

      if (!isDraggingRef.current) {
        // Smooth lerp damping towards targetIndexRef
        const diff = targetIndexRef.current - currentProgressRef.current;
        currentProgressRef.current += diff * 0.085;

        // Sync integer state when close
        const rounded = Math.round(currentProgressRef.current);
        if (Math.abs(diff) < 0.01 && activeIndexRef.current !== rounded) {
          activeIndexRef.current = rounded;
          setActiveIndex(rounded);
        }
      }

      updateSpatialPositions(currentProgressRef.current);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [updateSpatialPositions]);

  // 4. Mouse / Touch Drag Handlers with Velocity & Momentum
  const handleDragStart = (clientX) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handleDragMove = (clientX) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = now - lastTimeRef.current || 16;
    const dx = clientX - lastXRef.current;

    velocityRef.current = dx / dt;
    lastXRef.current = clientX;
    lastTimeRef.current = now;

    // Convert pixel drag to fractional index change (sensitivity factor: 1 card = 400px)
    const deltaIndex = -dx / 380;
    currentProgressRef.current = Math.max(-0.2, Math.min(totalChapters - 0.8, currentProgressRef.current + deltaIndex));
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Apply momentum throw based on velocity
    const momentum = -velocityRef.current * 120;
    let projectedTarget = currentProgressRef.current + momentum / 380;
    let finalIndex = Math.round(projectedTarget);
    finalIndex = Math.max(0, Math.min(totalChapters - 1, finalIndex));

    targetIndexRef.current = finalIndex;
  };

  // Wheel scroll interaction
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.0018;
    const newTarget = Math.max(0, Math.min(totalChapters - 1, targetIndexRef.current + (delta > 0 ? 1 : -1)));
    targetIndexRef.current = newTarget;
  };

  // Direct chapter jump button
  const jumpTo = (idx) => {
    targetIndexRef.current = Math.max(0, Math.min(totalChapters - 1, idx));
  };

  const activeChapter = chaptersList[activeIndex] || chaptersList[0];

  return (
    <section
      id="timeline"
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
      className="relative w-full h-screen min-h-[750px] overflow-hidden bg-[#07080E] select-none flex flex-col justify-between cursor-grab active:cursor-grabbing"
      style={{ perspective: '1200px' }}
    >
      {/* Background Floating Gold Dust Particle Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={particleCanvasRef} className="w-full h-full" />
      </div>

      {/* Atmospheric Radial Shading */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_45%,rgba(212,175,55,0.06)_0%,transparent_60%,#07080E_95%)] z-0" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#07080E] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#07080E] via-[#07080E]/80 to-transparent pointer-events-none z-10" />

      {/* ========================================================= */}
      {/* Sub-Header: Active Milestone Progress & Header Controls */}
      {/* ========================================================= */}
      <div className="relative z-20 mx-auto max-w-7xl w-full px-6 pt-24 flex items-center justify-between">
        {/* Active Chapter Index Counter */}
        <div className="flex items-center space-x-3">
          <div className="flex items-baseline space-x-1 font-cinzel">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] tracking-wider">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-sm text-[#F3E5AB]/40 font-light">/</span>
            <span className="text-xs sm:text-sm text-[#F3E5AB]/60 font-medium">
              {String(totalChapters).padStart(2, '0')}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-[#D4AF37]/30" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#F3E5AB]/80 font-sans font-medium hidden sm:inline">
            {activeChapter.title.split('–')[0]?.trim()}
          </span>
        </div>

        {/* Action Buttons: Add Memory & Play Cinematic Reel */}
        <div className="flex items-center space-x-3">
          <button
            data-magnetic="true"
            data-cursor="ADD"
            onClick={onAddMemory}
            className="px-4 py-1.5 rounded-full glass-gold border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-sans font-medium tracking-wider hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 hover:text-white transition-all shadow-[0_0_12px_rgba(212,175,55,0.15)] flex items-center space-x-1.5"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Add Memory</span>
          </button>

          <button
            data-magnetic="true"
            data-cursor="REEL"
            onClick={onPlayMovie}
            className="px-4 sm:px-5 py-1.5 rounded-full bg-gradient-to-r from-[#DFBE5B] to-[#D4AF37] text-black text-xs font-sans font-semibold tracking-wider hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            Play Cinematic Reel
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3D Spatial Carousel Stage */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center overflow-visible">
        <div
          ref={cardsWrapperRef}
          className="relative w-[340px] sm:w-[460px] md:w-[500px] h-[450px] sm:h-[490px] flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {chaptersList.map((chapter, idx) => {
            const isCenter = idx === activeIndex;
            return (
              <div
                key={chapter.id}
                onClick={() => {
                  if (isCenter) {
                    onSelectChapter(chapter);
                  } else {
                    jumpTo(idx);
                  }
                }}
                className="spatial-3d-card absolute top-0 left-0 w-full h-full glass-gold rounded-3xl p-5 sm:p-6 border border-[#D4AF37]/35 shadow-2xl transition-shadow duration-300 flex flex-col justify-between cursor-pointer group"
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity, filter',
                  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                }}
              >
                {/* Gold Highlight top edge */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

                {/* Card Header: Year, Date, Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#D4AF37] tracking-wider">
                      {chapter.year}
                    </span>
                    <span className="h-3 w-[1px] bg-[#D4AF37]/40" />
                    <div className="flex items-center text-[11px] text-[#F3E5AB]/70 tracking-widest uppercase font-sans">
                      <CalendarIcon className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                      {chapter.date}
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-widest bg-white/5 border border-[#D4AF37]/30 text-[#F3E5AB]">
                    {chapter.badge}
                  </span>
                </div>

                {/* Card Media Preview */}
                <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#D4AF37]/50 transition-colors my-3">
                  <img
                    src={chapter.image}
                    alt={chapter.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                  {/* Play Button Node */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-13 h-13 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.6)] group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                      <PlayIcon className="w-6 h-6 ml-0.5" />
                    </div>
                  </div>

                  {/* Location Tag */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-[#F3E5AB] border border-white/10">
                    <MapPinIcon className="w-3 h-3 text-[#D4AF37]" />
                    <span>{chapter.location}</span>
                  </div>
                </div>

                {/* Card Narrative */}
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#F3E5AB] transition-colors leading-snug">
                    {chapter.title}
                  </h3>
                  <p className="font-serif italic text-xs text-[#D4AF37]/90 mt-0.5">
                    {chapter.subtitle}
                  </p>
                  <p className="mt-1.5 text-xs text-[#F3E5AB]/75 line-clamp-2 font-sans font-normal leading-relaxed">
                    {chapter.summary}
                  </p>
                </div>

                {/* Card Bottom Prompt */}
                <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] text-[#D4AF37] font-sans">
                  <span className="uppercase tracking-widest font-semibold flex items-center space-x-1">
                    <span>Open Cinematic Story</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <span className="text-[10px] text-[#F3E5AB]/50">
                    Milestone {idx + 1} of {totalChapters}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* Floating Keepsakes & Navigation Controls Footer */}
      {/* ========================================================= */}
      <div className="relative z-20 mx-auto max-w-7xl w-full px-6 pb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Floating "Play Wedding Vows" audio player pill with animated waveform */}
        <div className="flex items-center space-x-3">
          <button
            data-magnetic="true"
            data-cursor="VOWS"
            onClick={() => {
              const el = document.getElementById('vault');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center space-x-3 px-4 py-2 rounded-full glass-gold border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-sans tracking-wide hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] group"
          >
            {/* Animated Audio Waveform Visualizer */}
            <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center space-x-[2px] px-1 text-[#D4AF37]">
              <span className="inline-block w-[2px] h-3.5 bg-[#D4AF37] rounded-full animate-pulse" />
              <span className="inline-block w-[2px] h-2 bg-[#D4AF37] rounded-full animate-ping" />
              <span className="inline-block w-[2px] h-4 bg-[#D4AF37] rounded-full animate-pulse" />
              <span className="inline-block w-[2px] h-2.5 bg-[#D4AF37] rounded-full animate-bounce" />
            </div>
            <span className="font-medium">Play Wedding Vows</span>
          </button>
        </div>

        {/* Center: Interactive Stepper & Timeline Progress Scrub */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => jumpTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="p-2 rounded-full glass-gold border border-[#D4AF37]/40 text-[#F3E5AB] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#D4AF37]/20 transition-all shadow-md"
            title="Previous Milestone"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1.5 glass-gold rounded-full px-3 py-1.5 border border-[#D4AF37]/30 shadow-gold-subtle">
            {chaptersList.map((chap, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={chap.id}
                  onClick={() => jumpTo(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'w-6 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]'
                      : 'bg-white/20 hover:bg-white/50'
                  }`}
                  title={chap.title}
                />
              );
            })}
          </div>

          <button
            onClick={() => jumpTo(activeIndex + 1)}
            disabled={activeIndex === totalChapters - 1}
            className="p-2 rounded-full glass-gold border border-[#D4AF37]/40 text-[#F3E5AB] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#D4AF37]/20 transition-all shadow-md"
            title="Next Milestone"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Right: 3D Artifact Vault Corner Preview with 360° Ring */}
        <div
          data-magnetic="true"
          data-cursor="RING"
          onClick={() => {
            const el = document.getElementById('vault');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="glass-gold rounded-2xl p-2.5 border border-[#D4AF37]/40 hover:border-[#D4AF37] cursor-pointer group transition-all duration-300 shadow-xl flex items-center space-x-3"
        >
          <div className="w-14 h-14 relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white/5 to-transparent">
            <canvas ref={ringCanvasRef} className="w-full h-full" />
          </div>
          <div className="text-left pr-2">
            <span className="block text-xs font-serif font-bold text-white group-hover:text-[#F3E5AB] transition-colors">
              3D Artifact Vault
            </span>
            <span className="block text-[10px] text-[#F3E5AB]/70 font-sans mt-0.5">
              360° Gold Solitaire Ring
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
