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

    // Warm Studio Spotlight & Lighting Setup
    const ambLight = new THREE.AmbientLight(0xfff7e6, 1.2);
    scene.add(ambLight);

    const spotLight = new THREE.SpotLight(0xfffaed, 3.2);
    spotLight.position.set(2, 6, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    scene.add(spotLight);

    const fillLight = new THREE.DirectionalLight(0xd4af37, 1.6);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffe8b5, 1.8);
    backLight.position.set(0, -4, -3);
    scene.add(backLight);

    // Soft Contact Shadow Underneath
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d');
    const shadowGrad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.65)');
    shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.25)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.fillStyle = shadowGrad;
    sctx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.85;
    scene.add(shadowMesh);

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
      // =========================================================
      // 4. Antique Archival Vow Parchment Scroll (Detailed Mesh & PBR)
      // =========================================================
      // Generate realistic vintage calligraphy texture via procedural HTML5 Canvas
      const parchmentCanvas = document.createElement('canvas');
      parchmentCanvas.width = 1024;
      parchmentCanvas.height = 1024;
      const pctx = parchmentCanvas.getContext('2d');

      // 1. Aged Parchment Gradient Background
      const bgGrad = pctx.createLinearGradient(0, 0, 1024, 1024);
      bgGrad.addColorStop(0, '#f9ecd1');
      bgGrad.addColorStop(0.3, '#ebd4a8');
      bgGrad.addColorStop(0.7, '#deb887');
      bgGrad.addColorStop(1, '#caa067');
      pctx.fillStyle = bgGrad;
      pctx.fillRect(0, 0, 1024, 1024);

      // Aged vintage stains & fiber noise
      for (let i = 0; i < 1800; i++) {
        pctx.fillStyle = `rgba(${120 + Math.random() * 60}, ${80 + Math.random() * 40}, 20, ${0.03 + Math.random() * 0.05})`;
        pctx.beginPath();
        pctx.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 30 + 5, 0, Math.PI * 2);
        pctx.fill();
      }

      // Burned / aged vintage borders
      const borderGradX = pctx.createLinearGradient(0, 0, 1024, 0);
      borderGradX.addColorStop(0, 'rgba(68, 42, 14, 0.7)');
      borderGradX.addColorStop(0.08, 'rgba(68, 42, 14, 0.15)');
      borderGradX.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
      borderGradX.addColorStop(0.92, 'rgba(68, 42, 14, 0.15)');
      borderGradX.addColorStop(1, 'rgba(68, 42, 14, 0.7)');
      pctx.fillStyle = borderGradX;
      pctx.fillRect(0, 0, 1024, 1024);

      // Ornate Gold Double Filigree Border
      pctx.strokeStyle = '#b8860b';
      pctx.lineWidth = 6;
      pctx.strokeRect(60, 60, 904, 904);
      pctx.strokeStyle = '#d4af37';
      pctx.lineWidth = 2;
      pctx.strokeRect(75, 75, 874, 874);

      // Antique Telugu / English Vow Calligraphy Text
      pctx.textAlign = 'center';
      pctx.fillStyle = '#6b4423'; // Rich Sepia Ink
      pctx.font = 'bold 36px "Cinzel", "Playfair Display", serif';
      pctx.fillText('SACRED WEDDING COVENANT', 512, 160);

      pctx.strokeStyle = '#d4af37';
      pctx.lineWidth = 2;
      pctx.beginPath();
      pctx.moveTo(300, 190);
      pctx.lineTo(724, 190);
      pctx.stroke();

      pctx.fillStyle = '#8a5a2b';
      pctx.font = 'italic 25px "Playfair Display", serif';
      pctx.fillText('Rahul & Sneha • Est. September 18, 2024', 512, 240);

      // Handwritten cursive vows in Sepia with gold reflections
      pctx.fillStyle = '#4a3018';
      pctx.font = '22px "Playfair Display", serif';
      const vowLines = [
        '“In the presence of our beloved families and holy agni,”',
        '“We weave our hearts together for all seven lifetimes.”',
        '',
        '“Sannayi melam, jeelakarra bellam kshanam lo,”',
        '“Mana kalalu, mana aashalu okatiga kalisipoyayi.”',
        '',
        '“I promise to stand with you through every rain and sunrise,”',
        '“Laughing at our silly jokes and building our forever home.”',
        '',
        '“From the first chai cup to our everyday laughter,”',
        '“You are my today, my tomorrow, and my eternity.”'
      ];
      vowLines.forEach((line, idx) => {
        pctx.fillText(line, 512, 320 + idx * 42);
      });

      // Signature & Wax Seal impression at bottom
      pctx.fillStyle = '#8b2500';
      pctx.beginPath();
      pctx.arc(512, 850, 48, 0, Math.PI * 2);
      pctx.fill();
      pctx.strokeStyle = '#ffd700';
      pctx.lineWidth = 3;
      pctx.stroke();
      pctx.fillStyle = '#ffd700';
      pctx.font = 'bold 20px "Cinzel", serif';
      pctx.fillText('FOREVER', 512, 858);

      const parchmentTex = new THREE.CanvasTexture(parchmentCanvas);
      parchmentTex.anisotropy = 8;

      // PBR Materials for Antique Scroll
      const parchmentMat = new THREE.MeshStandardMaterial({
        map: parchmentTex,
        roughness: 0.85,
        metalness: 0.05,
        bumpScale: 0.02,
        side: THREE.DoubleSide,
      });

      const goldRodMat = new THREE.MeshStandardMaterial({
        color: 0xdfbe5b,
        metalness: 0.85,
        roughness: 0.28,
        emissive: 0x2d1f05,
        emissiveIntensity: 0.15,
      });

      const darkWoodMat = new THREE.MeshStandardMaterial({
        color: 0x3d2110,
        metalness: 0.15,
        roughness: 0.6,
      });

      const scrollGroup = new THREE.Group();

      // Middle Unrolled Sheet (curved slightly for realism)
      const sheetGeo = new THREE.PlaneGeometry(2.3, 2.7, 32, 32);
      const posAttr = sheetGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const y = posAttr.getY(i);
        // Soft parabolic curve outward
        const zCurve = Math.cos((y / 1.35) * Math.PI * 0.5) * 0.15;
        posAttr.setZ(i, zCurve);
      }
      sheetGeo.computeVertexNormals();

      const parchmentSheet = new THREE.Mesh(sheetGeo, parchmentMat);
      scrollGroup.add(parchmentSheet);

      // Top Rolled Paper Cylinder
      const topRollPaper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 2.4, 32),
        parchmentMat
      );
      topRollPaper.rotation.z = Math.PI / 2;
      topRollPaper.position.set(0, 1.4, 0.08);
      scrollGroup.add(topRollPaper);

      // Bottom Rolled Paper Cylinder
      const bottomRollPaper = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 2.4, 32),
        parchmentMat
      );
      bottomRollPaper.rotation.z = Math.PI / 2;
      bottomRollPaper.position.set(0, -1.4, 0.08);
      scrollGroup.add(bottomRollPaper);

      // Top Rod Spindle (Wooden & Gold Spindle running through scroll)
      const topSpindle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2.9, 24),
        darkWoodMat
      );
      topSpindle.rotation.z = Math.PI / 2;
      topSpindle.position.set(0, 1.4, 0.08);
      scrollGroup.add(topSpindle);

      // Bottom Rod Spindle
      const bottomSpindle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2.9, 24),
        darkWoodMat
      );
      bottomSpindle.rotation.z = Math.PI / 2;
      bottomSpindle.position.set(0, -1.4, 0.08);
      scrollGroup.add(bottomSpindle);

      // 4 Ornate Gold Finial Knobs on Rod Ends
      const finialPositions = [
        [1.48, 1.4, 0.08],
        [-1.48, 1.4, 0.08],
        [1.48, -1.4, 0.08],
        [-1.48, -1.4, 0.08],
      ];
      finialPositions.forEach(([x, y, z]) => {
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 20), goldRodMat);
        knob.position.set(x, y, z);
        scrollGroup.add(knob);

        const ringTip = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 12, 24), goldRodMat);
        ringTip.position.set(x > 0 ? x + 0.08 : x - 0.08, y, z);
        ringTip.rotation.y = Math.PI / 2;
        scrollGroup.add(ringTip);
      });

      // Ribbon tie dangling softly at center
      const ribbon = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.02, 12, 32, Math.PI * 1.4),
        goldRodMat
      );
      ribbon.rotation.x = Math.PI / 2;
      ribbon.position.set(0, -1.45, 0.22);
      scrollGroup.add(ribbon);

      scrollGroup.rotation.y = 0.15;
      group.add(scrollGroup);
    }

    // Drag Rotate listeners (Mouse & Touch for full mobile responsiveness)
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

    const onTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      isDragging.current = true;
      prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchMove = (e) => {
      if (!isDragging.current || !meshGroupRef.current || !e.touches || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - prevMousePos.current.x;
      const dy = e.touches[0].clientY - prevMousePos.current.y;
      meshGroupRef.current.rotation.y += dx * 0.015;
      meshGroupRef.current.rotation.x += dy * 0.015;
      prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Render loop with smooth floating idle animation
    let reqId;
    let clock = new THREE.Clock();
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (meshGroupRef.current) {
        if (isAutoSpin && !isDragging.current) {
          meshGroupRef.current.rotation.y += 0.007;
        }
        // Subtle floating idle bobbing
        meshGroupRef.current.position.y = Math.sin(elapsed * 1.5) * 0.08;
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
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
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
