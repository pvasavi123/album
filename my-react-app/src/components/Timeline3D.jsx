import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon, CalendarIcon, MapPinIcon, Volume2Icon, VolumeXIcon } from './Icons';

export const Timeline3D = ({ chaptersList, onSelectChapter, onAddMemory, onPlayMovie }) => {
  const containerRef = useRef(null);
  const cardsWrapperRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const ringCanvasRef = useRef(null);

  // Active index state (smoothly animated via GSAP)
  const [activeIndex, setActiveIndex] = useState(2); // Start at Chapter 3 (Peddalu Kudirchina Match)
  const activeIndexRef = useRef(2);
  const [unmutedCardId, setUnmutedCardId] = useState(null);
  const videoRefs = useRef({});

  // GSAP drag & momentum state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
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
    const count = window.innerWidth < 768 ? 40 : 75;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.8,
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
    const width = canvas.clientWidth || 56;
    const height = canvas.clientHeight || 56;

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

    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth || 56;
      const h = canvas.clientHeight || 56;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // 3. Responsive GSAP 3D Spatial Calculation Loop
  // Dynamically adapts spacing, tilt, and depth based on viewport width
  const updateSpatialPositions = useCallback((progress) => {
    const gsap = window.gsap;
    const cards = document.querySelectorAll('.spatial-3d-card');
    if (!cards || cards.length === 0) return;

    const width = window.innerWidth;
    const isTinyMobile = width < 400;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    // Fluid responsive Spacing & Depth
    const spacingX = isTinyMobile ? 140 : isMobile ? 175 : isTablet ? 230 : 280;
    const depthZ = isTinyMobile ? 140 : isMobile ? 180 : isTablet ? 220 : 260;
    const maxTilt = isMobile ? 16 : 24;

    cards.forEach((card, idx) => {
      const diff = idx - progress; // distance from center (can be fractional)
      const absDiff = Math.abs(diff);

      const translateX = diff * spacingX;
      const translateZ = -absDiff * depthZ;
      const rotateY = gsap ? gsap.utils.clamp(-maxTilt * 1.5, maxTilt * 1.5, -diff * maxTilt) : -diff * maxTilt;
      const baseScale = isTinyMobile ? 0.98 : isMobile ? 1.02 : 1.08;
      const scale = Math.max(0.68, baseScale - absDiff * (isMobile ? 0.15 : 0.12));
      const opacity = Math.max(0.12, 1.0 - absDiff * (isMobile ? 0.42 : 0.32));
      const blurPx = Math.max(0, (absDiff - 0.25) * (isMobile ? 3.5 : 5.0));
      const zIndex = Math.round(100 - absDiff * 10);

      card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.filter = blurPx > 0.5 ? `blur(${blurPx}px)` : 'none';
      card.style.zIndex = zIndex;
      card.style.pointerEvents = absDiff < 0.75 ? 'auto' : 'none';

      if (absDiff < 0.4) {
        card.classList.add('active-spatial-card');
      } else {
        card.classList.remove('active-spatial-card');
      }
    });
  }, []);

  // Play/pause and mute/unmute management:
  // Center active card plays with optional unmuted sound; neighboring cards stay muted and paused or quietly looping
  useEffect(() => {
    chaptersList.forEach((chap, idx) => {
      const vid = videoRefs.current[chap.id];
      if (!vid) return;

      if (idx === activeIndex) {
        // Center active card: plays smoothly
        vid.muted = unmutedCardId !== chap.id;
        vid.play().catch(() => {});
      } else {
        // Neighboring cards: keep muted
        vid.muted = true;
        // Keep looping seamlessly in background for instant responsiveness
        vid.play().catch(() => {});
      }
    });
  }, [activeIndex, unmutedCardId, chaptersList]);

  // Continuous physics RAF loop with damping
  useEffect(() => {
    const loop = () => {
      animFrameRef.current = requestAnimationFrame(loop);

      if (!isDraggingRef.current) {
        const diff = targetIndexRef.current - currentProgressRef.current;
        currentProgressRef.current += diff * 0.085;

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

    const dragFactor = window.innerWidth < 640 ? 260 : 380;
    const deltaIndex = -dx / dragFactor;
    currentProgressRef.current = Math.max(-0.2, Math.min(totalChapters - 0.8, currentProgressRef.current + deltaIndex));
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const dragFactor = window.innerWidth < 640 ? 260 : 380;
    const momentum = -velocityRef.current * 120;
    let projectedTarget = currentProgressRef.current + momentum / dragFactor;
    let finalIndex = Math.round(projectedTarget);
    finalIndex = Math.max(0, Math.min(totalChapters - 1, finalIndex));

    targetIndexRef.current = finalIndex;
  };

  // Wheel / Trackpad Scrollview:
  // Smoothly scrub through cards on horizontal swipe or touchpad gestures,
  // without trapping vertical page scroll
  const lastWheelTimeRef = useRef(0);
  const handleWheel = (e) => {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const now = performance.now();

    if (isHorizontal) {
      // Horizontal swipe on trackpad: scrub through timeline cards
      if (Math.abs(e.deltaX) > 10 && now - lastWheelTimeRef.current > 180) {
        lastWheelTimeRef.current = now;
        const dir = e.deltaX > 0 ? 1 : -1;
        targetIndexRef.current = Math.max(0, Math.min(totalChapters - 1, targetIndexRef.current + dir));
      }
    } else if (e.shiftKey) {
      // Shift + Vertical Scroll: scrub horizontally
      e.preventDefault();
      if (Math.abs(e.deltaY) > 8 && now - lastWheelTimeRef.current > 180) {
        lastWheelTimeRef.current = now;
        const dir = e.deltaY > 0 ? 1 : -1;
        targetIndexRef.current = Math.max(0, Math.min(totalChapters - 1, targetIndexRef.current + dir));
      }
    }
  };

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
      className="relative w-full min-h-[680px] sm:min-h-[750px] lg:h-screen overflow-hidden bg-[#07080E] select-none flex flex-col justify-between cursor-grab active:cursor-grabbing pt-20 pb-6 sm:pb-8"
      style={{ perspective: '1200px' }}
    >
      {/* Background Floating Gold Dust Particle Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={particleCanvasRef} className="w-full h-full" />
      </div>

      {/* Atmospheric Radial Shading */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_45%,rgba(212,175,55,0.06)_0%,transparent_60%,#07080E_95%)] z-0" />
      <div className="absolute top-0 left-0 right-0 h-28 sm:h-32 bg-gradient-to-b from-[#07080E] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-36 bg-gradient-to-t from-[#07080E] via-[#07080E]/80 to-transparent pointer-events-none z-10" />

      {/* ========================================================= */}
      {/* Sub-Header: Active Milestone Progress & Header Controls */}
      {/* ========================================================= */}
      <div className="relative z-20 mx-auto max-w-7xl w-full px-4 sm:px-6 pt-4 sm:pt-6 flex flex-wrap items-center justify-between gap-3">
        {/* Active Chapter Index Counter */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-baseline space-x-1 font-cinzel">
            <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#D4AF37] tracking-wider">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm text-[#F3E5AB]/40 font-light">/</span>
            <span className="text-[11px] sm:text-xs lg:text-sm text-[#F3E5AB]/60 font-medium">
              {String(totalChapters).padStart(2, '0')}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-[#D4AF37]/30" />
          <div className="flex items-center space-x-1">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#F3E5AB]/80 font-sans font-medium line-clamp-1">
              {activeChapter.title.split('–')[0]?.trim()}
            </span>
            <span className="text-[#D4AF37] text-[10px] animate-heart-float">♥</span>
          </div>
        </div>

        {/* Action Buttons: Add Memory & Play Cinematic Reel */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            data-magnetic="true"
            data-cursor="ADD"
            onClick={onAddMemory}
            className="px-3 sm:px-4 py-1.5 rounded-full glass-gold border border-[#D4AF37]/40 text-[#F3E5AB] text-[11px] sm:text-xs font-sans font-medium tracking-wider hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 hover:text-white transition-all shadow-[0_0_12px_rgba(212,175,55,0.15)] flex items-center space-x-1.5"
          >
            <SparklesIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#D4AF37]" />
            <span>Add Memory</span>
          </button>

          <button
            data-magnetic="true"
            data-cursor="REEL"
            onClick={onPlayMovie}
            className="px-3.5 sm:px-5 py-1.5 rounded-full bg-gradient-to-r from-[#DFBE5B] to-[#D4AF37] text-black text-[11px] sm:text-xs font-sans font-semibold tracking-wider hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            Play Reel
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3D Spatial Carousel Stage */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center overflow-visible py-2 sm:py-6 px-2 sm:px-3">
        <div
          ref={cardsWrapperRef}
          className="relative w-[290px] xs:w-[330px] sm:w-[420px] md:w-[480px] lg:w-[500px] h-[400px] xs:h-[430px] sm:h-[460px] md:h-[490px] flex items-center justify-center max-w-[94vw]"
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
                className="spatial-3d-card absolute top-0 left-0 w-full h-full glass-gold rounded-3xl p-4 sm:p-5 md:p-6 border border-[#D4AF37]/35 shadow-2xl transition-shadow duration-300 flex flex-col justify-between cursor-pointer group"
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity, filter',
                  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                }}
              >
                {/* Gold Highlight top edge */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

                {/* Card Header: Year, Date, Badge & Subtle Love Icon */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                    <span className="font-cinzel text-base sm:text-xl md:text-2xl font-bold text-[#D4AF37] tracking-wider shrink-0">
                      {chapter.year}
                    </span>
                    <span className="h-3 w-[1px] bg-[#D4AF37]/40 shrink-0" />
                    <div className="flex items-center text-[9px] sm:text-[11px] text-[#F3E5AB]/70 tracking-widest uppercase font-sans truncate">
                      <CalendarIcon className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 mr-1 text-[#D4AF37] shrink-0" />
                      <span className="truncate">{chapter.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-sans font-semibold uppercase tracking-widest bg-white/5 border border-[#D4AF37]/35 text-[#F3E5AB] whitespace-nowrap">
                      {chapter.badge}
                    </span>
                    <span className="text-[#D4AF37]/70 text-[10px] hidden xs:inline animate-heart-float">♥</span>
                  </div>
                </div>

                {/* Card Media Preview (HTML5 Looping Video) */}
                <div className="relative w-full h-40 xs:h-44 sm:h-52 md:h-60 rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#D4AF37]/50 transition-colors my-1.5 sm:my-3 bg-black">
                  {chapter.videoUrl ? (
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[chapter.id] = el;
                      }}
                      src={chapter.videoUrl}
                      poster={chapter.image}
                      autoPlay
                      loop
                      muted={unmutedCardId !== chapter.id || !isCenter}
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                  {/* Play / Expand Button Node */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 sm:w-13 h-10 sm:h-13 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.6)] group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                      <PlayIcon className="w-4 sm:w-6 h-4 sm:h-6 ml-0.5" />
                    </div>
                  </div>

                  {chapter.videoUrl && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelectChapter(chapter);
                      }}
                      className="absolute inset-0 z-10 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#D4AF37]"
                      aria-label={`Open video for ${chapter.title}`}
                    />
                  )}

                  {/* Center Audio Sound Toggle (Active Card Exclusive) */}
                  {isCenter && chapter.videoUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUnmutedCardId((prev) => (prev === chapter.id ? null : chapter.id));
                      }}
                      className="absolute top-2 right-2 z-20 p-1.5 sm:p-2 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/70 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg group/btn"
                      title={unmutedCardId === chapter.id ? "Mute video audio" : "Play video audio"}
                    >
                      {unmutedCardId === chapter.id ? (
                        <Volume2Icon className="w-3.5 h-3.5 animate-pulse" />
                      ) : (
                        <VolumeXIcon className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  {/* Location Tag */}
                  <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-black/60 backdrop-blur-md text-[9px] sm:text-[10px] text-[#F3E5AB] border border-white/10 z-10 pointer-events-none max-w-[80%]">
                    <MapPinIcon className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-[#D4AF37] shrink-0" />
                    <span className="truncate">{chapter.location}</span>
                  </div>
                </div>

                {/* Card Narrative */}
                <div>
                  <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-[#F3E5AB] transition-colors leading-snug line-clamp-1">
                    {chapter.title}
                  </h3>
                  <p className="font-serif italic text-[11px] sm:text-xs text-[#D4AF37]/90 mt-0.5 line-clamp-1">
                    {chapter.subtitle}
                  </p>
                  <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-[#F3E5AB]/75 line-clamp-2 font-sans font-normal leading-relaxed">
                    {chapter.summary}
                  </p>
                </div>

                {/* Card Bottom Prompt */}
                <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-[10px] sm:text-[11px] text-[#D4AF37] font-sans">
                  <span className="uppercase tracking-widest font-semibold flex items-center space-x-1">
                    <span>Open Cinematic Story</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#F3E5AB]/50">
                    {idx + 1} / {totalChapters}
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
      <div className="relative z-20 mx-auto max-w-7xl w-full px-3 sm:px-6 flex flex-row items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap pb-2">
        
        {/* Left: Floating "Play Wedding Vows" audio player pill */}
        <div className="order-1 flex items-center">
          <button
            data-magnetic="true"
            data-cursor="VOWS"
            onClick={() => {
              const el = document.getElementById('vault');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-gold border border-[#D4AF37]/50 text-[#F3E5AB] text-[10px] sm:text-xs font-sans tracking-wide hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] group"
          >
            <div className="w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center space-x-[2px] px-0.5 text-[#D4AF37]">
              <span className="inline-block w-[1.5px] sm:w-[2px] h-2.5 sm:h-3.5 bg-[#D4AF37] rounded-full animate-pulse" />
              <span className="inline-block w-[1.5px] sm:w-[2px] h-1.5 sm:h-2 bg-[#D4AF37] rounded-full animate-ping" />
              <span className="inline-block w-[1.5px] sm:w-[2px] h-3 sm:h-4 bg-[#D4AF37] rounded-full animate-pulse" />
            </div>
            <span className="font-medium whitespace-nowrap flex items-center space-x-1">
              <span>Play Vows</span>
              <span className="text-[#D4AF37] text-[10px] hidden xs:inline animate-heart-float">♥</span>
            </span>
          </button>
        </div>

        {/* Center: Interactive Stepper & Timeline Progress Scrub */}
        <div className="order-3 sm:order-2 w-full sm:w-auto flex justify-center items-center space-x-2 sm:space-x-3 mt-1 sm:mt-0">
          <button
            onClick={() => jumpTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="p-1.5 sm:p-2 rounded-full glass-gold border border-[#D4AF37]/40 text-[#F3E5AB] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#D4AF37]/20 transition-all shadow-md"
            title="Previous Milestone"
          >
            <ChevronLeftIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>

          <div className="flex items-center space-x-1 sm:space-x-1.5 glass-gold rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 border border-[#D4AF37]/30 shadow-gold-subtle">
            {chaptersList.map((chap, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={chap.id}
                  onClick={() => jumpTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'w-5 sm:w-6 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]'
                      : 'w-2 bg-white/20 hover:bg-white/50'
                  }`}
                  title={chap.title}
                />
              );
            })}
          </div>

          <button
            onClick={() => jumpTo(activeIndex + 1)}
            disabled={activeIndex === totalChapters - 1}
            className="p-1.5 sm:p-2 rounded-full glass-gold border border-[#D4AF37]/40 text-[#F3E5AB] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#D4AF37]/20 transition-all shadow-md"
            title="Next Milestone"
          >
            <ChevronRightIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
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
          className="order-2 sm:order-3 flex glass-gold rounded-2xl p-1.5 sm:p-2.5 border border-[#D4AF37]/40 hover:border-[#D4AF37] cursor-pointer group transition-all duration-300 shadow-xl items-center space-x-2"
        >
          <div className="w-8 sm:w-12 h-8 sm:h-12 relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white/5 to-transparent">
            <canvas ref={ringCanvasRef} className="w-full h-full" />
          </div>
          <div className="text-left pr-1 sm:pr-2">
            <span className="flex items-center space-x-1 text-[10px] sm:text-xs font-serif font-bold text-white group-hover:text-[#F3E5AB] transition-colors whitespace-nowrap">
              <span>3D Vault</span>
              <span className="text-[#D4AF37] text-[10px] animate-heart-float">♥</span>
            </span>
            <span className="hidden xs:block text-[9px] sm:text-[10px] text-[#F3E5AB]/70 font-sans mt-0.5 whitespace-nowrap">
              Solitaire Ring
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
