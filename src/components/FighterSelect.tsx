import type { Fighter } from '../types';
import { FIGHTERS } from '../data/fighters';

interface FighterSelectProps {
  fighter1: Fighter | null;
  fighter2: Fighter | null;
  onSelectFighter: (f: Fighter) => void;
  onDeselectFighter: (which: 1 | 2) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function FighterSelect({ fighter1, fighter2, onSelectFighter, onDeselectFighter, onConfirm, onBack }: FighterSelectProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto relative z-10 min-h-[80vh] flex flex-col">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-2 flicker">
          Step 1: <span className="text-neon-cyan">Select Fighters</span>
        </h2>
        <p className="text-gray-400 font-mono uppercase text-xl">
          {!fighter1
            ? 'Choose Fighter 1 (Red Corner)'
            : !fighter2
            ? 'Choose Fighter 2 (Blue Corner)'
            : 'Fighters Locked.'}
        </p>

        {/* Selected fighters summary with deselect */}
        {(fighter1 || fighter2) && (
          <div className="flex justify-center items-center gap-4 mt-4">
            {fighter1 && (
              <button
                onClick={() => onDeselectFighter(1)}
                className="flex items-center gap-2 bg-red-900/30 border border-red-800 px-3 py-1.5 text-sm font-bold uppercase hover:bg-red-900/60 transition-colors cursor-pointer"
              >
                <span>{fighter1.logo} {fighter1.name}</span>
                <span className="text-red-400 text-xs">&#x2715;</span>
              </button>
            )}
            {fighter1 && fighter2 && <span className="text-gray-600 italic">vs</span>}
            {fighter2 && (
              <button
                onClick={() => onDeselectFighter(2)}
                className="flex items-center gap-2 bg-blue-900/30 border border-blue-800 px-3 py-1.5 text-sm font-bold uppercase hover:bg-blue-900/60 transition-colors cursor-pointer"
              >
                <span>{fighter2.logo} {fighter2.name}</span>
                <span className="text-blue-400 text-xs">&#x2715;</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-grow">
        {FIGHTERS.map(f => {
          const isF1 = fighter1?.id === f.id;
          const isF2 = fighter2?.id === f.id;
          const isSelected = isF1 || isF2;
          const disabled = isSelected || (!!fighter1 && !!fighter2);

          return (
            <div
              key={f.id}
              onClick={() => !disabled && onSelectFighter(f)}
              className={`relative bg-gray-950 border-2 p-4 transition-all duration-200
                ${isSelected
                  ? 'opacity-50 grayscale cursor-not-allowed border-gray-700'
                  : disabled
                  ? 'opacity-30 cursor-not-allowed border-gray-800'
                  : `cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] ${f.borderColor}`
                }`}
            >
              {isF1 && (
                <div className="absolute top-0 right-0 bg-red-600 text-white font-black px-3 py-1 uppercase text-sm">
                  Corner 1
                </div>
              )}
              {isF2 && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white font-black px-3 py-1 uppercase text-sm">
                  Corner 2
                </div>
              )}

              <div className="flex items-center space-x-4 mb-4">
                <div className="text-5xl">{f.logo}</div>
                <div>
                  <h3 className={`text-2xl font-black uppercase ${f.color}`}>{f.name}</h3>
                  <div className="text-xs text-gray-400 italic">"{f.title}"</div>
                </div>
              </div>

              <div className="font-mono text-xs text-gray-300 space-y-1">
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span>Speed:</span> <span className="text-white">{f.tokensPerSecond} t/s</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span>Verbosity:</span> <span className={f.color}>{f.verbosity}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span>Output $/1M:</span> <span className="text-neon-green">${f.outputPer1M.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1">
                  <span>Signature:</span> <span className="text-gray-400">{f.signatureMove}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={onBack}
          className="border-2 border-gray-600 text-gray-400 font-black text-lg px-8 py-3 uppercase hover:border-white hover:text-white transition-colors cursor-pointer"
        >
          Back
        </button>
        {fighter1 && fighter2 && (
          <button
            onClick={onConfirm}
            className="bg-neon-green text-black font-black text-3xl px-12 py-4 border-4 border-black uppercase shadow-[0_0_30px_#39ff14] hover:bg-white hover:shadow-[0_0_40px_white] transition-all cursor-pointer animate-bounce"
          >
            Confirm Matchup
          </button>
        )}
      </div>
    </div>
  );
}
