import React, { useState } from 'react';
import { FilmIcon, Volume2Icon, VolumeXIcon, SparklesIcon } from './Icons';

export const Navbar = ({ onPlayMovie, activeSection, onNavigate, isAudioPlaying, onToggleAudio }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'timeline', label: 'The Timeline' },
    { id: 'gallery', label: 'Photo & Video Gallery' },
    { id: 'vault', label: '3D Vault' },
    { id: 'story', label: 'Our Story' },
  ];

  const handleLinkClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="glass-gold rounded-full px-6 py-3.5 flex items-center justify-between shadow-gold-subtle border border-[#D4AF37]/25">
          {/* Brand Wordmark with subtle love heart motif */}
          <div 
            onClick={() => handleLinkClick('timeline')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(212,175,55,0.3)]">
              <span className="text-[#D4AF37] text-xs animate-heart-float">♥</span>
            </div>
            <span className="font-cinzel text-lg sm:text-2xl font-bold tracking-[0.2em] sm:tracking-[0.25em] text-white group-hover:text-[#F3E5AB] transition-colors">
              EVERLASTING
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm">
            <button
              onClick={() => handleLinkClick('timeline')}
              className={`relative py-1 font-medium tracking-wide transition-colors ${
                activeSection === 'timeline'
                  ? 'text-white'
                  : 'text-[#F3E5AB]/75 hover:text-white'
              }`}
            >
              The Timeline
              {activeSection === 'timeline' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_8px_#D4AF37]" />
              )}
            </button>

            <button
              onClick={() => handleLinkClick('gallery')}
              className={`py-1 font-medium tracking-wide transition-colors ${
                activeSection === 'gallery'
                  ? 'text-white'
                  : 'text-[#F3E5AB]/75 hover:text-white'
              }`}
            >
              Photo & Video Gallery
            </button>

            <button
              onClick={() => handleLinkClick('vault')}
              className={`py-1 font-medium tracking-wide transition-colors ${
                activeSection === 'vault'
                  ? 'text-white'
                  : 'text-[#F3E5AB]/75 hover:text-white'
              }`}
            >
              Interactive 3D Vault
            </button>

            <button
              onClick={() => handleLinkClick('story')}
              className={`py-1 font-medium tracking-wide transition-colors ${
                activeSection === 'story'
                  ? 'text-white'
                  : 'text-[#F3E5AB]/75 hover:text-white'
              }`}
            >
              Love Stories
            </button>

            {/* Co-Edit Pill */}
            <button
              data-magnetic="true"
              data-cursor="EDIT"
              onClick={() => handleLinkClick('timeline')}
              className="px-3.5 py-1 rounded-full text-xs font-medium tracking-wider text-[#F3E5AB]/85 border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/10 transition-all shadow-[0_0_10px_rgba(212,175,55,0.15)]"
            >
              Co-Edit
            </button>
          </div>

          {/* Right Actions: Audio switch + Watch Cinematic Movie button */}
          <div className="flex items-center space-x-3">
            {/* Ambient Sound Toggle */}
            <button
              data-magnetic="true"
              onClick={onToggleAudio}
              title={isAudioPlaying ? "Mute ambient audio" : "Play ambient audio"}
              className={`p-2 rounded-full border transition-all duration-300 ${
                isAudioPlaying
                  ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'border-white/10 text-[#F3E5AB]/50 hover:text-[#F3E5AB] hover:border-white/20'
              }`}
            >
              {isAudioPlaying ? (
                <Volume2Icon className="w-4 h-4 animate-pulse" />
              ) : (
                <VolumeXIcon className="w-4 h-4" />
              )}
            </button>

            {/* Watch Cinematic Movie CTA Button */}
            <button
              data-magnetic="true"
              data-cursor="MOVIE"
              onClick={onPlayMovie}
              className="relative px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#DFBE5B] via-[#E5CD7C] to-[#D4AF37] text-[#1E1704] font-medium text-[11px] sm:text-xs md:text-sm tracking-wide shadow-[0_0_22px_rgba(212,175,55,0.45)] hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 font-sans"
            >
              <span className="hidden xs:inline">Watch Cinematic Movie</span>
              <span className="xs:hidden">Movie</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#F3E5AB]/80 hover:text-white"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`h-0.5 w-full bg-[#D4AF37] transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`h-0.5 w-full bg-[#D4AF37] transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 w-full bg-[#D4AF37] transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 glass-gold rounded-2xl p-4 border border-[#D4AF37]/30 shadow-2xl animate-fadeIn space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium transition-colors ${
                  activeSection === link.id
                    ? 'text-white bg-[#D4AF37]/20 border border-[#D4AF37]/40'
                    : 'text-[#F3E5AB]/80 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
