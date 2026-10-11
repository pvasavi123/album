import React, { useState, useEffect } from 'react';
import { chapters as initialChapters } from './data/chapters';
import { Navbar } from './components/Navbar';
import { Timeline3D } from './components/Timeline3D';
import { GallerySection } from './components/GallerySection';
import { VaultSection } from './components/VaultSection';
import { OurStorySection } from './components/OurStorySection';
import { AudioVowsWidget } from './components/AudioVowsWidget';
import { Vault3DWidget } from './components/Vault3DWidget';
import { CinematicModal } from './components/CinematicModal';
import { MovieMontageModal } from './components/MovieMontageModal';
import { AddMemoryModal } from './components/AddMemoryModal';
import { CursorFollower } from './components/CursorFollower';
import { SparklesIcon, HeartIcon } from './components/Icons';

export function App() {
  const [chaptersList, setChaptersList] = useState(initialChapters);
  const [activeSection, setActiveSection] = useState('timeline');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isMovieOpen, setIsMovieOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleAddChapter = (newChapter) => {
    setChaptersList((prev) => [...prev, newChapter]);
  };

  // Initialize Lenis Smooth Scroll (Huy Phan signature buttery scrolling)
  useEffect(() => {
    if (!window.Lenis || !window.gsap) return;

    const lenis = new window.Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenis.on('scroll', () => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.update();
      }
    });

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    window.gsap.ticker.add(updateLenis);
    window.gsap.ticker.lagSmoothing(0);

    return () => {
      window.gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenVault = () => {
    handleNavigate('vault');
  };

  return (
    <div className="relative min-h-screen bg-[#08090E] text-[#F3E5AB] font-sans selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Huy Phan inspired GSAP Magnetic Custom Cursor */}
      <CursorFollower />

      {/* Global Navigation Header */}
      <Navbar
        onPlayMovie={() => setIsMovieOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={() => setIsAudioPlaying(!isAudioPlaying)}
      />

      {/* Main Sections */}
      <main>
        {/* Module B: 3D Spatial Timeline with Z-axis momentum dragging */}
        <Timeline3D 
          chaptersList={chaptersList}
          onSelectChapter={(chap) => setSelectedChapter(chap)}
          onAddMemory={() => setIsAddMemoryOpen(true)}
          onPlayMovie={() => setIsMovieOpen(true)}
        />

        {/* Module: Photo & Video Gallery */}
        <GallerySection />

        {/* Module: 3D Artifact Vault */}
        <VaultSection />

        {/* Module: Our Chronicled Story & Digital Guestbook */}
        <OurStorySection />
      </main>

      {/* Module C: Interactive Keepsake Floating Widgets */}
      <AudioVowsWidget
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={(playing) => setIsAudioPlaying(playing)}
      />

      <Vault3DWidget onOpenVault={handleOpenVault} />

      {/* Dynamic Milestone Addition Modal */}
      <AddMemoryModal
        isOpen={isAddMemoryOpen}
        onClose={() => setIsAddMemoryOpen(false)}
        onAddChapter={handleAddChapter}
      />

      {/* Module D: Cinematic Media Modal */}
      {selectedChapter && (
        <CinematicModal
          chapter={selectedChapter}
          onClose={() => setSelectedChapter(null)}
        />
      )}

      {/* Fullscreen Theatrical Cinematic Movie Montage */}
      <MovieMontageModal
        isOpen={isMovieOpen}
        onClose={() => setIsMovieOpen(false)}
      />

      {/* Luxury Footer */}
      <footer className="relative border-t border-[#D4AF37]/20 py-16 px-4 text-center bg-[#08090E] z-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#D4AF37]/10">
              <SparklesIcon className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>

          <h3 className="font-cinzel text-2xl font-bold tracking-[0.25em] gold-gradient-text">
            EVERLASTING
          </h3>
          <p className="font-serif italic text-sm text-[#F3E5AB]/70 max-w-md mx-auto">
            “Grow old along with me! The best is yet to be.” — Robert Browning
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#F3E5AB]/60 uppercase tracking-widest pt-2">
            <span>Julian & Elena</span>
            <span>•</span>
            <span>Est. September 18, 2024</span>
            <span>•</span>
            <span>Private Family Archive</span>
          </div>

          <p className="text-[10px] text-white/30 pt-4 font-sans">
            Crafted with Three.js, React, and bespoke WebGL shaders. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
