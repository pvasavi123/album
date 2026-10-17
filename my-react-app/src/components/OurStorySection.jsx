import React, { useState } from 'react';
import { storyMilestones, chapters } from '../data/chapters';
import { HeartIcon, SparklesIcon, CalendarIcon } from './Icons';

export const OurStorySection = () => {
  const featuredStoryVideos = chapters.slice(0, 4);
  const [toasts, setToasts] = useState([
    {
      id: 1,
      author: "Sophia Laurent",
      relation: "Maid of Honor",
      message: "Watching you two find each other in Paris and grow into this radiant family has been the greatest privilege of my life. To a thousand lifetimes together!",
      date: "September 18, 2024"
    },
    {
      id: 2,
      author: "Marcus & Clara Vance",
      relation: "Parents of the Groom",
      message: "Julian, we have never seen your eyes light up the way they do when Elena enters the room. May your home always be filled with warmth, laughter, and endless patience.",
      date: "September 18, 2024"
    },
    {
      id: 3,
      author: "David Chen",
      relation: "Best Man",
      message: "The speech was emotional, the Lake Como sunset was unreal, and the party went till 4 AM. Never change. Proud of you both forever.",
      date: "September 19, 2024"
    }
  ]);

  const [authorName, setAuthorName] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmitToast = (e) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    const newToast = {
      id: Date.now(),
      author: authorName,
      relation: relation || 'Beloved Friend',
      message: message,
      date: "Just now"
    };

    setToasts([newToast, ...toasts]);
    setAuthorName('');
    setRelation('');
    setMessage('');
    setHasSubmitted(true);

    // Launch celebratory golden confetti
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#FFF6D6', '#E5CD7C', '#FFFFFF']
      });
    }

    setTimeout(() => setHasSubmitted(false), 4000);
  };

  return (
    <section id="story" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Editorial Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full glass-gold-subtle border border-[#D4AF37]/30 text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-3">
          <HeartIcon className="w-3.5 h-3.5" />
          <span>Our Chronicled Story</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white tracking-wide">
          Written in the Stars
        </h2>
        <p className="mt-3 text-sm text-[#F3E5AB]/75 max-w-xl mx-auto font-sans">
          A seven-year journey of spontaneous journeys, quiet evenings, and an enduring promise.
        </p>

        {/* Marriage Milestones Counter Strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="glass-gold rounded-2xl p-4 border border-[#D4AF37]/25 text-center">
            <span className="font-cinzel text-2xl sm:text-3xl font-bold text-[#D4AF37] block">2,400+</span>
            <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB]/60">Days Together</span>
          </div>
          <div className="glass-gold rounded-2xl p-4 border border-[#D4AF37]/25 text-center">
            <span className="font-cinzel text-2xl sm:text-3xl font-bold text-[#D4AF37] block">18</span>
            <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB]/60">Countries Explored</span>
          </div>
          <div className="glass-gold rounded-2xl p-4 border border-[#D4AF37]/25 text-center">
            <span className="font-cinzel text-2xl sm:text-3xl font-bold text-[#D4AF37] block">1</span>
            <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB]/60">Sacred Vow</span>
          </div>
          <div className="glass-gold rounded-2xl p-4 border border-[#D4AF37]/25 text-center">
            <span className="font-cinzel text-2xl sm:text-3xl font-bold text-[#D4AF37] block">∞</span>
            <span className="text-[10px] uppercase tracking-widest text-[#F3E5AB]/60">Tomorrows</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Timeline Narrative & Interactive Guestbook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Narrative Timeline (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-cinzel text-xl font-bold text-white tracking-wider flex items-center space-x-2">
            <SparklesIcon className="w-5 h-5 text-[#D4AF37]" />
            <span>The Chapters of Us</span>
          </h3>

          <div className="space-y-6 relative border-l border-[#D4AF37]/30 pl-6 ml-3">
            {storyMilestones.map((milestone, idx) => (
              <div key={idx} className="relative group">
                {/* Node Dot */}
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#08090E] border-2 border-[#D4AF37] group-hover:scale-125 group-hover:bg-[#D4AF37] transition-all shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                
                <div className="glass-gold rounded-2xl p-5 border border-[#D4AF37]/20 group-hover:border-[#D4AF37]/60 transition-all">
                  <span className="font-cinzel text-xs font-bold text-[#D4AF37] tracking-widest">
                    {milestone.year}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-white mt-1">
                    {milestone.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#F3E5AB]/75 mt-2 font-sans leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-cinzel text-xl font-bold text-white tracking-wider flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-[#D4AF37]" />
                <span>Love Story Videos</span>
              </h3>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37]/80">
                {featuredStoryVideos.length} captured moments
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {featuredStoryVideos.map((chapter) => (
                <article key={chapter.id} className="group overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-[#11131A]/80 shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/60">
                  <div className="relative aspect-video overflow-hidden">
                    <video
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={chapter.videoUrl}
                      poster={chapter.videoThumbnail || chapter.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08090E] via-[#08090E]/25 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full border border-[#D4AF37]/60 bg-[#08090E]/70 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-[#F3E5AB]">
                      {chapter.year}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-[#D4AF37]/20 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] border border-[#D4AF37]/40">
                      video
                    </span>
                  </div>

                  <div className="space-y-2 p-4">
                    <h4 className="font-cinzel text-base font-bold text-white">
                      {chapter.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-[#F3E5AB]/80">
                      {chapter.summary}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive Toast Guestbook (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="font-cinzel text-xl font-bold text-white tracking-wider flex items-center space-x-2">
            <HeartIcon className="w-5 h-5 text-[#D4AF37]" />
            <span>Leave a Toast & Blessing</span>
          </h3>

          {/* Form */}
          <form onSubmit={handleSubmitToast} className="glass-gold rounded-3xl p-6 border border-[#D4AF37]/35 shadow-xl space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Aunt Genevieve & Uncle Robert"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-white placeholder-white/25 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                Relation / Note
              </label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="e.g. College Friend, Family, Guest"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-white placeholder-white/25 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-1">
                Wedding Wish or Toast
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Write your blessing for Julian & Elena..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-white placeholder-white/25 text-xs focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF6D6] to-[#D4AF37] text-black font-sans font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center space-x-2"
            >
              <SparklesIcon className="w-4 h-4 text-black" />
              <span>Sign Digital Archive</span>
            </button>

            {hasSubmitted && (
              <p className="text-center text-xs text-[#D4AF37] font-serif italic animate-fadeIn">
                ✨ Thank you! Your blessing has been enshrined in our archive.
              </p>
            )}
          </form>

          {/* Toast Wall */}
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {toasts.map((toast) => (
              <div key={toast.id} className="glass-gold rounded-2xl p-4 border border-[#D4AF37]/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-cinzel font-bold text-white">{toast.author}</span>
                  <span className="text-[10px] text-[#D4AF37]/75 font-sans">{toast.relation}</span>
                </div>
                <p className="font-serif italic text-xs text-[#F3E5AB]/90 leading-relaxed">
                  “{toast.message}”
                </p>
                <div className="text-[9px] text-white/30 pt-1 text-right">
                  {toast.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
