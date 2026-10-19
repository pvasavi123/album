import React, { useState, useEffect, useRef } from 'react';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon, MapPinIcon, CalendarIcon, SparklesIcon, MaximizeIcon } from './Icons';

export const CinematicModal = ({ chapter, onClose, onSelectNext, onSelectPrev }) => {
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showDrawer, setShowDrawer] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef(null);

  if (!chapter) return null;

  const mediaList = chapter.media || [];
  const currentMedia = mediaList[activeMediaIdx] || { url: chapter.image, caption: chapter.subtitle };

  // Auto-slide transition
  useEffect(() => {
    if (!isAutoPlaying || mediaList.length <= 1) return;
    const timer = setInterval(() => {
      setActiveMediaIdx((prev) => (prev + 1) % mediaList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, mediaList.length]);

  const handleNext = () => {
    setActiveMediaIdx((prev) => (prev + 1) % mediaList.length);
  };

  const handlePrev = () => {
    setActiveMediaIdx((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mediaList.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      {/* Background cinematic vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/80 to-black pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-6xl rounded-3xl overflow-hidden glass-gold border border-[#D4AF37]/40 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/25 bg-[#08090E]/80 backdrop-blur-md z-20">
          <div className="flex items-center space-x-3">
            <span className="font-cinzel text-xl font-bold text-[#D4AF37]">
              {chapter.year}
            </span>
            <span className="h-4 w-[1px] bg-[#D4AF37]/40" />
            <h3 className="font-serif text-lg font-bold text-white">
              {chapter.title}
            </h3>
          </div>

          <div className="flex items-center space-x-3">
            {/* Auto-play toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider flex items-center space-x-1.5 border border-[#D4AF37]/30 text-[#F3E5AB] hover:bg-[#D4AF37]/20 transition-colors"
            >
              {isAutoPlaying ? <PauseIcon className="w-3.5 h-3.5" /> : <PlayIcon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAutoPlaying ? 'Pause Slide' : 'Auto Play'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/20 hover:border-[#D4AF37] flex items-center justify-center text-[#F3E5AB] hover:text-white hover:bg-white/10 transition-colors"
              title="Close modal"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 16:9 Letterbox Presentation Screen */}
        <div className="relative w-full aspect-[16/9] sm:max-h-[58vh] bg-black overflow-hidden flex items-center justify-center select-none group">
          {/* Top & Bottom Cinematic Black Letterbox Bars */}
          <div className="absolute top-0 left-0 right-0 h-4 sm:h-7 bg-black z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-4 sm:h-7 bg-black z-10 pointer-events-none" />

          {/* Active Media Video or Image with Crossfade */}
          {currentMedia.type === 'video' || (currentMedia.url && currentMedia.url.endsWith('.mp4')) ? (
            <video
              ref={videoRef}
              key={currentMedia.url}
              src={currentMedia.url}
              autoPlay
              loop
              controls
              playsInline
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              className="w-full h-full object-contain animate-fadeIn"
            />
          ) : (
            <img
              key={currentMedia.url}
              src={currentMedia.url}
              alt={currentMedia.caption}
              className="w-full h-full object-cover sm:object-contain animate-fadeIn transition-all duration-700"
            />
          )}

          {(currentMedia.type === 'video' || (currentMedia.url && currentMedia.url.endsWith('.mp4'))) && (
            <button
              type="button"
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;

                if (video.paused) {
                  video.play().catch((error) => {
                    console.error('Unable to play chapter video:', error);
                  });
                } else {
                  video.pause();
                }
              }}
              className="absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4AF37]/80 bg-black/65 text-[#F3E5AB] shadow-[0_0_24px_rgba(212,175,55,0.4)] backdrop-blur-md transition hover:scale-110 hover:bg-[#D4AF37] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              aria-label={isVideoPlaying ? 'Pause chapter video' : 'Play chapter video'}
              title={isVideoPlaying ? 'Pause video' : 'Play video'}
            >
              {isVideoPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </button>
          )}

          {/* Carousel Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 z-20 w-11 h-11 rounded-full glass-gold border border-[#D4AF37]/50 text-[#F3E5AB] hover:text-white hover:scale-110 transition-all flex items-center justify-center opacity-80 group-hover:opacity-100 shadow-lg"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 z-20 w-11 h-11 rounded-full glass-gold border border-[#D4AF37]/50 text-[#F3E5AB] hover:text-white hover:scale-110 transition-all flex items-center justify-center opacity-80 group-hover:opacity-100 shadow-lg"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>

          {/* Slide Dots */}
          <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
            {mediaList.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveMediaIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeMediaIdx === i
                    ? 'w-8 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Picture Caption Overlay */}
          <div className="absolute bottom-11 left-6 z-20 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs text-[#F3E5AB]">
            <span className="font-serif italic">{currentMedia.caption}</span>
            <span className="ml-2 text-[10px] text-[#D4AF37]/80">({activeMediaIdx + 1}/{mediaList.length})</span>
          </div>
        </div>

        {/* Caption & Story Drawer */}
        <div className="bg-[#0D0F18]/95 p-6 border-t border-[#D4AF37]/20 overflow-y-auto max-h-[30vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Chapter Metadata & Quote */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#D4AF37]">
                <span className="flex items-center">
                  <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                  {chapter.date}
                </span>
                <span className="flex items-center text-[#F3E5AB]/75">
                  <MapPinIcon className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                  {chapter.location}
                </span>
              </div>
              <blockquote className="font-serif italic text-sm text-[#F3E5AB] border-l-2 border-[#D4AF37] pl-3 py-1">
                {chapter.quote}
              </blockquote>
            </div>

            {/* Column 2: Detailed Story Snippet */}
            <div className="md:col-span-2 space-y-2">
              <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Archival Chapter Notes
              </h4>
              <p className="text-xs sm:text-sm text-[#F3E5AB]/85 font-sans leading-relaxed">
                {chapter.details}
              </p>
              <p className="text-xs text-[#F3E5AB]/65 font-sans leading-relaxed pt-1">
                {chapter.summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
