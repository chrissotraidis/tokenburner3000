import { useCallback, useEffect, useRef, useState } from 'react';
import type { Arena, CompetitionProgram, Fighter, FightOutcome, FightRules, ViewState, VerdictData } from './types';
import { fighterSnapshot } from './data/fighters';
import { getFighterById } from './data/fighters';
import { ARENAS } from './data/arenas';
import { saveFightRecord, updatePredictionStreak } from './lib/storage';
import { scoreFighter, totalScore } from './lib/scoring';
import { eventModifiersFor, majorEvents, seededRandom } from './lib/fightEngine';
import { configureProgram, createBestOfThree, currentProgramMatchup, loadActiveProgram, recordProgramBout, saveActiveProgram } from './lib/competition';
import LiveTicker from './components/LiveTicker';
import Landing from './components/Landing';
import FightPrograms from './components/FightPrograms';
import FighterSelect from './components/FighterSelect';
import ArenaSelect from './components/ArenaSelect';
import TaleOfTape from './components/TaleOfTape';
import Fight from './components/Fight';
import Verdict from './components/Verdict';
import Leaderboard from './components/Leaderboard';
import AppShell from './components/AppShell';
import LiveSettings from './components/LiveSettings';
import LiveFight from './components/LiveFight';
import { getLiveStatus, loadLiveBudget, loadLiveRoutes, saveLiveBudget, saveLiveRoutes, type FightMode, type LiveStatus } from './lib/live';

const EFFECTS_KEY = 'tokenburner3000_reduce_effects';

function generateStatement(winner: Fighter | null, fighter1: Fighter, fighter2: Fighter, outcome: FightOutcome, arena: Arena): string {
  const major = majorEvents(outcome.events);
  const commissionCount = major.filter(event => event.type === 'commission').length;
  const totalTokens = outcome.f1Tokens + outcome.f2Tokens;
  if (!winner) return `The scorecards are level, the meter is not. ${fighter1.name} and ${fighter2.name} combined for ${totalTokens.toLocaleString()} tokens of highly regulated stalemate in ${arena.name}. Neither corner established enough control to separate competence from expensive theater. The Commission records an official draw and recommends that both machines pretend this was strategic.`;
  const loser = winner.id === fighter1.id ? fighter2 : fighter1;
  const winnerTokens = winner.id === fighter1.id ? outcome.f1Tokens : outcome.f2Tokens;
  const loserTokens = winner.id === fighter1.id ? outcome.f2Tokens : outcome.f1Tokens;
  const tokenLine = winnerTokens === loserTokens
    ? 'Output volume was level, so the judges were forced to examine actual technique.'
    : `${winner.name} finished with ${winnerTokens.toLocaleString()} tokens against ${loserTokens.toLocaleString()}, converting volume into legally recognizable pressure.`;
  const eventNote = commissionCount > 0
    ? ` The Commission entered the contest ${commissionCount} time${commissionCount === 1 ? '' : 's'}; nobody improved, but the paperwork was immaculate.`
    : ' No Commission rescue arrived. The losing corner must own this result without regulatory assistance.';
  return `${winner.name} seized ${arena.name} with ${winner.signature.name} and never returned the keys. ${tokenLine} ${loser.name} showed sufficient activity to remain licensed, but too much of it resembled a progress bar with opinions.${eventNote} Official recommendation: ${winner.name} advances; ${loser.name} should clear its context window and think about what happened.`;
}

function newSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0];
}

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [fighter1, setFighter1] = useState<Fighter | null>(null);
  const [fighter2, setFighter2] = useState<Fighter | null>(null);
  const [arena, setArena] = useState<Arena | null>(null);
  const [rules, setRules] = useState<FightRules>({ customPrompt: '', commissionEnabled: true, venue: 'global', commentaryEnabled: true });
  const [verdictData, setVerdictData] = useState<VerdictData | null>(null);
  const [previousView, setPreviousView] = useState<ViewState>('landing');
  const [fightKey, setFightKey] = useState(0);
  const [fightId, setFightId] = useState(() => crypto.randomUUID());
  const [seed, setSeed] = useState(newSeed);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [competition, setCompetition] = useState<CompetitionProgram | null>(loadActiveProgram);
  const [pendingBestOfThree, setPendingBestOfThree] = useState(false);
  const [reduceEffects, setReduceEffects] = useState(() => localStorage.getItem(EFFECTS_KEY) === 'true');
  const [fightMode, setFightMode] = useState<FightMode>('exhibition');
  const [liveRoutes, setLiveRoutes] = useState(loadLiveRoutes);
  const [liveBudget, setLiveBudget] = useState(loadLiveBudget);
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicStartedRef = useRef(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio('/music/TokenErupT Stack.mp3');
    audio.loop = true; audio.preload = 'auto'; audio.volume = 0.7; audioRef.current = audio;
    const keepLooping = () => {
      audio.currentTime = 0;
      if (musicStartedRef.current) audio.play().catch(() => undefined);
    };
    audio.addEventListener('ended', keepLooping);
    const startMusic = () => {
      if (!musicStartedRef.current && audioRef.current) {
        audioRef.current.play().catch(() => undefined); musicStartedRef.current = true;
      }
    };
    document.addEventListener('click', startMusic, { once: true });
    return () => { document.removeEventListener('click', startMusic); audio.removeEventListener('ended', keepLooping); audio.pause(); };
  }, []);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = muted ? 0 : volume; }, [volume, muted]);
  useEffect(() => {
    localStorage.setItem(EFFECTS_KEY, String(reduceEffects));
    document.documentElement.dataset.effects = reduceEffects ? 'reduced' : 'full';
  }, [reduceEffects]);
  useEffect(() => { getLiveStatus().then(setLiveStatus).catch(() => setLiveStatus(null)); }, []);

  const handleSelectFighter = (fighter: Fighter) => {
    if (!fighter.eligible) return;
    if (!fighter1) { setFighter1(fighter); return; }
    if (!fighter2 && fighter.id !== fighter1.id) setFighter2(fighter);
  };

  const handleDeselectFighter = useCallback((which: 1 | 2) => {
    if (which === 2) setFighter2(null);
    else { setFighter1(fighter2); setFighter2(null); }
  }, [fighter2]);

  const handleSelectArena = useCallback((selectedArena: Arena, selectedRules: FightRules) => {
    setArena(selectedArena); setRules(selectedRules); setVerdictData(null);
    setCompetition(current => {
      if (!current) return current;
      const configured = configureProgram(current, selectedArena.id, selectedRules);
      saveActiveProgram(configured); return configured;
    });
    setFightId(crypto.randomUUID()); setSeed(newSeed()); setPrediction(null); setView('tale-of-tape');
  }, []);

  const loadProgramMatchup = useCallback((program: CompetitionProgram) => {
    const next = currentProgramMatchup(program);
    const red = next ? getFighterById(next.fighter1Id) : undefined;
    const blue = next ? getFighterById(next.fighter2Id) : undefined;
    if (!next || !red || !blue) return;
    setCompetition(program); saveActiveProgram(program); setFighter1(red); setFighter2(blue);
    setVerdictData(null); setPrediction(null); setFightId(crypto.randomUUID()); setSeed(newSeed());
    const savedArena = program.arenaId ? ARENAS.find(item => item.id === program.arenaId) : undefined;
    if (savedArena && program.rules) { setArena(savedArena); setRules(program.rules); setView('tale-of-tape'); }
    else { setArena(null); setView('select-arena'); }
  }, []);

  const beginBestOfThree = useCallback(() => {
    setPendingBestOfThree(true); setCompetition(null); saveActiveProgram(null); setFighter1(null); setFighter2(null); setArena(null); setView('select-fighters');
  }, []);

  const confirmFighters = useCallback(() => {
    if (pendingBestOfThree && fighter1 && fighter2) {
      const program = createBestOfThree(fighter1, fighter2);
      setCompetition(program); saveActiveProgram(program); setPendingBestOfThree(false);
    }
    setView('select-arena');
  }, [fighter1, fighter2, pendingBestOfThree]);

  const handleStartFight = useCallback((filedPrediction: string | null) => {
    setPrediction(filedPrediction); setFightKey(key => key + 1); setView('fight');
  }, []);

  const handleFightEnd = useCallback((outcome: FightOutcome) => {
    if (!fighter1 || !fighter2 || !arena) return;
    const f1Score = scoreFighter(outcome.f1Tokens, outcome.f1Cost, outcome.f2Tokens, outcome.f2Cost, fighter1, arena, eventModifiersFor(outcome.events, fighter1.id), seededRandom(seed ^ 0x13579));
    const f2Score = scoreFighter(outcome.f2Tokens, outcome.f2Cost, outcome.f1Tokens, outcome.f1Cost, fighter2, arena, eventModifiersFor(outcome.events, fighter2.id), seededRandom(seed ^ 0x24680));
    const f1Total = totalScore(f1Score); const f2Total = totalScore(f2Score);
    const result: 'win' | 'draw' = f1Total === f2Total ? 'draw' : 'win';
    const winner = result === 'draw' ? null : f1Total > f2Total ? fighter1 : fighter2;
    const totalCost = outcome.f1Cost == null || outcome.f2Cost == null ? null : outcome.f1Cost + outcome.f2Cost;
    const highlights = majorEvents(outcome.events);
    const turningPoint = highlights.filter(event => event.elapsed >= 15 && event.elapsed <= 50).sort((a, b) => b.priority - a.priority)[0];
    const biggestBurn = highlights.filter(event => event.scoreModifiers?.com).sort((a, b) => Math.abs(b.scoreModifiers?.com ?? 0) - Math.abs(a.scoreModifiers?.com ?? 0))[0];
    const verdict: VerdictData = {
      f1Score, f2Score, f1Total, f2Total, winner, result,
      statement: generateStatement(winner, fighter1, fighter2, outcome, arena),
      totalTokens: outcome.f1Tokens + outcome.f2Tokens, totalCost,
      f1Cost: outcome.f1Cost, f2Cost: outcome.f2Cost, duration: outcome.duration,
      events: outcome.events, seed, turningPoint, biggestBurn,
      mode: outcome.mode ?? fightMode, liveUsage: outcome.liveUsage,
    };
    setVerdictData(verdict); setView('verdict');
    if (competition) {
      const progressed = recordProgramBout(competition, winner?.id ?? null);
      setCompetition(progressed); saveActiveProgram(progressed);
    }
    if (prediction) updatePredictionStreak(result === 'win' && winner?.id === prediction);
    saveFightRecord({
      schemaVersion: 2, id: fightId, seed, timestamp: Date.now(),
      fighter1: fighter1.id, fighter2: fighter2.id,
      fighter1Snapshot: fighterSnapshot(fighter1), fighter2Snapshot: fighterSnapshot(fighter2),
      arena: arena.id, customPrompt: rules.customPrompt, winner: winner?.id ?? null, result,
      f1Score: f1Total, f2Score: f2Total, f1Tokens: outcome.f1Tokens, f2Tokens: outcome.f2Tokens,
      f1Cost: outcome.f1Cost, f2Cost: outcome.f2Cost, totalCost, duration: outcome.duration, events: outcome.events,
      mode: outcome.mode ?? fightMode, liveUsage: outcome.liveUsage,
    });
  }, [arena, competition, fightId, fightMode, fighter1, fighter2, prediction, rules.customPrompt, seed]);

  const rematch = () => {
    setVerdictData(null); setFightId(crypto.randomUUID()); setSeed(newSeed()); setPrediction(null);
    setFightKey(key => key + 1); setView('tale-of-tape');
  };
  const newFight = () => { setFighter1(null); setFighter2(null); setArena(null); setVerdictData(null); setPrediction(null); setView('select-fighters'); };
  const alternateArena = () => { setArena(null); setVerdictData(null); setPrediction(null); setView('select-arena'); };
  const continueProgram = () => { if (competition && !competition.completed) loadProgramMatchup(competition); };
  const exitProgram = () => { setCompetition(null); saveActiveProgram(null); newFight(); };
  const viewLeaderboard = () => { setPreviousView(view); setView('leaderboard'); };
  const backFromLeaderboard = () => setView(previousView === 'verdict' && verdictData ? 'verdict' : 'landing');

  const navigateFromShell = (destination: 'home' | 'exhibition' | 'live' | 'programs' | 'leaderboard') => {
    if (destination === 'leaderboard') { viewLeaderboard(); return; }
    if (destination === 'home') { setView('landing'); return; }
    if (destination === 'programs') { setFightMode('exhibition'); setCompetition(loadActiveProgram()); setView('programs'); return; }
    if (destination === 'live') { setCompetition(null); setFightMode('live'); setView('live-settings'); return; }
    setFightMode('exhibition');
    setPendingBestOfThree(false);
    setCompetition(null);
    setFighter1(null);
    setFighter2(null);
    setArena(null);
    setVerdictData(null);
    setPrediction(null);
    setView('select-fighters');
  };

  const showTicker = view === 'landing';
  return (
    <>
      <div className="crt-shell" aria-hidden="true"><div className="crt-glass" /><div className="scanlines" /></div>
      <AppShell
        view={view}
        volume={volume}
        muted={muted}
        reduceEffects={reduceEffects}
        liveConnected={liveStatus ? Object.values(liveStatus.providers).filter(provider => provider.configured).length : 0}
        onNavigate={navigateFromShell}
        onVolumeChange={setVolume}
        onMutedChange={setMuted}
        onReduceEffectsChange={setReduceEffects}
      >
        <div className={`view-stack ${showTicker ? 'has-ticker' : ''}`}>
          {showTicker && <LiveTicker />}
          <div className="view-stage">
          {view === 'landing' && <Landing effectsEnabled={!reduceEffects} onEnterArena={() => { setFightMode('exhibition'); setPendingBestOfThree(false); setCompetition(null); setFighter1(null); setFighter2(null); setArena(null); setView('select-fighters'); }} onEnterLive={() => { setFightMode('live'); setCompetition(null); setFighter1(null); setFighter2(null); setArena(null); setView('live-settings'); }} onFightPrograms={() => { setFightMode('exhibition'); setCompetition(loadActiveProgram()); setView('programs'); }} onViewLeaderboard={viewLeaderboard} />}
          {view === 'live-settings' && <LiveSettings routes={liveRoutes} budget={liveBudget} status={liveStatus} onRoutesChange={routes => { setLiveRoutes(routes); saveLiveRoutes(routes); }} onBudgetChange={budget => { setLiveBudget(budget); saveLiveBudget(budget); }} onStatusChange={setLiveStatus} onEnter={() => { setFightMode('live'); setFighter1(null); setFighter2(null); setArena(null); setView('select-fighters'); }} onBack={() => setView('landing')} />}
          {view === 'programs' && <FightPrograms activeProgram={competition} onBestOfThree={beginBestOfThree} onStartProgram={loadProgramMatchup} onBack={() => setView('landing')} />}
          {view === 'select-fighters' && <FighterSelect mode={fightMode} liveRoutes={liveRoutes} liveStatus={liveStatus} fighter1={fighter1} fighter2={fighter2} onSelectFighter={handleSelectFighter} onDeselectFighter={handleDeselectFighter} onConfirm={confirmFighters} onBack={() => setView(fightMode === 'live' ? 'live-settings' : pendingBestOfThree ? 'programs' : 'landing')} />}
          {view === 'select-arena' && fighter1 && fighter2 && <ArenaSelect fighter1={fighter1} fighter2={fighter2} effectsEnabled={!reduceEffects} onSelectArena={handleSelectArena} onBack={() => setView('select-fighters')} />}
          {view === 'tale-of-tape' && fighter1 && fighter2 && arena && <TaleOfTape mode={fightMode} liveBudget={liveBudget} fighter1={fighter1} fighter2={fighter2} arena={arena} rules={rules} seed={seed} effectsEnabled={!reduceEffects} onStart={handleStartFight} onBack={() => setView('select-arena')} />}
          {view === 'fight' && fighter1 && fighter2 && arena && (fightMode === 'live' ? <LiveFight key={fightKey} fightId={fightId} seed={seed} fighter1={fighter1} fighter2={fighter2} arena={arena} rules={rules} routes={liveRoutes} budgetUsd={liveBudget} onFightEnd={handleFightEnd} onCancel={() => setView('select-arena')} /> : <Fight key={fightKey} fightId={fightId} seed={seed} fighter1={fighter1} fighter2={fighter2} arena={arena} rules={rules} effectsEnabled={!reduceEffects} onFightEnd={handleFightEnd} onCancel={() => setView('select-arena')} />)}
          {view === 'verdict' && fighter1 && fighter2 && arena && <Verdict fighter1={fighter1} fighter2={fighter2} arena={arena} rules={rules} competition={competition} onContinueProgram={continueProgram} onRematch={rematch} onAlternateArena={alternateArena} onNewFight={competition ? exitProgram : newFight} onViewLeaderboard={viewLeaderboard} verdictData={verdictData} />}
          {view === 'leaderboard' && <Leaderboard onBack={backFromLeaderboard} />}
          </div>
        </div>
      </AppShell>
    </>
  );
}
