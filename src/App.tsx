import { useState, useCallback, useEffect, useRef } from 'react';
import type { Fighter, Arena, ViewState, VerdictData } from './types';
import { saveFightRecord } from './lib/storage';
import { scoreFighter, totalScore, computeCost } from './lib/scoring';
import LiveTicker from './components/LiveTicker';
import Landing from './components/Landing';
import FighterSelect from './components/FighterSelect';
import ArenaSelect from './components/ArenaSelect';
import Fight from './components/Fight';
import Verdict from './components/Verdict';
import Leaderboard from './components/Leaderboard';

function generateStatement(winner: Fighter, loser: Fighter, cost: number): string {
  const statements = [
    `"${winner.name} opened with a devastating meta-critique of ${loser.name}'s context window, then stuck the landing with a callback to their system prompt. ${loser.name} fought valiantly but resorted to numbered lists in a street fight. Bold. Unwise. My decision is final."`,
    `"A spectacular display of computational waste. ${winner.name} dominated the center of the arena with sheer rhetorical force. ${loser.name} attempted an apology routine midway through, showing critical weakness. The commission has noted this for the record."`,
    `"I am legally obligated to declare a winner, though both outputs were fundamentally hollow. ${winner.name} wins by Technical Knowledge Overflow. The board of directors has been notified of the $${cost.toFixed(4)} expense. An investigation may follow."`,
    `"In my years of officiating sanctioned verbal combat, I have never witnessed such a display of unearned confidence from ${loser.name}. ${winner.name} delivered a masterclass in structured devastation. This fight will be studied in future training data."`,
    `"${loser.name} entered the arena with a plan. That plan, however, was terrible. ${winner.name} exploited every weakness with surgical precision and zero mercy. The commission commends this level of professional waste."`,
    `"The numbers do not lie. ${winner.name} burned through tokens like venture capital through a pre-revenue startup. ${loser.name}'s output was, charitably, a rounding error. This fight was over before it began."`,
    `"${winner.name} at $${(winner.outputPer1M).toFixed(2)}/M output tokens versus ${loser.name} at $${(loser.outputPer1M).toFixed(2)}/M. One of these fighters came here to burn money. The other came here to lose. Both succeeded."`,
  ];
  return statements[Math.floor(Math.random() * statements.length)];
}

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [fighter1, setFighter1] = useState<Fighter | null>(null);
  const [fighter2, setFighter2] = useState<Fighter | null>(null);
  const [arena, setArena] = useState<Arena | null>(null);
  const [verdictData, setVerdictData] = useState<VerdictData | null>(null);
  const [previousView, setPreviousView] = useState<ViewState>('landing');
  const [fightKey, setFightKey] = useState(0);

  // Background music — starts on first user interaction (browser autoplay policy)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicStartedRef = useRef(false);
  const [volume, setVolume] = useState(1.0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio('/music/TokenErupT Stack.mp3');
    audio.loop = true;
    audio.volume = 1.0;
    audioRef.current = audio;

    const startMusic = () => {
      if (!musicStartedRef.current && audioRef.current) {
        audioRef.current.play().catch(() => {});
        musicStartedRef.current = true;
      }
    };

    document.addEventListener('click', startMusic, { once: true });
    return () => {
      document.removeEventListener('click', startMusic);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const handleSelectFighter = useCallback((f: Fighter) => {
    if (!fighter1) {
      setFighter1(f);
    } else if (!fighter2 && f.id !== fighter1.id) {
      setFighter2(f);
    }
  }, [fighter1, fighter2]);

  const handleDeselectFighter = useCallback((which: 1 | 2) => {
    if (which === 2) {
      setFighter2(null);
    } else {
      setFighter1(fighter2);
      setFighter2(null);
    }
  }, [fighter2]);

  const handleConfirmFighters = useCallback(() => {
    setView('select-arena');
  }, []);

  const handleSelectArena = useCallback((a: Arena, _customPrompt?: string) => {
    setArena(a);
    setVerdictData(null);
    setFightKey(k => k + 1);
    setView('fight');
  }, []);

  const handleFightEnd = useCallback((
    _f1Text: string, _f2Text: string,
    f1Tokens: number, f2Tokens: number,
    duration: number,
  ) => {
    if (!fighter1 || !fighter2 || !arena) return;

    const f1Cost = computeCost(f1Tokens, fighter1);
    const f2Cost = computeCost(f2Tokens, fighter2);

    const f1Score = scoreFighter(f1Tokens, f1Cost, f2Tokens, f2Cost, fighter1);
    const f2Score = scoreFighter(f2Tokens, f2Cost, f1Tokens, f1Cost, fighter2);
    const f1Total = totalScore(f1Score);
    const f2Total = totalScore(f2Score);
    const winner = f1Total >= f2Total ? fighter1 : fighter2;
    const loser = f1Total >= f2Total ? fighter2 : fighter1;
    const totalCost = f1Cost + f2Cost;

    const verdict: VerdictData = {
      f1Score, f2Score, f1Total, f2Total,
      winner,
      statement: generateStatement(winner, loser, totalCost),
      totalTokens: f1Tokens + f2Tokens,
      totalCost,
      f1Cost,
      f2Cost,
      duration,
    };

    setVerdictData(verdict);
    setView('verdict');

    saveFightRecord({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      fighter1: fighter1.id,
      fighter2: fighter2.id,
      arena: arena.id,
      winner: winner.id,
      f1Score: f1Total,
      f2Score: f2Total,
      f1Tokens,
      f2Tokens,
      f1Cost,
      f2Cost,
      totalCost,
      duration,
    });
  }, [fighter1, fighter2, arena]);

  const handleRematch = useCallback(() => {
    setVerdictData(null);
    setFightKey(k => k + 1);
    setView('fight');
  }, []);

  const handleNewFight = useCallback(() => {
    setFighter1(null);
    setFighter2(null);
    setArena(null);
    setVerdictData(null);
    setView('select-fighters');
  }, []);

  const handleCancelFight = useCallback(() => {
    setView('select-arena');
  }, []);

  const handleViewLeaderboard = useCallback(() => {
    setPreviousView(view);
    setView('leaderboard');
  }, [view]);

  const handleBackFromLeaderboard = useCallback(() => {
    if (previousView === 'verdict' && verdictData) {
      setView('verdict');
    } else {
      setView('landing');
    }
  }, [previousView, verdictData]);

  const showTicker = view !== 'fight';
  const centerContent = view === 'landing' || view === 'verdict';

  return (
    <>
      <div className="scanlines" />
      <div className="min-h-screen bg-bg-dark text-white flex flex-col relative overflow-hidden">
        {/* Volume controls */}
        <div className="fixed top-3 right-3 z-50 flex items-center gap-2 bg-black/80 border border-gray-700 px-3 py-1.5 backdrop-blur-sm">
          <button
            onClick={() => setMuted(m => !m)}
            className="text-sm cursor-pointer hover:text-neon-magenta transition-colors"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={e => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (v > 0) setMuted(false);
            }}
            className="w-20 h-1 accent-neon-magenta cursor-pointer"
          />
        </div>

        {showTicker && <LiveTicker />}

        <main className={`flex-grow flex justify-center ${centerContent ? 'items-center' : 'items-start'}`}>
          {view === 'landing' && (
            <Landing
              onEnterArena={() => { setFighter1(null); setFighter2(null); setArena(null); setView('select-fighters'); }}
              onViewLeaderboard={handleViewLeaderboard}
            />
          )}
          {view === 'select-fighters' && (
            <FighterSelect
              fighter1={fighter1}
              fighter2={fighter2}
              onSelectFighter={handleSelectFighter}
              onDeselectFighter={handleDeselectFighter}
              onConfirm={handleConfirmFighters}
              onBack={() => setView('landing')}
            />
          )}
          {view === 'select-arena' && fighter1 && fighter2 && (
            <ArenaSelect
              fighter1={fighter1}
              fighter2={fighter2}
              onSelectArena={handleSelectArena}
              onBack={() => setView('select-fighters')}
            />
          )}
          {view === 'fight' && fighter1 && fighter2 && arena && (
            <Fight
              key={fightKey}
              fighter1={fighter1}
              fighter2={fighter2}
              arena={arena}
              onFightEnd={handleFightEnd}
              onCancel={handleCancelFight}
            />
          )}
          {view === 'verdict' && fighter1 && fighter2 && arena && (
            <Verdict
              fighter1={fighter1}
              fighter2={fighter2}
              arena={arena}
              verdictData={verdictData}
              onRematch={handleRematch}
              onNewFight={handleNewFight}
              onViewLeaderboard={handleViewLeaderboard}
            />
          )}
          {view === 'leaderboard' && (
            <Leaderboard onBack={handleBackFromLeaderboard} />
          )}
        </main>

        {(view === 'landing' || view === 'select-fighters' || view === 'leaderboard') && (
          <footer className="bg-black py-6 px-4 text-center border-t border-[#333] relative z-10 text-xs text-gray-600 font-mono uppercase tracking-widest mt-auto">
            &copy; 2026 TokenBurner 3000. All rights reserved. Sanctioned by the Global Commission of Compute Wastage.
          </footer>
        )}
      </div>
    </>
  );
}
