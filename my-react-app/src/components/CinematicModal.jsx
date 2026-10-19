import { useState, useEffect, useRef } from 'react';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon, MapPinIcon, CalendarIcon } from './Icons';

export const CinematicModal = ({ chapter, onClose }) => {
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const mediaList = chapter?.media || [];
  const currentMedia = mediaList[activeMediaIdx] || { url: chapter?.image, caption: chapter?.subtitle };
  const isVideo = currentMedia.type === 'video' || currentMedia.url?.endsWith('.mp4');

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!chapter) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setActiveMediaIdx((prev) => (prev + 1) % Math.max(mediaList.length, 1));
      }
      if (e.key === 'ArrowLeft') {
        setActiveMediaIdx((prev) => (prev - 1 + Math.max(mediaList.length, 1)) % Math.max(mediaList.length, 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapter, onClose, mediaList.length]);

  if (!chapter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fadeIn sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_65%)]" />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="chapter-title"
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#0B0C10] sm:h-auto sm:max-h-[92vh] sm:max-w-6xl sm:rounded-2xl sm:border sm:border-white/10 sm:shadow-[0_32px_100px_rgba(0,0,0,0.7)]"
      >
        <header className="z-20 flex shrink-0 items-start justify-between gap-4 border-b border-white/10 bg-[#0B0C10] px-4 py-3 sm:px-7 sm:py-5">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] sm:text-xs">
              <span>Chapter {chapter.id.replace('chap-', '')}</span>
              <span className="h-1 w-1 rounded-full bg-[#D4AF37]/60" />
              <span className="text-white/55">{chapter.year}</span>
            </div>
            <h2 id="chapter-title" className="line-clamp-2 font-serif text-base font-semibold leading-snug text-white sm:text-2xl">
              {chapter.title.replace(/^Chapter \d+\s*[–-]\s*/, '')}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {mediaList.length > 1 && (
              <button
                type="button"
                onClick={() => setIsAutoPlaying((playing) => !playing)}
                className="flex h-10 items-center gap-2 rounded-full border border-white/15 px-3 text-xs font-medium text-white/75 transition hover:border-[#D4AF37]/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                aria-label={isAutoPlaying ? 'Pause slideshow' : 'Start slideshow'}
                title={isAutoPlaying ? 'Pause slideshow' : 'Start slideshow'}
              >
                {isAutoPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                <span className="hidden sm:inline">{isAutoPlaying ? 'Pause' : 'Slideshow'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition hover:border-white/40 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
              aria-label="Close chapter"
              title="Close chapter"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="relative aspect-video w-full shrink-0 select-none overflow-hidden bg-black sm:max-h-[58vh]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <img
              src={chapter.image}
              alt=""
              className="h-full w-full scale-110 object-cover opacity-35 blur-2xl"
            />
            <div className="absolute inset-0 bg-black/45" />
          </div>

          {isVideo ? (
            <video
              ref={videoRef}
              key={currentMedia.url}
              src={currentMedia.url}
              autoPlay
              loop
              playsInline
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              className="relative z-[1] h-full w-full object-contain"
            />
          ) : (
            <img
              key={currentMedia.url}
              src={currentMedia.url}
              alt={currentMedia.caption}
              className="relative z-[1] h-full w-full object-contain"
            />
          )}

          {isVideo && (
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
              className="absolute bottom-3 right-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/70 text-white shadow-lg backdrop-blur-md transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] sm:bottom-5 sm:right-5"
              aria-label={isVideoPlaying ? 'Pause chapter video' : 'Play chapter video'}
              title={isVideoPlaying ? 'Pause video' : 'Play video'}
            >
              {isVideoPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
            </button>
          )}

          {mediaList.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/90 backdrop-blur transition hover:border-[#D4AF37] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] sm:left-5"
                aria-label="Previous moment"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white/90 backdrop-blur transition hover:border-[#D4AF37] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] sm:right-5"
                aria-label="Next moment"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto border-t border-white/10 bg-[#0E1015] px-4 py-4 sm:px-7 sm:py-5">
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/65 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-[#D4AF37]" />
              {chapter.date}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-[#D4AF37]" />
              {chapter.location}
            </span>
          </div>
          <p className="mb-3 text-sm font-medium text-[#D4AF37]">{currentMedia.caption}</p>
          {chapter.quote && (
            <blockquote className="mb-3 border-l-2 border-[#D4AF37]/70 pl-3 font-serif text-sm italic leading-relaxed text-white/85 sm:text-base">
              {chapter.quote}
            </blockquote>
          )}
          <p className="max-w-3xl text-sm leading-relaxed text-white/60">
            {chapter.details || chapter.summary}
          </p>
        </div>
      </section>
    </div>
  );
};
