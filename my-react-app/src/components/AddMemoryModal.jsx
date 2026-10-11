import React, { useState } from 'react';
import { SparklesIcon, CalendarIcon, MapPinIcon } from './Icons';

export const AddMemoryModal = ({ isOpen, onClose, onAddChapter }) => {
  const [formData, setFormData] = useState({
    title: '',
    year: '2026',
    date: 'October 11, 2026',
    location: '',
    subtitle: '',
    summary: '',
    image: '',
    badge: 'New Memory',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newChapter = {
      id: `chap-${Date.now()}`,
      year: formData.year || '2026',
      date: formData.date || 'October 2026',
      title: formData.title,
      subtitle: formData.subtitle || 'A cherished new milestone',
      location: formData.location || 'Our Secret Place',
      summary: formData.summary || 'A beautiful memory written together.',
      quote: `“${formData.title} — forever etched in our story.”`,
      badge: formData.badge || 'New Memory',
      image: formData.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
      videoThumbnail: formData.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
      media: [
        {
          type: 'image',
          url: formData.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
          caption: formData.title,
        }
      ],
      details: formData.summary,
      accent: '#D4AF37'
    };

    onAddChapter(newChapter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg glass-gold rounded-3xl p-5 sm:p-8 border border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.35)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <SparklesIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
                Add New Memory
              </h2>
              <p className="text-xs text-[#F3E5AB]/70 font-sans">
                Inject a milestone into the 3D spatial timeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/20 text-[#F3E5AB]/70 hover:text-white hover:border-[#D4AF37] flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans overflow-y-auto pr-1">
          <div>
            <label className="block text-[#F3E5AB]/90 font-medium mb-1 tracking-wider uppercase text-[10px]">
              Chapter Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Chapter 7 – Paris Under The Snow"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#F3E5AB]/90 font-medium mb-1 tracking-wider uppercase text-[10px]">
                Milestone Year
              </label>
              <input
                type="text"
                placeholder="2026"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#F3E5AB]/90 font-medium mb-1 tracking-wider uppercase text-[10px]">
                Exact Date
              </label>
              <input
                type="text"
                placeholder="October 11, 2026"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#F3E5AB]/90 font-medium mb-1 tracking-wider uppercase text-[10px]">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g., Montmartre, Paris"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#F3E5AB]/90 font-medium mb-1 tracking-wider uppercase text-[10px]">
              Photo URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[#F3E5AB]/90 font-medium mb-1 tracking-wider uppercase text-[10px]">
              Story & Reflections
            </label>
            <textarea
              rows={3}
              placeholder="Tell the story of this magical moment..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-[#D4AF37]/30 text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-white/20 text-[#F3E5AB]/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#DFBE5B] to-[#D4AF37] text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              Save Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
