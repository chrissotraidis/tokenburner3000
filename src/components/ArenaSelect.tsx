import { useState } from 'react';
import type { Fighter, Arena } from '../types';
import { ARENAS } from '../data/arenas';

interface ArenaSelectProps {
  fighter1: Fighter;
  fighter2: Fighter;
  onSelectArena: (arena: Arena, customPrompt?: string) => void;
  onBack: () => void;
}

export default function ArenaSelect({ fighter1, fighter2, onSelectArena, onBack }: ArenaSelectProps) {
  const [freestylePrompt, setFreestylePrompt] = useState('');
  const [showFreestyle, setShowFreestyle] = useState(false);

  const handleSelect = (arena: Arena) => {
    if (arena.id === 'freestyle') {
      setShowFreestyle(true);
    } else {
      onSelectArena(arena);
    }
  };

  const handleFreestyleSubmit = () => {
    const freestyle = ARENAS.find(a => a.id === 'freestyle')!;
    if (freestylePrompt.trim()) {
      onSelectArena(freestyle, freestylePrompt.trim());
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto relative z-10 min-h-[80vh] flex flex-col items-center">
      <div className="text-center mb-12 w-full">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-2 flicker">
          Step 2: <span className="text-neon-orange">Select Arena</span>
        </h2>
        <div className="flex justify-center items-center space-x-6 mt-6 bg-black/50 p-4 border border-[#333]">
          <span className="text-2xl">{fighter1.logo}</span>
          <span className="font-bold text-xl">{fighter1.name}</span>
          <span className="text-gray-600 italic">VS</span>
          <span className="font-bold text-xl">{fighter2.name}</span>
          <span className="text-2xl">{fighter2.logo}</span>
        </div>
      </div>

      <button
        onClick={onBack}
        className="self-start mb-6 border border-gray-600 text-gray-400 font-bold px-4 py-2 uppercase text-sm hover:text-white hover:border-white transition-colors cursor-pointer"
      >
        &larr; Change Fighters
      </button>

      {showFreestyle ? (
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <h3 className="text-2xl font-black uppercase text-neon-orange">Freestyle Prompt</h3>
          <p className="text-gray-400 font-mono text-sm">
            The commission allows creative freedom. Write your battle prompt below.
          </p>
          <textarea
            value={freestylePrompt}
            onChange={e => setFreestylePrompt(e.target.value)}
            placeholder="E.g., 'Argue about whether hotdogs are sandwiches like your career depends on it.'"
            className="w-full h-40 bg-black border-2 border-neon-orange text-white p-4 font-mono text-sm resize-none focus:outline-none focus:shadow-[0_0_15px_rgba(255,94,0,0.5)]"
          />
          <div className="flex gap-4">
            <button
              onClick={handleFreestyleSubmit}
              disabled={!freestylePrompt.trim()}
              className="bg-neon-orange text-black font-black text-xl px-8 py-3 uppercase hover:bg-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Start Fight
            </button>
            <button
              onClick={() => setShowFreestyle(false)}
              className="border border-gray-600 text-gray-400 font-bold px-6 py-3 uppercase hover:text-white hover:border-white transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-4 w-full">
          {ARENAS.map(a => (
            <button
              key={a.id}
              onClick={() => handleSelect(a)}
              className="text-left w-full bg-gray-900 border-l-8 border-neon-orange p-6 hover:bg-gray-800 hover:ml-4 transition-all duration-200 group cursor-pointer"
            >
              <h3 className="text-3xl font-black uppercase text-white group-hover:text-neon-orange">
                {a.name}
              </h3>
              <p className="font-mono text-gray-400 mt-2">{a.desc}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
