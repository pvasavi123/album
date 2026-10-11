import React, { useState } from 'react';
import { galleryItems } from '../data/chapters';
import { CameraIcon, HeartIcon, SparklesIcon, XIcon, MapPinIcon } from './Icons';

export const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [likes, setLikes] = useState({});

  const categories = ['All', 'Ceremony', 'Reception', 'Golden Hour', 'Details', 'First Look'];

  const filteredItems = activeFilter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const handleLike = (id, e) => {
    e.stopPropagation();
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
      {/* Section Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full glass-gold-subtle border border-[#D4AF37]/30 text-xs uppercase tracking-[0.25em] text-[#D4AF37] mb-3">
          <CameraIcon className="w-3.5 h-3.5" />
          <span>Curated Photography Archive</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide">
          Memories in Pure Light
        </h2>
        <p className="mt-3 text-sm text-[#F3E5AB]/70 max-w-xl mx-auto font-sans">
          Capturing the stolen glances, joyful tears, and golden sunsets of our celebration.
        </p>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase font-medium tracking-wider transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89225] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                  : 'glass-gold text-[#F3E5AB]/75 hover:text-white hover:border-[#D4AF37]/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => {
          const itemLikes = (likes[item.id] || 12) + (likes[item.id] ? 1 : 0);
          return (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-3xl overflow-hidden glass-gold border border-[#D4AF37]/25 hover:border-[#D4AF37] transition-all duration-500 cursor-pointer shadow-lg hover:shadow-gold-glow flex flex-col"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/40">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:brightness-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                {/* Category Pill */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-wider text-[#D4AF37] border border-[#D4AF37]/30">
                  {item.category}
                </div>

                {/* Like Button */}
                <button
                  onClick={(e) => handleLike(item.id, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:text-[#D4AF37] transition-colors flex items-center space-x-1"
                >
                  <HeartIcon className="w-3.5 h-3.5 text-[#D4AF37]" fill={likes[item.id] ? "#D4AF37" : "none"} />
                  <span className="text-[10px] font-sans">{itemLikes}</span>
                </button>

                {/* Hover Text Info */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif text-base font-bold text-white group-hover:text-[#F3E5AB]">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-[11px] text-[#F3E5AB]/70 mt-1">
                    <MapPinIcon className="w-3 h-3 text-[#D4AF37] mr-1" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div 
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full glass-gold rounded-3xl overflow-hidden border border-[#D4AF37]/60 shadow-2xl"
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 border border-white/20 text-white hover:text-[#D4AF37] flex items-center justify-center"
            >
              <XIcon className="w-4 h-4" />
            </button>
            <div className="max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <div className="p-6 bg-[#0D0F18] border-t border-[#D4AF37]/25 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                  {lightboxItem.category} • {lightboxItem.location}
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">
                  {lightboxItem.title}
                </h3>
              </div>
              <button
                onClick={(e) => handleLike(lightboxItem.id, e)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full glass-gold border border-[#D4AF37]/40 text-[#F3E5AB] hover:text-white"
              >
                <HeartIcon className="w-4 h-4 text-[#D4AF37]" fill={likes[lightboxItem.id] ? "#D4AF37" : "none"} />
                <span className="text-xs">Love this memory</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
