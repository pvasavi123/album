import React, { useState, useEffect, useRef } from 'react';
import { Volume2Icon, VolumeXIcon, PlayIcon, PauseIcon, SparklesIcon, HeartIcon } from './Icons';

export const AudioVowsWidget = ({ isAudioPlaying, onToggleAudio }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [vowStep, setVowStep] = useState(0);
  const audioCtxRef = useRef(null);
  const oscillatorRefs = useRef([]);
  const gainNodeRef = useRef(null);
  const animFrameRef = useRef(null);
  const [barHeights, setBarHeights] = useState([30, 60, 45, 80, 50, 75, 40, 65, 90, 55, 70, 45]);

  const vowsList = [
    { speaker: "Elena", text: "“Julian, from the first rainy afternoon in Paris, my heart recognized yours before my mind could find words.”" },
    { speaker: "Julian", text: "“I promise to stand beside you in stillness and adventure, laughing through every storm and loving you through every dawn.”" },
    { speaker: "Together", text: "“I choose you today, with all my heart and all my tomorrows, forever everlasting.”" }
  ];

  // Harmonious ambient acoustic piano sound generator using Web Audio API
  const startHarmonicAudio = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Soft romantic pentatonic arpeggio chords (Db Major / F minor warmth)
      const chordFrequencies = [
        [277.18, 349.23, 415.30, 554.37], // Db, F, Ab, Db5
        [311.13, 369.99, 466.16, 622.25], // Eb, Gb, Bb, Eb5
        [349.23, 415.30, 523.25, 698.46], // F, Ab, C, F5
        [277.18, 415.30, 554.37, 830.61], // Db, Ab, Db5, Ab5
      ];

      let noteIdx = 0;
      let chordIdx = 0;

      const scheduleNotes = () => {
        if (!isPlaying && !audioCtxRef.current) return;
        const currentChord = chordFrequencies[chordIdx % chordFrequencies.length];
        const freq = currentChord[noteIdx % currentChord.length];

        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Warm sine wave with subtle triangle overtone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start();
        osc.stop(ctx.currentTime + 3.0);

        oscillatorRefs.current.push(osc);
        if (oscillatorRefs.current.length > 20) {
          oscillatorRefs.current.shift();
        }

        noteIdx++;
        if (noteIdx % 4 === 0) {
          chordIdx++;
        }
      };

      const intervalId = setInterval(scheduleNotes, 850);
      return intervalId;
    } catch (e) {
      console.warn("Audio Context init prevented by browser policy:", e);
    }
  };

  const toggleVowsPlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (onToggleAudio) {
      onToggleAudio(nextState);
    }
  };

  // Synchronize with global audio if toggled from navbar
  useEffect(() => {
    if (isAudioPlaying !== undefined && isAudioPlaying !== isPlaying) {
      setIsPlaying(isAudioPlaying);
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    let intervalId = null;
    if (isPlaying) {
      intervalId = startHarmonicAudio();
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        try {
          gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5);
        } catch (_) {}
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying]);

  // Visualizer bars animation
  useEffect(() => {
    let frameId;
    const animateVisualizer = () => {
      if (isPlaying) {
        setBarHeights((prev) =>
          prev.map(() => 20 + Math.random() * 75)
        );
      } else {
        setBarHeights([25, 30, 20, 35, 25, 30, 20, 28, 32, 22, 26, 20]);
      }
      frameId = setTimeout(() => {
        animFrameRef.current = requestAnimationFrame(animateVisualizer);
      }, 100);
    };

    animFrameRef.current = requestAnimationFrame(animateVisualizer);

    return () => {
      clearTimeout(frameId);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Vow text stepper
  useEffect(() => {
    if (!isPlaying) return;
    const vowInterval = setInterval(() => {
      setVowStep((prev) => (prev + 1) % vowsList.length);
    }, 6000);
    return () => clearInterval(vowInterval);
  }, [isPlaying]);

  const currentVow = vowsList[vowStep];

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      {/* Expanded Vows Drawer */}
      {isExpanded && (
        <div className="mb-3 glass-gold rounded-2xl p-4 border border-[#D4AF37]/40 shadow-2xl animate-fadeIn space-y-2 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
            <div className="flex items-center space-x-1.5 text-xs text-[#D4AF37] font-semibold tracking-wider">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>SPOKEN CEREMONY VOWS</span>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-xs text-[#F3E5AB]/60 hover:text-white"
            >
              Close
            </button>
          </div>
          <p className="font-serif italic text-xs text-[#F3E5AB] leading-relaxed pt-1">
            {currentVow.text}
          </p>
          <div className="flex items-center justify-between pt-1 text-[10px] text-[#D4AF37]">
            <span className="font-cinzel">— {currentVow.speaker}</span>
            <span className="text-[#F3E5AB]/50">Lake Como • Sept 18, 2024</span>
          </div>
        </div>
      )}

      {/* Floating Glass Pill Badge */}
      <div className="glass-gold rounded-full p-2 pr-4 flex items-center space-x-3 border border-[#D4AF37]/35 shadow-gold-subtle hover:border-[#D4AF37] transition-all duration-300">
        {/* Play/Pause Button */}
        <button
          onClick={toggleVowsPlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? 'bg-gradient-to-tr from-[#D4AF37] to-[#FFF6D6] text-black shadow-[0_0_20px_rgba(212,175,55,0.6)] scale-105'
              : 'bg-white/10 text-[#F3E5AB] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30'
          }`}
          title={isPlaying ? "Pause vows audio" : "Play our vows"}
        >
          {isPlaying ? (
            <PauseIcon className="w-4 h-4 text-black" />
          ) : (
            <PlayIcon className="w-4 h-4 text-[#D4AF37] ml-0.5" />
          )}
        </button>

        {/* Content text */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer select-none"
        >
          <div className="flex items-center space-x-1.5">
            <HeartIcon className={`w-3.5 h-3.5 text-[#D4AF37] ${isPlaying ? 'fill-[#D4AF37]' : ''}`} />
            <span className="text-xs font-serif font-bold text-white tracking-wide">
              Listen to our vows
            </span>
          </div>
          <span className="text-[10px] text-[#D4AF37]/80 block font-sans tracking-wider">
            {isPlaying ? 'Playing ceremony vows...' : 'Tap to hear vows & piano'}
          </span>
        </div>

        {/* Dynamic 12-Bar Audio Visualizer */}
        <div 
          onClick={toggleVowsPlay}
          className="flex items-end space-x-1 h-5 cursor-pointer pl-1"
          title="Frequency Visualizer"
        >
          {barHeights.slice(0, 8).map((height, i) => (
            <div
              key={i}
              style={{ height: `${height}%` }}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying 
                  ? 'bg-gradient-to-t from-[#D4AF37] to-[#FFF6D6] shadow-[0_0_6px_rgba(212,175,55,0.7)]'
                  : 'bg-[#D4AF37]/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
