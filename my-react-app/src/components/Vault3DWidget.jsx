import React, { useEffect, useRef, useState } from 'react';
import { SparklesIcon, MaximizeIcon } from './Icons';

export const Vault3DWidget = ({ onOpenVault }) => {
  const mountRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const ringGroupRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !window.THREE) return;

    const THREE = window.THREE;
    const width = 160;
    const height = 160;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff7e6, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe6a3, 3.0);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    // Ring Group
    const ringGroup = new THREE.Group();
    ringGroupRef.current = ringGroup;
    scene.add(ringGroup);

    // 1. Dual Intertwined Gold Bands
    const bandGeo = new THREE.TorusGeometry(1.2, 0.15, 32, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.18,
      emissive: 0x3d2e08,
      emissiveIntensity: 0.2,
    });
    const ring1 = new THREE.Mesh(bandGeo, goldMat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const innerBandGeo = new THREE.TorusGeometry(1.18, 0.13, 32, 64);
    const whiteGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ea,
      metalness: 0.92,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(innerBandGeo, whiteGoldMat);
    ring2.rotation.x = Math.PI / 2.6;
    ring2.rotation.y = 0.2;
    ringGroup.add(ring2);

    // 2. Diamond Gemstone atop the band
    const diamondGeo = new THREE.OctahedronGeometry(0.35, 1);
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.8,
      ior: 2.4, // Diamond IOR
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    diamond.position.set(0, 1.35, 0.2);
    diamond.scale.set(1, 1.3, 1);
    ringGroup.add(diamond);

    // Diamond Prongs
    for (let i = 0; i < 4; i++) {
      const prongGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.28, 8);
      const prong = new THREE.Mesh(prongGeo, goldMat);
      const angle = (i * Math.PI) / 2;
      prong.position.set(Math.cos(angle) * 0.25, 1.25, 0.2 + Math.sin(angle) * 0.25);
      ringGroup.add(prong);
    }

    // Sparkle Point Light inside diamond
    const diamondLight = new THREE.PointLight(0xffffff, 2.5, 4);
    diamondLight.position.set(0, 1.4, 0.3);
    ringGroup.add(diamondLight);

    // Interactive Drag to Rotate controls
    const onMouseDown = (e) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging.current || !ringGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      ringGroupRef.current.rotation.y += deltaX * 0.02;
      ringGroupRef.current.rotation.x += deltaY * 0.02;

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging.current || !ringGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;
      ringGroupRef.current.rotation.y += deltaX * 0.02;
      ringGroupRef.current.rotation.x += deltaY * 0.02;
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging.current = false;
    };
    domElement.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // Render loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (ringGroupRef.current && !isDragging.current) {
        ringGroupRef.current.rotation.y += 0.012;
        ringGroupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.15;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div 
      className="fixed bottom-6 right-6 z-40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="glass-gold rounded-3xl p-3 border border-[#D4AF37]/30 shadow-2xl backdrop-blur-xl relative group transition-all duration-300 hover:border-[#D4AF37] max-w-[220px]">
        {/* Shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-75" />

        {/* Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-1">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
            <SparklesIcon className="w-3 h-3 text-[#D4AF37]" />
            <span>3D Vault Keepsake</span>
          </div>
          <button 
            onClick={onOpenVault}
            className="text-[#F3E5AB]/60 hover:text-[#FFF] p-0.5 rounded transition-colors"
            title="Expand 3D Vault"
          >
            <MaximizeIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3D Canvas Box */}
        <div className="relative w-[160px] h-[140px] mx-auto rounded-2xl overflow-hidden bg-radial from-[#D4AF37]/10 to-transparent flex items-center justify-center cursor-grab active:cursor-grabbing border border-white/5">
          <div ref={mountRef} className="w-full h-full" />
          <div className="absolute bottom-1 text-[8px] tracking-wider uppercase text-[#F3E5AB]/50 pointer-events-none select-none bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
            Drag to Rotate 360°
          </div>
        </div>

        {/* Label & Vault CTA */}
        <div className="px-2 pt-2 text-center">
          <h4 className="font-cinzel text-xs font-bold text-white tracking-wider">
            The Eternal Rings
          </h4>
          <p className="text-[9px] text-[#F3E5AB]/65 mt-0.5 font-sans">
            18K Champagne Gold & Solitaire
          </p>
          <button
            onClick={onOpenVault}
            className="mt-2 w-full py-1.5 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#F3E5AB] hover:text-black text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 border border-[#D4AF37]/40 shadow-sm"
          >
            Explore 3D Vault
          </button>
        </div>
      </div>
    </div>
  );
};
