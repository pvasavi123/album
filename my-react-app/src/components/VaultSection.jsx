import React, { useState } from 'react';
import { vaultArtifacts } from '../data/chapters';
import { SparklesIcon, ShieldLockIcon } from './Icons';

export const VaultSection = () => {
  const [selectedArtifact, setSelectedArtifact] = useState(vaultArtifacts[0]);

  return (
    <section id="vault" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full glass-gold-subtle border border-[#D4AF37]/30 text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-3">
          <ShieldLockIcon className="w-3.5 h-3.5" />
          <span>Keepsake Vault</span>
          <span className="text-[#D4AF37] text-xs">♥</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide">
          The 3D Artifact Vault
        </h2>
        <p className="mt-3 text-sm text-[#F3E5AB]/75 max-w-xl mx-auto font-sans">
          Digitized physical keepsakes from our covenant, preserved in timeless photorealistic clarity.
        </p>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left: Master Stage Display for Artifact Render (7 columns) */}
        <div className="lg:col-span-7 glass-gold rounded-3xl p-4 sm:p-6 border border-[#D4AF37]/35 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-4 left-6 z-10 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold">
              Master Keepsake Archive
            </span>
            <span className="text-[#D4AF37] text-xs">♥</span>
          </div>

          <div className="absolute top-4 right-6 z-10">
            <span className="px-3 py-1 rounded-full text-[11px] font-sans font-semibold glass-gold border border-[#D4AF37]/40 text-[#F3E5AB]">
              {selectedArtifact.subtitle}
            </span>
          </div>

          {/* Master Artifact Image Stage */}
          <div className="relative w-full h-[360px] xs:h-[400px] sm:h-[480px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a0c16]/80 via-[#07080e] to-[#0d0f18] border border-white/5 flex items-center justify-center p-3 sm:p-6">
            {selectedArtifact.videoUrl ? (
              <video
                key={selectedArtifact.id}
                src={selectedArtifact.videoUrl}
                poster={selectedArtifact.videoThumbnail || selectedArtifact.image}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover rounded-xl shadow-[0_18px_32px_rgba(0,0,0,0.7)]"
              />
            ) : (
              <img
                key={selectedArtifact.id}
                src={selectedArtifact.image}
                alt={selectedArtifact.name}
                className="w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.95)] rounded-xl transition-all duration-700 hover:scale-105"
              />
            )}
          </div>

          {/* Bottom Card Labels */}
          <div className="mt-4 flex items-center justify-between text-xs text-[#F3E5AB]/70 px-2 font-sans">
            <span className="flex items-center space-x-1.5">
              <span>Rahul & Sneha • Sacred Archival Artifact</span>
              <span className="text-[#D4AF37]">♥</span>
            </span>
            <span className="text-[#D4AF37] font-semibold">
              {selectedArtifact.material.split('&')[0]}
            </span>
          </div>
        </div>

        {/* Right: Artifact Details & Selector (5 columns) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
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
                <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center space-x-1">
                  <span>Mana Memory (Telugu)</span>
                  <span>♥</span>
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

          {/* Interactive Artifact Selector with Image Thumbnails */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center space-x-1">
                <span>Select Keepsake to View</span>
                <span>♥</span>
              </span>
              <span className="text-[10px] text-[#F3E5AB]/50 font-sans">
                {vaultArtifacts.findIndex(a => a.id === selectedArtifact.id) + 1} of {vaultArtifacts.length}
              </span>
            </div>

            {/* Grid of the 4 Artifacts with Thumbnail Previews */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {vaultArtifacts.map((art) => {
                const isSelected = selectedArtifact.id === art.id;
                return (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArtifact(art)}
                    className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#D4AF37]/25 border-[#D4AF37] shadow-[0_0_22px_rgba(212,175,55,0.4)] scale-[1.03] ring-1 ring-[#D4AF37]/50'
                        : 'glass-gold border-white/10 hover:border-[#D4AF37]/50 text-[#F3E5AB]/75 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/60 mb-2 border border-white/10">
                      <img
                        src={art.image}
                        alt={art.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      />
                    </div>

                    <div>
                      <span className={`block font-cinzel text-xs font-bold transition-colors leading-snug ${isSelected ? 'text-[#FFF6D6]' : 'text-white group-hover:text-[#F3E5AB]'}`}>
                        {art.name}
                      </span>
                      <span className="block text-[9px] text-[#D4AF37]/90 font-serif italic mt-0.5 truncate">
                        {art.subtitle}
                      </span>
                    </div>

                    <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between text-[9px] text-[#F3E5AB]/60">
                      <span className="uppercase tracking-widest">Keepsake</span>
                      <span className={isSelected ? 'text-[#D4AF37] font-bold' : ''}>
                        {isSelected ? '● Active' : 'View →'}
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
