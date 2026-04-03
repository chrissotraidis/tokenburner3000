import { useState, useEffect } from 'react';
import type { Fighter, Arena, VerdictData } from '../types';

interface VerdictProps {
  fighter1: Fighter;
  fighter2: Fighter;
  arena: Arena;
  onRematch: () => void;
  onNewFight: () => void;
  onViewLeaderboard: () => void;
  verdictData: VerdictData | null;
}

export default function Verdict({
  fighter1, fighter2, arena,
  onRematch, onNewFight, onViewLeaderboard, verdictData,
}: VerdictProps) {
  const [showVerdict, setShowVerdict] = useState(false);

  // Dramatic pause
  useEffect(() => {
    const timer = setTimeout(() => setShowVerdict(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!showVerdict || !verdictData) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] relative z-10">
        <div className="text-center">
          <div className="text-6xl md:text-8xl font-black uppercase text-neon-magenta flicker mb-4">
            Judging...
          </div>
          <p className="text-gray-500 font-mono uppercase tracking-widest">
            The referee is deliberating
          </p>
        </div>
      </div>
    );
  }

  const { f1Score, f2Score, f1Total, f2Total, winner, statement, totalTokens, totalCost, f1Cost, f2Cost, duration } = verdictData;
  const isDraw = f1Total === f2Total;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto relative z-10 w-full fade-in">
      <div className="neon-box-magenta bg-black p-1">
        <div className="border border-gray-800 bg-bg-dark p-6 md:p-10">

          {/* Header */}
          <div className="text-center mb-8 border-b border-gray-800 pb-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-neon-magenta mb-2 flicker">
              The Verdict
            </h2>
            <p className="text-gray-500 font-mono text-sm">LEAGUE-CERTIFIED DECISION</p>
          </div>

          {/* Scoreboard */}
          <div className="flex justify-between items-center mb-10">
            <div className="w-2/5 text-center">
              <div className="text-3xl md:text-4xl font-black uppercase mb-2">{fighter1.name}</div>
              <div className={`text-6xl md:text-8xl font-black font-mono ${f1Total >= f2Total ? 'text-neon-green' : 'text-gray-600'}`}>
                {f1Total}
              </div>
              <div className="text-gray-500 text-sm mt-1">/50</div>
            </div>
            <div className="w-1/5 text-center text-4xl font-black italic text-gray-700">VS</div>
            <div className="w-2/5 text-center">
              <div className="text-3xl md:text-4xl font-black uppercase mb-2">{fighter2.name}</div>
              <div className={`text-6xl md:text-8xl font-black font-mono ${f2Total >= f1Total ? 'text-neon-green' : 'text-gray-600'}`}>
                {f2Total}
              </div>
              <div className="text-gray-500 text-sm mt-1">/50</div>
            </div>
          </div>

          {/* Detailed Categories */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 font-mono text-sm md:text-base border-y border-gray-800 py-6 mb-8 text-gray-300">
            <div className="space-y-2 border-r border-gray-800 pr-4">
              <div className="text-xs uppercase tracking-widest text-neon-magenta font-bold mb-3">{fighter1.logo} {fighter1.name}</div>
              <ScoreLine label="Devastation" emoji="🔥" score={f1Score.dev} />
              <ScoreLine label="Commitment" emoji="🎭" score={f1Score.com} />
              <ScoreLine label="Creativity" emoji="🧠" score={f1Score.cre} />
              <ScoreLine label="Efficiency" emoji="💬" score={f1Score.eff} />
              <ScoreLine label="Main Char" emoji="👑" score={f1Score.mc} />
            </div>
            <div className="space-y-2 pl-4">
              <div className="text-xs uppercase tracking-widest text-neon-cyan font-bold mb-3">{fighter2.logo} {fighter2.name}</div>
              <ScoreLine label="Devastation" emoji="🔥" score={f2Score.dev} />
              <ScoreLine label="Commitment" emoji="🎭" score={f2Score.com} />
              <ScoreLine label="Creativity" emoji="🧠" score={f2Score.cre} />
              <ScoreLine label="Efficiency" emoji="💬" score={f2Score.eff} />
              <ScoreLine label="Main Char" emoji="👑" score={f2Score.mc} />
            </div>
          </div>

          {/* Winner */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-2">
              {isDraw ? 'RESULT' : 'WINNER BY DECISION'}
            </h3>
            <div className="text-5xl md:text-6xl font-black uppercase text-neon-cyan drop-shadow-[0_0_10px_#00ffff] flicker">
              {isDraw ? 'DRAW' : `${winner.logo} ${winner.name} ${winner.logo}`}
            </div>
          </div>

          {/* Referee Statement */}
          <div className="bg-gray-900 border-l-4 border-neon-magenta p-6 mb-8 relative">
            <span className="absolute -top-3 left-4 bg-gray-900 px-2 text-xs font-bold text-neon-magenta uppercase">
              Referee's Statement
            </span>
            <p className="font-serif italic text-lg md:text-xl text-gray-200 leading-relaxed">
              {statement}
            </p>
          </div>

          {/* Receipt */}
          <div className="bg-black border border-dashed border-gray-600 p-4 font-mono text-xs text-gray-500 uppercase flex flex-col items-center mb-8">
            <div className="font-bold mb-2 text-gray-400">--- OFFICIAL COMPUTE RECEIPT ---</div>
            <div>Arena: {arena.name}</div>
            <div>Match Duration: {duration.toFixed(2)}s</div>
            <div>Tokens Obliterated: {totalTokens.toLocaleString()}</div>
            <div className="mt-1">{fighter1.name}: ${f1Cost?.toFixed(4) ?? '0.0000'} ({fighter1.outputPer1M.toFixed(2)}/1M)</div>
            <div>{fighter2.name}: ${f2Cost?.toFixed(4) ?? '0.0000'} ({fighter2.outputPer1M.toFixed(2)}/1M)</div>
            <div className="mt-1">
              Total Capital Evaporated:{' '}
              <span className="text-neon-green font-bold">${totalCost.toFixed(4)}</span>
            </div>
            <div className="mt-2 text-[10px]">Tax ID: 000-WASTE-LOL | Sanctioned by the Global Commission of Compute Wastage</div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={onRematch}
              className="px-6 py-3 border-2 border-neon-cyan text-neon-cyan font-black uppercase hover:bg-neon-cyan hover:text-black transition-colors cursor-pointer"
            >
              Rematch
            </button>
            <button
              onClick={onViewLeaderboard}
              className="px-6 py-3 border-2 border-neon-green text-neon-green font-black uppercase hover:bg-neon-green hover:text-black transition-colors cursor-pointer"
            >
              Hall of Shame
            </button>
            <button
              onClick={onNewFight}
              className="px-6 py-3 border-2 border-gray-500 text-gray-300 font-black uppercase hover:bg-white hover:text-black hover:border-white transition-colors cursor-pointer"
            >
              New Fight
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function ScoreLine({ label, emoji, score }: { label: string; emoji: string; score: number }) {
  return (
    <div className="flex justify-between">
      <span>{emoji} {label}:</span>
      <span>{score}</span>
    </div>
  );
}
