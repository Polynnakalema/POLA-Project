
import React, { useState } from 'react';
import { TimeOfDay, Activity, ChildRewards } from './types';
import { INITIAL_ROUTINE } from './constants';
import RoutineItem from './components/RoutineItem';
import ParentsSection from './components/RewardPanel';

const App: React.FC = () => {
  const [routine, setRoutine] = useState<Record<TimeOfDay, Activity[]>>(INITIAL_ROUTINE);
  const [rewards, setRewards] = useState<Record<TimeOfDay, ChildRewards>>({
    [TimeOfDay.MORNING]: { boy: 0, girl: 0 },
    [TimeOfDay.AFTERNOON]: { boy: 0, girl: 0 },
    [TimeOfDay.EVENING]: { boy: 0, girl: 0 },
  });

  const toggleActivity = (time: TimeOfDay, id: string) => {
    setRoutine(prev => ({
      ...prev,
      [time]: prev[time].map(act => act.id === id ? { ...act, isDone: !act.isDone } : act)
    }));
  };

  const setChildStars = (time: TimeOfDay, child: keyof ChildRewards, count: number) => {
    setRewards(prev => ({
      ...prev,
      [time]: {
        ...prev[time],
        [child]: count
      }
    }));
  };

  const getSectionTheme = (time: TimeOfDay) => {
    switch (time) {
      case TimeOfDay.MORNING: return { color: 'sky', gradient: 'from-sky-400 to-blue-300', icon: '☀️' };
      case TimeOfDay.AFTERNOON: return { color: 'pink', gradient: 'from-pink-400 to-rose-300', icon: '🌤️' };
      case TimeOfDay.EVENING: return { color: 'blue', gradient: 'from-blue-400 to-sky-200', icon: '🌙' };
    }
  };

  const calculateTotalStars = (child: keyof ChildRewards) => {
    return rewards[TimeOfDay.MORNING][child] + 
           rewards[TimeOfDay.AFTERNOON][child] + 
           rewards[TimeOfDay.EVENING][child];
  };

  const getSectionBgClass = (time: TimeOfDay) => {
    switch (time) {
      case TimeOfDay.MORNING:
        return 'bg-sky-100/70 p-6 rounded-[2.5rem] -mx-4 border-y-2 border-sky-200/50 shadow-inner';
      case TimeOfDay.AFTERNOON:
        return 'bg-pink-100/50 p-6 rounded-[2.5rem] -mx-4 border-y-2 border-pink-200/50 shadow-inner';
      case TimeOfDay.EVENING:
        return 'bg-blue-100/50 p-6 rounded-[2.5rem] -mx-4 border-y-2 border-blue-200/50 shadow-inner';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-[#fdfcf0]">
      {/* Header */}
      <header className="py-20 px-6 text-center text-white bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        {/* Decorative Floating Background Elements */}
        <div className="absolute top-5 left-10 text-3xl animate-pulse delay-75">✨</div>
        <div className="absolute top-20 right-10 text-2xl animate-bounce">⭐</div>
        <div className="absolute bottom-5 left-20 text-4xl opacity-30">✨</div>

        <div className="max-w-md mx-auto relative z-10">
          <h1 className="text-4xl font-black mb-1 tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] uppercase text-sky-100">
            SUPERKIDS JOURNEY
          </h1>
          <div className="text-3xl font-black mb-6 tracking-widest text-sky-100 drop-shadow-[0_3px_2px_rgba(0,0,0,0.3)] transform -rotate-1 inline-flex items-center gap-3 uppercase mt-1">
            WITH POLA 
            <span className="inline-block animate-bounce origin-bottom text-yellow-300">⭐</span>
          </div>
          <p className="text-lg opacity-90 font-bold tracking-wide bg-white/20 backdrop-blur-sm rounded-full py-1 px-6 block max-w-xs mx-auto">
            Step into your Superpower! 🚀
          </p>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-md mx-auto mt-10 px-4 space-y-12 relative z-20">
        {(Object.values(TimeOfDay)).map((time) => {
          const theme = getSectionTheme(time);
          const completedCount = routine[time].filter(a => a.isDone).length;
          const totalCount = routine[time].length;
          
          return (
            <section 
              key={time} 
              className={`space-y-4 transition-all duration-500 transform hover:translate-y-[-4px] ${getSectionBgClass(time)}`}
            >
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                  <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-2xl shadow-lg transform -rotate-3 hover:rotate-12 transition-transform`}>
                    {theme.icon}
                  </span>
                  {time}
                </h2>
                <div className={`bg-white px-4 py-1.5 rounded-full text-xs font-black text-${theme.color}-500 shadow-md border-2 border-${theme.color}-100`}>
                  {completedCount} / {totalCount} DONE
                </div>
              </div>

              <div className="space-y-3">
                {routine[time].map((activity) => (
                  <RoutineItem 
                    key={activity.id} 
                    activity={activity} 
                    onToggle={(id) => toggleActivity(time, id)} 
                  />
                ))}
              </div>

              <ParentsSection 
                timeOfDay={time}
                boyStars={rewards[time].boy}
                girlStars={rewards[time].girl}
                onSetBoyStars={(count) => setChildStars(time, 'boy', count)}
                onSetGirlStars={(count) => setChildStars(time, 'girl', count)}
                accentColor={theme.color}
              />
            </section>
          );
        })}

        <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white text-center border-4 border-yellow-400/30 transform hover:scale-[1.03] transition-all">
          <div className="mb-4 inline-block bg-yellow-400 text-black font-black px-4 py-1 rounded-full text-xs uppercase tracking-widest">
            Hall of Fame
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500">
            Daily Grand Total
          </h3>
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center group">
              <span className="text-6xl mb-3 transform group-hover:scale-125 transition-transform">👦</span>
              <div className="text-4xl font-black text-blue-400 drop-shadow-md">{calculateTotalStars('boy')} / 15</div>
              <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-2">Super Boy</div>
            </div>
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
            <div className="flex flex-col items-center group">
              <span className="text-6xl mb-3 transform group-hover:scale-125 transition-transform">👧</span>
              <div className="text-4xl font-black text-pink-400 drop-shadow-md">{calculateTotalStars('girl')} / 15</div>
              <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-2">Super Girl</div>
            </div>
          </div>
          
          {(calculateTotalStars('boy') + calculateTotalStars('girl') >= 25) && (
            <div className="mt-10 py-3 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 text-black font-black rounded-2xl animate-bounce shadow-xl">
              🏆 YOU ARE LEGENDARY! 🏆
            </div>
          )}
        </div>

        <footer className="mt-20 text-center text-gray-400 text-sm py-12 border-t border-gray-100">
          <p className="font-black uppercase tracking-[0.2em] text-sky-300 text-xs">SUPERKIDS JOURNEY WITH POLA</p>
          <div className="mt-4 text-xl opacity-60 flex justify-center gap-4">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>✨</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
