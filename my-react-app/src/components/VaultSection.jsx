import React, { useState, useEffect, useRef } from 'react';
import { vaultArtifacts } from '../data/chapters';
import { SparklesIcon, KeyIcon, ShieldLockIcon, HeartIcon } from './Icons';

export const VaultSection = () => {
  const [selectedArtifact, setSelectedArtifact] = useState(vaultArtifacts[0]);
  const mountRef = useRef(null);
  const meshGroupRef = useRef(null);
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const [isAutoSpin, setIsAutoSpin] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !window.THREE) return;

    const THREE = window.THREE;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0xfff7e6, 1.0);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffebad, 2.8);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4af37, 1.8);
    fillLight.position.set(-6, -3, 3);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 2.0);
    backLight.position.set(0, -5, -4);
    scene.add(backLight);

    // Dynamic Artifact Group
    const group = new THREE.Group();
    meshGroupRef.current = group;
    scene.add(group);

    // Build 3D mesh according to selected artifact
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.94,
      roughness: 0.2,
      emissive: 0x3d2e08,
      emissiveIntensity: 0.25,
    });

    if (selectedArtifact.id === 'vault-ring') {
      // 1. Dual Wedding Rings
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.14, 32, 64), goldMat);
      ring1.rotation.x = Math.PI / 3;
      group.add(ring1);

      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ea, metalness: 0.92, roughness: 0.18 });
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.12, 32, 64), whiteMat);
      ring2.rotation.x = Math.PI / 2.6;
      ring2.rotation.y = 0.25;
      group.add(ring2);

      // Solitaire Diamond
      const diamondMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.05,
        roughness: 0.05,
        transmission: 0.92,
        thickness: 0.9,
        ior: 2.4,
      });
      const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 1), diamondMat);
      diamond.position.set(0, 1.35, 0.2);
      group.add(diamond);

      // Diamond Light
      const pLight = new THREE.PointLight(0xffffff, 2, 5);
      pLight.position.set(0, 1.4, 0.3);
      group.add(pLight);
    } else if (selectedArtifact.id === 'vault-key') {
      // 2. Antique Sanctuary Brass Key
      const keyHead = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.12, 24, 48), goldMat);
      keyHead.position.set(0, 1.2, 0);
      group.add(keyHead);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.2, 24), goldMat);
      shaft.position.set(0, -0.1, 0);
      group.add(shaft);

      const tooth1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.15), goldMat);
      tooth1.position.set(0.2, -0.9, 0);
      group.add(tooth1);

      const tooth2 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.15, 0.15), goldMat);
      tooth2.position.set(0.25, -1.15, 0);
      group.add(tooth2);
    } else if (selectedArtifact.id === 'vault-flutes') {
      // 3. Venetian Champagne Flute
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.95,
        thickness: 0.6,
        ior: 1.52,
      });
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.25, 2.0, 32, 1, true), glassMat);
      bowl.position.set(0, 0.6, 0);
      group.add(bowl);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.02, 16, 32), goldMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(0, 1.6, 0);
      group.add(rim);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 16), glassMat);
      stem.position.set(0, -1.0, 0);
      group.add(stem);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.06, 32), glassMat);
      base.position.set(0, -1.8, 0);
      group.add(base);
    } else {
      // 4. Archival Vow Scroll
      const scrollBody = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.4, 32, 1, false, 0, Math.PI * 1.6), goldMat);
      scrollBody.rotation.z = Math.PI / 2;
      group.add(scrollBody);

      const roller1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.0, 16), goldMat);
      roller1.rotation.z = Math.PI / 2;
      roller1.position.set(0, 0.8, 0);
      group.add(roller1);

      const roller2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.0, 16), goldMat);
      roller2.rotation.z = Math.PI / 2;
      roller2.position.set(0, -0.8, 0);
      group.add(roller2);
    }

    // Drag Rotate listeners
    const onMouseDown = (e) => {
      isDragging.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging.current || !meshGroupRef.current) return;
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      meshGroupRef.current.rotation.y += dx * 0.015;
      meshGroupRef.current.rotation.x += dy * 0.015;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Render loop
    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (meshGroupRef.current && isAutoSpin && !isDragging.current) {
        meshGroupRef.current.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [selectedArtifact, isAutoSpin]);

  return (
    <section id="vault" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full glass-gold-subtle border border-[#D4AF37]/30 text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-3">
          <ShieldLockIcon className="w-3.5 h-3.5" />
          <span>Interactive 3D Keepsake Room</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide">
          The 3D Artifact Vault
        </h2>
        <p className="mt-3 text-sm text-[#F3E5AB]/70 max-w-xl mx-auto font-sans">
          Digitized physical keepsakes from our covenant, preserved in 3D interactive clarity.
        </p>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D Canvas Viewer Box (7 columns) */}
        <div className="lg:col-span-7 glass-gold rounded-3xl p-4 sm:p-6 border border-[#D4AF37]/35 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-4 left-6 z-10 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold">
              Real-Time WebGL 3D Inspector
            </span>
          </div>

          <div className="absolute top-4 right-6 z-10">
            <button
              onClick={() => setIsAutoSpin(!isAutoSpin)}
              className="px-3 py-1 rounded-full text-xs font-semibold glass-gold border border-white/20 text-[#F3E5AB] hover:border-[#D4AF37] transition-colors"
            >
              {isAutoSpin ? 'Pause Orbit' : 'Auto Rotate'}
            </button>
          </div>

          {/* 3D Container */}
          <div 
            ref={mountRef} 
            className="w-full h-[380px] sm:h-[460px] rounded-2xl cursor-grab active:cursor-grabbing bg-radial from-[#D4AF37]/10 via-[#0D0F18]/40 to-transparent flex items-center justify-center border border-white/5"
          />

          {/* Bottom instructions */}
          <div className="mt-4 flex items-center justify-between text-xs text-[#F3E5AB]/60 px-2">
            <span>Click & Drag to rotate 360°</span>
            <span className="text-[#D4AF37]">PBR Metallic Shader</span>
          </div>
        </div>

        {/* Right: Artifact Details & Selector (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Artifact Card */}
          <div className="glass-gold rounded-3xl p-6 sm:p-7 border border-[#D4AF37]/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                {selectedArtifact.type}
              </span>
              <SparklesIcon className="w-4 h-4 text-[#D4AF37]" />
            </div>

            <h3 className="font-cinzel text-2xl font-bold text-white">
              {selectedArtifact.name}
            </h3>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB]/50 block">
                Archival Inscription
              </span>
              <p className="font-serif italic text-sm text-[#D4AF37]">
                {selectedArtifact.inscription}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB]/50 block">
                Material Composition
              </span>
              <p className="text-xs text-[#F3E5AB]/90 font-sans">
                {selectedArtifact.material}
              </p>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB]/50 block">
                Provenance & History
              </span>
              <p className="text-xs sm:text-sm text-[#F3E5AB]/75 leading-relaxed font-sans">
                {selectedArtifact.story}
              </p>
            </div>
          </div>

          {/* Artifact Selector List */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold block px-1">
              Select Keepsake to Inspect
            </span>
            <div className="grid grid-cols-2 gap-3">
              {vaultArtifacts.map((art) => {
                const isSelected = selectedArtifact.id === art.id;
                return (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArtifact(art)}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        : 'glass-gold border-white/10 hover:border-[#D4AF37]/50 text-[#F3E5AB]/75'
                    }`}
                  >
                    <span className="font-cinzel text-xs font-bold text-white">
                      {art.name}
                    </span>
                    <span className="text-[10px] text-[#D4AF37]/80 mt-1">
                      {art.type.split('/')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
