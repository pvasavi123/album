import React, { useState, useEffect, useRef } from 'react';
import { vaultArtifacts } from '../data/chapters';
import { SparklesIcon, KeyIcon, ShieldLockIcon, HeartIcon } from './Icons';

export const VaultSection = () => {
  const [selectedArtifact, setSelectedArtifact] = useState(vaultArtifacts[0]);
  const [viewMode, setViewMode] = useState('3d');
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

    // Dark Velvet & Gold-Rimmed Pedestal Base
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.y = -1.75;
    scene.add(pedestalGroup);

    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c16,
      roughness: 0.9,
      metalness: 0.1,
    });
    const goldRimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.92,
      emissive: 0x3d2e08,
      emissiveIntensity: 0.3,
    });

    const pedestalBase = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.5, 0.22, 48), velvetMat);
    pedestalGroup.add(pedestalBase);

    const pedestalRim = new THREE.Mesh(new THREE.TorusGeometry(2.32, 0.04, 16, 48), goldRimMat);
    pedestalRim.rotation.x = Math.PI / 2;
    pedestalRim.position.y = 0.11;
    pedestalGroup.add(pedestalRim);

    // 3D Ambient Gold Dust / Bokeh Particles in Space
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 7;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf3e5ab,
      size: 0.065,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Dynamic Artifact Group
    const group = new THREE.Group();
    meshGroupRef.current = group;
    scene.add(group);

    // =========================================================
    // 1. "Maa Kalyanam Rings" / The Eternal Bands (Wedding Rings)
    // =========================================================
    if (selectedArtifact.id === 'vault-ring') {
      const champagneGoldMat = new THREE.MeshStandardMaterial({
        color: 0xdfbe5b,
        metalness: 0.95,
        roughness: 0.15,
        emissive: 0x2e2105,
        emissiveIntensity: 0.2,
      });

      const platinumMat = new THREE.MeshStandardMaterial({
        color: 0xf7f8fc,
        metalness: 0.96,
        roughness: 0.12,
      });

      // 18k Brushed Champagne Gold Band with inner engraving feel
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.15, 32, 64), champagneGoldMat);
      ring1.rotation.x = Math.PI / 3;
      ring1.rotation.y = 0.15;
      group.add(ring1);

      // Interlocking Polished Platinum Band
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.20, 0.13, 32, 64), platinumMat);
      ring2.rotation.x = Math.PI / 2.5;
      ring2.rotation.y = -0.3;
      group.add(ring2);

      // Brilliant-cut Solitaire Diamond with dispersion & transmission
      const diamondMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.05,
        roughness: 0.04,
        transmission: 0.96,
        thickness: 1.1,
        ior: 2.42,
        transparent: true,
        opacity: 0.98,
      });
      const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 2), diamondMat);
      diamond.position.set(0, 1.4, 0.22);
      group.add(diamond);

      // Four delicate gold/platinum prongs holding the solitaire
      const prongGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.38, 8);
      for (let i = 0; i < 4; i++) {
        const prong = new THREE.Mesh(prongGeo, platinumMat);
        const ang = (i * Math.PI) / 2 + Math.PI / 4;
        prong.position.set(Math.cos(ang) * 0.22, 1.3, Math.sin(ang) * 0.22 + 0.22);
        prong.rotation.z = Math.cos(ang) * 0.12;
        group.add(prong);
      }

      // Diamond Refraction Glow
      const diamondGlow = new THREE.PointLight(0xfff8e7, 2.5, 4);
      diamondGlow.position.set(0, 1.45, 0.35);
      group.add(diamondGlow);

    // =========================================================
    // 2. "Inti Key" / The Sanctuary Key (Our First Home Key)
    // =========================================================
    } else if (selectedArtifact.id === 'vault-key') {
      const agedBrassMat = new THREE.MeshStandardMaterial({
        color: 0xb58e38,
        metalness: 0.88,
        roughness: 0.38,
        emissive: 0x1f1604,
        emissiveIntensity: 0.15,
      });

      const antiqueDarkMat = new THREE.MeshStandardMaterial({
        color: 0x6e521c,
        metalness: 0.82,
        roughness: 0.55,
      });

      const maroonSilkMat = new THREE.MeshStandardMaterial({
        color: 0x7a0c1e, // Auspicious Gruhapravesam Maroon
        roughness: 0.75,
        metalness: 0.1,
      });

      const keyGroup = new THREE.Group();

      // Ornamental Skeleton Key Bow (Head)
      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.11, 24, 48), agedBrassMat);
      outerRing.position.set(0, 1.3, 0);
      keyGroup.add(outerRing);

      // Inner Filigree Heart / Clover Motif in Bow
      for (let i = 0; i < 4; i++) {
        const leaf = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 16, 24), agedBrassMat);
        const ang = (i * Math.PI) / 2;
        leaf.position.set(Math.cos(ang) * 0.25, 1.3 + Math.sin(ang) * 0.25, 0);
        keyGroup.add(leaf);
      }
      const centerPin = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), agedBrassMat);
      centerPin.position.set(0, 1.3, 0);
      keyGroup.add(centerPin);

      // Fluted Cylindrical Key Shaft with Collar Rings
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.095, 2.4, 24), agedBrassMat);
      shaft.position.set(0, -0.1, 0);
      keyGroup.add(shaft);

      const collar1 = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 16, 24), agedBrassMat);
      collar1.position.set(0, 0.65, 0);
      collar1.rotation.x = Math.PI / 2;
      keyGroup.add(collar1);

      const collar2 = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.035, 16, 24), agedBrassMat);
      collar2.position.set(0, -0.6, 0);
      collar2.rotation.x = Math.PI / 2;
      keyGroup.add(collar2);

      // Intricate Antique Key Bit (Teeth) with Grooves
      const bitBase = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.75, 0.12), agedBrassMat);
      bitBase.position.set(0.32, -1.05, 0);
      keyGroup.add(bitBase);

      const groove1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.14, 0.14), antiqueDarkMat);
      groove1.position.set(0.48, -0.9, 0);
      keyGroup.add(groove1);

      const groove2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.14), antiqueDarkMat);
      groove2.position.set(0.44, -1.22, 0);
      keyGroup.add(groove2);

      // Auspicious Maroon Braided Silk Thread & Tassel hanging from Bow
      const threadTorus = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 12, 24), maroonSilkMat);
      threadTorus.position.set(0, 2.05, 0);
      keyGroup.add(threadTorus);

      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 12), maroonSilkMat);
      cord.position.set(-0.25, 2.4, 0);
      cord.rotation.z = 0.45;
      keyGroup.add(cord);

      const tassel = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.55, 16), maroonSilkMat);
      tassel.position.set(-0.55, 2.8, 0);
      tassel.rotation.z = Math.PI + 0.35;
      keyGroup.add(tassel);

      keyGroup.rotation.z = 0.18;
      group.add(keyGroup);

    // =========================================================
    // 3. "Toast Flutes" / Maa Glassware (Celebration Flutes)
    // =========================================================
    } else if (selectedArtifact.id === 'vault-flutes') {
      const flutesGroup = new THREE.Group();

      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.05,
        roughness: 0.04,
        transmission: 0.98,
        thickness: 0.75,
        ior: 1.52,
        transparent: true,
        opacity: 0.95,
      });

      const goldFoilMat = new THREE.MeshStandardMaterial({
        color: 0xe5cd7c,
        metalness: 0.95,
        roughness: 0.18,
        emissive: 0x3d2e08,
        emissiveIntensity: 0.25,
      });

      const champagneLiquidMat = new THREE.MeshPhysicalMaterial({
        color: 0xfde08b,
        metalness: 0.1,
        roughness: 0.12,
        transmission: 0.88,
        ior: 1.34,
        transparent: true,
        opacity: 0.85,
      });

      const createFlute = (offsetX, rotZ) => {
        const flute = new THREE.Group();

        // Slender crystal bowl
        const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.22, 2.1, 32, 1, true), crystalMat);
        bowl.position.set(0, 0.75, 0);
        flute.add(bowl);

        // 24K Gold Foil Top Rim
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.025, 16, 32), goldFoilMat);
        rim.rotation.x = Math.PI / 2;
        rim.position.set(0, 1.8, 0);
        flute.add(rim);

        // Effervescent Champagne Liquid inside
        const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.2, 1.3, 24), champagneLiquidMat);
        liquid.position.set(0, 0.45, 0);
        flute.add(liquid);

        // Slender elongated stem
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.8, 16), crystalMat);
        stem.position.set(0, -1.05, 0);
        flute.add(stem);

        // Gold collar on stem joint
        const stemJoint = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 12, 24), goldFoilMat);
        stemJoint.rotation.x = Math.PI / 2;
        stemJoint.position.set(0, -0.15, 0);
        flute.add(stemJoint);

        // Crystal flat circular foot
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.06, 32), crystalMat);
        foot.position.set(0, -1.95, 0);
        flute.add(foot);

        flute.position.x = offsetX;
        flute.rotation.z = rotZ;
        return flute;
      };

      flutesGroup.add(createFlute(-0.65, 0.08));
      flutesGroup.add(createFlute(0.65, -0.08));

      // Golden toast spark light
      const toastLight = new THREE.PointLight(0xffe89e, 2.0, 5);
      toastLight.position.set(0, 0.6, 0.3);
      flutesGroup.add(toastLight);

      group.add(flutesGroup);

    // =========================================================
    // 4. "Our Lagnapatrika" / The Vow Parchment (Vows & Promises Scroll)
    // =========================================================
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

      // Top Traditional 3D Embossed Golden Telugu 'శ్రీరస్తు'
      pctx.textAlign = 'center';
      pctx.fillStyle = '#b8860b';
      pctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      pctx.shadowBlur = 8;
      pctx.shadowOffsetX = 3;
      pctx.shadowOffsetY = 4;
      pctx.font = 'bold 74px "Cinzel", "Playfair Display", serif';
      pctx.fillText('శ్రీరస్తు', 512, 170);

      // Reset shadow for cursive vows
      pctx.shadowColor = 'transparent';
      pctx.shadowBlur = 0;
      pctx.shadowOffsetX = 0;
      pctx.shadowOffsetY = 0;

      // Heartfelt Tenglish Calligraphy Vows from the image
      pctx.fillStyle = '#5c3818'; // Deep warm chestnut ink
      pctx.font = 'italic 34px "Playfair Display", Georgia, serif';
      pctx.fillText('Nee chethilo cheyyi vesi...', 512, 290);

      pctx.font = 'italic 32px "Playfair Display", Georgia, serif';
      pctx.fillText('i will walk this life with you', 512, 360);

      pctx.font = 'italic 35px "Playfair Display", Georgia, serif';
      pctx.fillText('Mee blessing tho, together forever.', 512, 440);

      // Fine archival subtitle script
      pctx.fillStyle = '#8a5a2b';
      pctx.font = 'italic 18px "Playfair Display", serif';
      pctx.fillText('Rahul & Sneha • Kalyanam 24.11.2024 • Sacred Covenant', 512, 530);
      pctx.fillText('Traditional vows preserved for eternity in our interactive memory vault.', 512, 565);

      // Bottom Traditional 3D Embossed Golden Telugu 'శ్రీరస్తు'
      pctx.fillStyle = '#b8860b';
      pctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      pctx.shadowBlur = 8;
      pctx.shadowOffsetX = 3;
      pctx.shadowOffsetY = 4;
      pctx.font = 'bold 70px "Cinzel", "Playfair Display", serif';
      pctx.fillText('శ్రీరస్తు', 512, 720);

      pctx.shadowColor = 'transparent';

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

          <div className="absolute top-4 right-6 z-10 flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === '3d' ? 'render' : '3d')}
              className="px-3 py-1 rounded-full text-xs font-semibold glass-gold border border-[#D4AF37]/50 text-[#F3E5AB] hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all shadow-md flex items-center space-x-1"
            >
              <span>{viewMode === '3d' ? '📷 View Studio Render' : '🔄 3D Interactive'}</span>
            </button>
            <button
              onClick={() => setIsAutoSpin(!isAutoSpin)}
              className={`px-3 py-1 rounded-full text-xs font-semibold glass-gold border transition-colors ${
                viewMode === '3d' ? 'border-white/20 text-[#F3E5AB] hover:border-[#D4AF37]' : 'hidden'
              }`}
            >
              {isAutoSpin ? 'Pause Orbit' : 'Auto Rotate'}
            </button>
          </div>

          {/* 3D / Render Presentation Container */}
          <div className="relative w-full h-[380px] sm:h-[460px] rounded-2xl overflow-hidden bg-radial from-[#D4AF37]/10 via-[#0D0F18]/40 to-transparent border border-white/5 flex items-center justify-center">
            {/* 3D Interactive WebGL Canvas */}
            <div 
              ref={mountRef} 
              className={`w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center transition-opacity duration-500 ${
                viewMode === '3d' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none absolute inset-0'
              }`}
            />

            {/* Studio High-Definition Render View */}
            {viewMode === 'render' && selectedArtifact.image && (
              <div className="absolute inset-0 z-10 flex items-center justify-center p-3 animate-fadeIn">
                <img
                  src={selectedArtifact.image}
                  alt={selectedArtifact.name}
                  className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] rounded-xl transition-all duration-700 hover:scale-105"
                />
              </div>
            )}
          </div>

          {/* Bottom instructions */}
          <div className="mt-4 flex items-center justify-between text-xs text-[#F3E5AB]/60 px-2">
            <span>
              {viewMode === '3d' ? 'Click & Drag to rotate 360° in WebGL' : 'High-Resolution PBR Studio Render'}
            </span>
            <span className="text-[#D4AF37]">
              {selectedArtifact.material.split('&')[0]}
            </span>
          </div>
        </div>

        {/* Right: Artifact Details & Selector with Curved 3D Card Flow (5 columns) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Artifact Card */}
          <div className="glass-gold rounded-3xl p-5 sm:p-7 border border-[#D4AF37]/35 shadow-2xl space-y-3.5 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
                  {selectedArtifact.type}
                </span>
                <span className="text-xs text-[#F3E5AB]/60 font-serif italic">
                  {selectedArtifact.subtitle}
                </span>
              </div>
              <SparklesIcon className="w-4 h-4 text-[#D4AF37]" />
            </div>

            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
              {selectedArtifact.name}
            </h3>

            {/* Auspicious Inscription Box */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB]/50 block">
                Archival Inscription
              </span>
              <p className="font-serif italic text-sm text-[#D4AF37] leading-relaxed">
                {selectedArtifact.inscription}
              </p>
            </div>

            {/* Tenglish Heartfelt Story */}
            {selectedArtifact.teluguStory && (
              <div className="p-3 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                  Mana Memory (Telugu)
                </span>
                <p className="font-sans italic text-xs text-[#F3E5AB]/90 leading-relaxed">
                  “{selectedArtifact.teluguStory}”
                </p>
              </div>
            )}

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
                Provenance & Story
              </span>
              <p className="text-xs sm:text-sm text-[#F3E5AB]/75 leading-relaxed font-sans">
                {selectedArtifact.story}
              </p>
            </div>
          </div>

          {/* Interactive Artifact Selector with Curved Drag & Touch Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                Tap to Inspect Keepsake
              </span>
              <span className="text-[10px] text-[#F3E5AB]/50 font-sans">
                {vaultArtifacts.findIndex(a => a.id === selectedArtifact.id) + 1} of {vaultArtifacts.length}
              </span>
            </div>

            {/* Horizontal Curved Interactive Card Carousel */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {vaultArtifacts.map((art) => {
                const isSelected = selectedArtifact.id === art.id;
                return (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArtifact(art)}
                    className={`p-3 sm:p-3.5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#D4AF37]/25 border-[#D4AF37] shadow-[0_0_22px_rgba(212,175,55,0.4)] scale-[1.03] ring-1 ring-[#D4AF37]/50'
                        : 'glass-gold border-white/10 hover:border-[#D4AF37]/50 text-[#F3E5AB]/75 hover:scale-[1.01]'
                    }`}
                  >
                    <div>
                      <span className={`block font-cinzel text-xs sm:text-sm font-bold transition-colors ${isSelected ? 'text-[#FFF6D6]' : 'text-white group-hover:text-[#F3E5AB]'}`}>
                        {art.name}
                      </span>
                      <span className="block text-[10px] text-[#D4AF37]/90 font-serif italic mt-0.5 truncate">
                        {art.subtitle}
                      </span>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] text-[#F3E5AB]/60">
                      <span className="uppercase tracking-widest">3D PBR</span>
                      <span className={isSelected ? 'text-[#D4AF37] font-bold' : ''}>
                        {isSelected ? '● Active' : 'Inspect →'}
                      </span>
                    </div>
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
