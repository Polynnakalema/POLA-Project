
import React from 'react';
import { APPRECIATION_WORDS, TimeOfDay } from '../types';

interface ParentsSectionProps {
  timeOfDay: TimeOfDay;
  boyStars: number;
  girlStars: number;
  onSetBoyStars: (count: number) => void;
  onSetGirlStars: (count: number) => void;
  accentColor: string;
}

const StarRating: React.FC<{ 
  stars: number; 
  onSetStars: (n: number) => void; 
  label: string; 
  icon: string;
  bgColor: string;
  accentColor: string;
}> = ({ stars, onSetStars, label, icon, bgColor, accentColor }) => (
  <div className={`${bgColor} p-3 rounded-2xl border-2 border-opacity-30 border-${accentColor}-400 w-full shadow-sm overflow-hidden`}>
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <h4 className={`font-bold text-[11px] uppercase tracking-wider text-${accentColor}-800 whitespace-nowrap`}>{label}</h4>
      </div>
      <div className="flex justify-center gap-0.5 my-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => onSetStars(num)}
            className={`text-xl transition-all duration-200 transform hover:scale-110 focus:outline-none ${
              num <= stars ? 'grayscale-0 scale-105 drop-shadow-sm' : 'grayscale opacity-20'
            }`}
          >
            ⭐
          </button>
        ))}
      </div>
      <div className="h-8 flex items-center justify-center text-center overflow-hidden">
        {stars > 0 ? (
          <p className={`text-[10px] font-black text-${accentColor}-600 leading-tight uppercase animate-pulse line-clamp-2`}>
            {APPRECIATION_WORDS[stars - 1]}
          </p>
        ) : (
          <p className="text-[9px] text-gray-400 italic">Tap to reward!</p>
        )}
      </div>
    </div>
  </div>
);

const ParentsSection: React.FC<ParentsSectionProps> = ({ 
  timeOfDay,
  boyStars, 
  girlStars, 
  onSetBoyStars, 
  onSetGirlStars,
  accentColor
}) => {
  return (
    <div className="mt-4 p-4 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-inner overflow-hidden">
      <div className="text-center mb-4">
        <div className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black text-white bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-400 mb-1 uppercase tracking-widest`}>
          Parent's Section
        </div>
        <h3 className="text-sm font-black text-gray-700 uppercase tracking-tight">
          Rewards for {timeOfDay}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StarRating 
          stars={boyStars} 
          onSetStars={onSetBoyStars} 
          label="Super Boy" 
          icon="👦" 
          bgColor="bg-blue-50"
          accentColor="blue"
        />
        <StarRating 
          stars={girlStars} 
          onSetStars={onSetGirlStars} 
          label="Super Girl" 
          icon="👧" 
          bgColor="bg-pink-50"
          accentColor="pink"
        />
      </div>
      
      {(boyStars === 5 && girlStars === 5) && (
        <div className="mt-3 text-center animate-bounce">
          <span className="inline-block bg-yellow-400 text-white px-4 py-1.5 rounded-full font-black text-[11px] shadow-md uppercase tracking-tighter">
            🌟 Perfect Team! 🌟
          </span>
        </div>
      )}
    </div>
  );
};

export default ParentsSection;
