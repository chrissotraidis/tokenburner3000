import { useState, useEffect, useRef } from 'react';
import type { Fighter, Arena } from '../types';
import { MOCK_WORDS } from '../data/mockWords';
import { costPer1k } from '../data/fighters';

interface FightProps {
  fighter1: Fighter;
  fighter2: Fighter;
  arena: Arena;
  onFightEnd: (f1Text: string, f2Text: string, f1Tokens: number, f2Tokens: number, duration: number) => void;
  onCancel: () => void;
}

function generateChunk(fighterId: string): string {
  const pool = MOCK_WORDS[fighterId] || MOCK_WORDS['gpt4o'];
  return pool[Math.floor(Math.random() * pool.length)] + ' ';
}

/** Compute tokens per tick based on model speed */
function tokensPerTick(tokensPerSecond: number): number {
  return Math.floor(Math.random() * 3) + Math.ceil(tokensPerSecond / 50);
}

/** Compute tick interval from tokensPerSecond */
function tickInterval(tokensPerSecond: number): number {
  return Math.round(40000 / tokensPerSecond);
}

export default function Fight({ fighter1, fighter2, arena, onFightEnd, onCancel }: FightProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [f1Text, setF1Text] = useState('');
  const [f2Text, setF2Text] = useState('');
  const [f1Tokens, setF1Tokens] = useState(0);
  const [f2Tokens, setF2Tokens] = useState(0);
  const [isFighting, setIsFighting] = useState(true);

  // Refs to avoid stale closures in the fight-end effect
  const f1TextRef = useRef('');
  const f2TextRef = useRef('');
  const f1TokensRef = useRef(0);
  const f2TokensRef = useRef(0);
  const fightEndedRef = useRef(false);

  const f1ScrollRef = useRef<HTMLDivElement>(null);
  const f2ScrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());

  // Timer — the ONLY way a fight ends
  useEffect(() => {
    if (!isFighting) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsFighting(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFighting]);

  // Fighter 1 streaming
  useEffect(() => {
    if (!isFighting) return;
    const interval = setInterval(() => {
      const newTokens = tokensPerTick(fighter1.tokensPerSecond);
      setF1Tokens(prev => {
        const next = prev + newTokens;
        f1TokensRef.current = next;
        return next;
      });
      setF1Text(prev => {
        const next = prev + generateChunk(fighter1.id);
        f1TextRef.current = next;
        return next;
      });
      if (f1ScrollRef.current) {
        f1ScrollRef.current.scrollTop = f1ScrollRef.current.scrollHeight;
      }
    }, tickInterval(fighter1.tokensPerSecond));
    return () => clearInterval(interval);
  }, [isFighting, fighter1]);

  // Fighter 2 streaming
  useEffect(() => {
    if (!isFighting) return;
    const interval = setInterval(() => {
      const newTokens = tokensPerTick(fighter2.tokensPerSecond);
      setF2Tokens(prev => {
        const next = prev + newTokens;
        f2TokensRef.current = next;
        return next;
      });
      setF2Text(prev => {
        const next = prev + generateChunk(fighter2.id);
        f2TextRef.current = next;
        return next;
      });
      if (f2ScrollRef.current) {
        f2ScrollRef.current.scrollTop = f2ScrollRef.current.scrollHeight;
      }
    }, tickInterval(fighter2.tokensPerSecond));
    return () => clearInterval(interval);
  }, [isFighting, fighter2]);

  // Fight ended — notify parent
  const stableOnFightEnd = useRef(onFightEnd);
  stableOnFightEnd.current = onFightEnd;

  useEffect(() => {
    if (!isFighting && !fightEndedRef.current) {
      fightEndedRef.current = true;
      const duration = (Date.now() - startTimeRef.current) / 1000;
      const timer = setTimeout(() => {
        stableOnFightEnd.current(
          f1TextRef.current,
          f2TextRef.current,
          f1TokensRef.current,
          f2TokensRef.current,
          duration,
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFighting]);

  const f1CostPer1k = costPer1k(fighter1);
  const f2CostPer1k = costPer1k(fighter2);
  const f1Cost = (f1Tokens * f1CostPer1k / 1000).toFixed(4);
  const f2Cost = (f2Tokens * f2CostPer1k / 1000).toFixed(4);

  return (
    <div className="flex flex-col h-[85vh] p-4 relative z-10 w-full max-w-screen-2xl mx-auto">
      {/* HUD Header */}
      <div className="flex justify-between items-center mb-4 bg-black border-2 border-gray-800 p-2">
        <div className="text-xl md:text-3xl font-black text-neon-magenta uppercase tracking-tighter w-1/3 text-center truncate px-2 border-r border-gray-800">
          {fighter1.logo} {fighter1.name}
        </div>
        <div className="w-1/3 text-center flex flex-col items-center justify-center">
          <div className={`text-4xl md:text-6xl font-black font-mono ${timeLeft < 10 ? 'text-neon-red flicker' : 'text-white'}`}>
            0:{timeLeft.toString().padStart(2, '0')}
          </div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{arena.name}</div>
        </div>
        <div className="text-xl md:text-3xl font-black text-neon-cyan uppercase tracking-tighter w-1/3 text-center truncate px-2 border-l border-gray-800">
          {fighter2.name} {fighter2.logo}
        </div>
      </div>

      {/* Speed comparison bar */}
      <div className="flex items-center mb-2 h-2 bg-gray-900 border border-gray-800 overflow-hidden">
        <div
          className="h-full bg-neon-magenta transition-all duration-500"
          style={{ width: `${(fighter1.tokensPerSecond / (fighter1.tokensPerSecond + fighter2.tokensPerSecond)) * 100}%` }}
        />
        <div
          className="h-full bg-neon-cyan transition-all duration-500"
          style={{ width: `${(fighter2.tokensPerSecond / (fighter1.tokensPerSecond + fighter2.tokensPerSecond)) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-gray-600 uppercase mb-2">
        <span>{fighter1.tokensPerSecond} t/s</span>
        <span>Speed</span>
        <span>{fighter2.tokensPerSecond} t/s</span>
      </div>

      {/* Split Screen Arena */}
      <div className="flex-grow flex space-x-2 md:space-x-4 overflow-hidden mb-4">
        {/* Fighter 1 */}
        <div className="w-1/2 flex flex-col border border-gray-800 bg-bg-card relative">
          <div className="absolute top-2 right-2 opacity-10 text-8xl pointer-events-none">{fighter1.logo}</div>
          <div
            ref={f1ScrollRef}
            className={`flex-grow p-4 md:p-6 overflow-y-auto arena-scroll font-mono text-sm md:text-base text-gray-300 leading-relaxed whitespace-pre-wrap ${isFighting ? 'typewriter' : ''}`}
          >
            {f1Text}
          </div>
          <div className="bg-black p-3 border-t border-gray-800 flex justify-between font-mono text-xs md:text-sm">
            <span className="text-gray-500">Tokens: <span className="text-white font-bold">{f1Tokens.toLocaleString()}</span></span>
            <span className="text-gray-500">Cost: <span className="text-neon-green font-bold">${f1Cost}</span></span>
          </div>
        </div>

        {/* Fighter 2 */}
        <div className="w-1/2 flex flex-col border border-gray-800 bg-bg-card relative">
          <div className="absolute top-2 left-2 opacity-10 text-8xl pointer-events-none">{fighter2.logo}</div>
          <div
            ref={f2ScrollRef}
            className={`flex-grow p-4 md:p-6 overflow-y-auto arena-scroll font-mono text-sm md:text-base text-gray-300 leading-relaxed whitespace-pre-wrap ${isFighting ? 'typewriter' : ''}`}
          >
            {f2Text}
          </div>
          <div className="bg-black p-3 border-t border-gray-800 flex justify-between font-mono text-xs md:text-sm">
            <span className="text-gray-500">Tokens: <span className="text-white font-bold">{f2Tokens.toLocaleString()}</span></span>
            <span className="text-gray-500">Cost: <span className="text-neon-green font-bold">${f2Cost}</span></span>
          </div>
        </div>
      </div>

      {/* Global Burn Ticker + Cancel */}
      <div className="flex items-stretch">
        <div className="bg-neon-red text-white font-black uppercase text-center py-2 animate-pulse flex justify-center items-center space-x-8 text-sm md:text-xl flex-grow">
          <span>LIVE MATCH BURN: {(f1Tokens + f2Tokens).toLocaleString()} TOKENS</span>
          <span className="hidden md:inline">|</span>
          <span>
            ${((f1Tokens * f1CostPer1k / 1000) + (f2Tokens * f2CostPer1k / 1000)).toFixed(4)} EVAPORATED
          </span>
        </div>
        <button
          onClick={onCancel}
          className="bg-gray-900 border border-gray-700 text-gray-400 font-bold px-4 uppercase text-xs hover:bg-red-900 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          Forfeit
        </button>
      </div>
    </div>
  );
}
