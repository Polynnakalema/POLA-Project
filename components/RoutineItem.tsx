
import React, { useState } from 'react';
import { Activity } from '../types';
import { playMotivationalSpeech } from '../services/geminiService';

interface RoutineItemProps {
  activity: Activity;
  onToggle: (id: string) => void;
}

interface StarParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
  size: number;
  rotation: number;
  color: string;
}

const RAINBOW_COLORS = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFEF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#8B00FF'  // Violet
];

const RoutineItem: React.FC<RoutineItemProps> = ({ activity, onToggle }) => {
  const [particles, setParticles] = useState<StarParticle[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const createParticles = () => {
    const newParticles: StarParticle[] = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Math.random(),
        x: 0,
        y: 0,
        angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5),
        velocity: 60 + Math.random() * 120,
        size: 15 + Math.random() * 25,
        rotation: Math.random() * 360,
        color: RAINBOW_COLORS[i % RAINBOW_COLORS.length]
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const handleClick = () => {
    const becomingDone = !activity.isDone;
    
    // Always toggle state immediately for responsive UI
    onToggle(activity.id);

    if (becomingDone) {
      createParticles();
      setIsSpeaking(true);
      
      // Fire and forget speech so UI stays responsive
      const triggerSpeech = async () => {
        try {
          await playMotivationalSpeech(activity.title);
        } finally {
          // Keep the "magic" effect visible for a minimum duration to match audio length
          setTimeout(() => setIsSpeaking(false), 2500);
        }
      };
      triggerSpeech();
    } else {
      setIsSpeaking(false);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative flex items-center p-4 mb-3 rounded-2xl cursor-pointer transition-all duration-300 transform active:scale-95 ${
        activity.isDone 
          ? 'bg-green-100 border-2 border-green-400 opacity-80 shadow-sm' 
          : 'bg-white border-2 border-transparent kid-shadow'
      }`}
    >
      {/* Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-50">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-pop-star select-none"
            style={{
              '--angle': `${p.angle}rad`,
              '--dist': `${p.velocity}px`,
              '--rot': `${p.rotation}deg`,
              fontSize: `${p.size}px`,
              color: p.color,
              filter: `drop-shadow(0 0 8px ${p.color})`,
            } as React.CSSProperties}
          >
            ★
          </div>
        ))}
      </div>

      <div className={`text-4xl mr-4 select-none relative ${isSpeaking ? 'animate-bounce' : ''}`}>
        {activity.icon}
        {isSpeaking && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-bold text-lg ${activity.isDone ? 'line-through text-green-700' : 'text-gray-800'}`}>
            {activity.title}
          </h3>
          {isSpeaking && (
            <span className="flex items-center gap-1 text-[10px] bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full font-bold animate-pulse">
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-ping"></span>
              MAGIC VOICE...
            </span>
          )}
        </div>
        <p className={`text-sm ${activity.isDone ? 'text-green-600' : 'text-gray-500'}`}>
          {activity.description}
        </p>
      </div>
      
      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
        activity.isDone ? 'bg-green-500 border-green-500' : 'border-gray-300'
      }`}>
        {activity.isDone && (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <style>{`
        @keyframes pop-star {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(calc(cos(var(--angle)) * var(--dist)), calc(sin(var(--angle)) * var(--dist))) rotate(var(--rot)) scale(1.5);
            opacity: 0;
          }
        }
        .animate-pop-star {
          animation: pop-star 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default RoutineItem;
