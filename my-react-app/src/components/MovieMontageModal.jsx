import React, { useState, useEffect } from 'react';
import { chapters } from '../data/chapters';
import { XIcon, PlayIcon, PauseIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

export const MovieMontageModal = ({ isOpen, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const durationPerSlide = 5000; // 5 seconds per chapter

  useEffect(() => {
    if (!isOpen) {
      setCurrentIdx(0);
      setProgress(0);
      return;
    }

    if (!isPlaying) return;

    const intervalTime = 50;
    const step = (intervalTime / durationPerSlide) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIdx < chapters.length - 1) {
            setCurrentIdx((c) => c + 1);
            return 0;
          } else {
            // End of movie: launch golden stardust celebration!
            if (window.confetti) {
              window.confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#D4AF37', '#FFF6D6', '#E5CD7C', '#FFFFFF'],
              });
            }
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentIdx]);

  if (!isOpen) return null;

  const currentChapter = chapters[currentIdx];

  const handleNext = () => {
    if (currentIdx < chapters.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl select-none animate-fadeIn">
      {/* Cinematic Film Grain & Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/60 to-black pointer-events-none z-10" />

      {/* Top Controls Overlay */}
      <div className="absolute top-6 left-8 right-8 z-30 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <span className="font-cinzel text-lg tracking-[0.3em] font-bold gold-gradient-text">
            EVERLASTING
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]/80 px-2 py-0.5 rounded-full border border-[#D4AF37]/30 bg-black/40">
            Cinematic Montage • {currentIdx + 1} of {chapters.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-white/20 hover:border-[#D4AF37] flex items-center justify-center text-[#F3E5AB] hover:text-white bg-black/50 hover:bg-white/10 transition-colors"
          title="Exit Theater"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 21:9 Widescreen Theater Frame */}
      <div className="relative w-full max-w-6xl aspect-[21/9] sm:aspect-[16/9] max-h-[80vh] overflow-hidden rounded-3xl border border-[#D4AF37]/35 shadow-[0_0_80px_rgba(212,175,55,0.25)] flex items-center justify-center bg-black">
        {/* Animated Background Media with Slow Cinematic Pan */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            key={currentChapter.id}
            src={currentChapter.image}
            alt={currentChapter.title}
            className="w-full h-full object-cover animate-pulse-subtle scale-105 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
        </div>

        {/* Cinematic Subtitles & Title Cards */}
        <div className="relative z-20 text-center max-w-3xl px-6 py-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-semibold text-[#FFF6D6] tracking-widest uppercase mb-4 animate-fadeIn">
            <SparklesIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{currentChapter.year} • {currentChapter.location}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-wider drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] animate-fadeIn">
            {currentChapter.title}
          </h2>

          <p className="font-serif italic text-sm sm:text-lg text-[#F3E5AB] mt-3 max-w-2xl mx-auto drop-shadow-md animate-fadeIn">
            {currentChapter.quote}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-[#F3E5AB]/75 font-sans max-w-xl mx-auto leading-relaxed hidden sm:block animate-fadeIn">
            {currentChapter.summary}
          </p>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="absolute left-6 z-30 p-3 rounded-full bg-black/60 border border-white/20 text-[#F3E5AB] hover:text-white hover:border-[#D4AF37] disabled:opacity-20 disabled:pointer-events-none transition-all"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIdx === chapters.length - 1}
          className="absolute right-6 z-30 p-3 rounded-full bg-black/60 border border-white/20 text-[#F3E5AB] hover:text-white hover:border-[#D4AF37] disabled:opacity-20 disabled:pointer-events-none transition-all"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Timeline Progress Bar & Playback Controls */}
      <div className="absolute bottom-6 left-8 right-8 z-30 max-w-4xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="flex items-center space-x-2 mb-3">
          {chapters.map((_, i) => {
            let width = '0%';
            if (i < currentIdx) width = '100%';
            else if (i === currentIdx) width = `${progress}%`;

            return (
              <div key={i} className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  style={{ width }}
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFF6D6] transition-all duration-75"
                />
              </div>
            );
          })}
        </div>

        {/* Media Controls Bar */}
        <div className="flex items-center justify-between text-xs text-[#F3E5AB]/80">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full glass-gold border border-[#D4AF37]/40 text-[#F3E5AB] hover:text-white"
            >
              {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            </button>
            <span className="font-cinzel text-xs text-[#D4AF37]">
              {chapters[currentIdx].title}
            </span>
          </div>

          <div className="text-[11px] uppercase tracking-widest text-[#F3E5AB]/60">
            Preserved for Eternity • Julian & Elena
          </div>
        </div>
      </div>
    </div>
  );
};
