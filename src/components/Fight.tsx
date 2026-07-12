import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Arena, Fighter, FighterMode, FightEvent, FightOutcome, FightRules } from '../types';
import { getFighterById } from '../data/fighters';
import {
  appendEvent, createFightSchedule, generateFightChunk, INTERVENTIONS,
  interventionEvent, seededRandom, type InterventionId,
} from '../lib/fightEngine';
import { commentaryForEvent } from '../lib/commentary';
import { arenaArt } from '../lib/presentation';
import FighterMark from './FighterMark';
import FighterPortrait from './FighterPortrait';
import SpectacleCanvas from './LazySpectacleCanvas';

interface FightProps {
  fightId: string;
  seed: number;
  fighter1: Fighter;
  fighter2: Fighter;
  arena: Arena;
  rules: FightRules;
  effectsEnabled: boolean;
  onFightEnd: (outcome: FightOutcome) => void;
  onCancel: () => void;
}

interface PendingIntervention { id: InterventionId; target: string }

function tokensPerTick(tokensPerSecond: number, random: () => number): number {
  return Math.floor(random() * 3) + Math.ceil(tokensPerSecond / 50);
}

function tickInterval(tokensPerSecond: number): number {
  return Math.max(80, Math.round(40000 / tokensPerSecond));
}

function activeMode(fighter: Fighter, index: number): FighterMode | null {
  return fighter.modes?.[index] ?? null;
}

function fighterPrice(fighter: Fighter, mode: FighterMode | null): number | null {
  return mode?.outputPer1M ?? fighter.outputPer1M;
}

function fighterSpeed(fighter: Fighter, mode: FighterMode | null): number {
  return mode?.tokensPerSecond ?? fighter.tokensPerSecond;
}

export default function Fight({
  fightId, seed, fighter1, fighter2, arena, rules, effectsEnabled, onFightEnd, onCancel,
}: FightProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [f1Text, setF1Text] = useState('');
  const [f2Text, setF2Text] = useState('');
  const [f1Tokens, setF1Tokens] = useState(0);
  const [f2Tokens, setF2Tokens] = useState(0);
  const [f1Cost, setF1Cost] = useState<number | null>(fighter1.outputPer1M == null ? null : 0);
  const [f2Cost, setF2Cost] = useState<number | null>(fighter2.outputPer1M == null ? null : 0);
  const [events, setEvents] = useState<FightEvent[]>([]);
  const [commentary, setCommentary] = useState<string[]>([]);
  const [activeBanner, setActiveBanner] = useState<FightEvent | null>(null);
  const [interventionCharges, setInterventionCharges] = useState(2);
  const [pendingIntervention, setPendingIntervention] = useState<PendingIntervention | null>(null);
  const [interventionOpen, setInterventionOpen] = useState(false);
  const [mode1, setMode1] = useState(0);
  const [mode2, setMode2] = useState(0);
  const [boost1Until, setBoost1Until] = useState(0);
  const [boost2Until, setBoost2Until] = useState(0);
  const [tagIn1Until, setTagIn1Until] = useState(0);
  const [tagIn2Until, setTagIn2Until] = useState(0);
  const [isFighting, setIsFighting] = useState(true);

  const elapsed = 60 - timeLeft;
  const schedule = useMemo(
    () => createFightSchedule(fightId, seed, fighter1, fighter2, rules.commissionEnabled, rules.venue),
    [fightId, seed, fighter1, fighter2, rules.commissionEnabled, rules.venue],
  );
  const random1 = useRef(seededRandom(seed ^ 0xa53a9));
  const random2 = useRef(seededRandom(seed ^ 0x9e3779b9));
  const firedIds = useRef(new Set<string>());
  const usedCommentary = useRef(new Set<string>());
  const fightEndedRef = useRef(false);
  const startTimeRef = useRef(0);
  const eventsRef = useRef<FightEvent[]>([]);
  const f1TextRef = useRef(''); const f2TextRef = useRef('');
  const f1DisplayIndexRef = useRef(0); const f2DisplayIndexRef = useRef(0);
  const f1TokensRef = useRef(0); const f2TokensRef = useRef(0);
  const f1CostRef = useRef<number | null>(fighter1.outputPer1M == null ? null : 0);
  const f2CostRef = useRef<number | null>(fighter2.outputPer1M == null ? null : 0);
  const pendingRef = useRef<PendingIntervention | null>(null);
  const leaderRef = useRef<string | null>(null);
  const milestoneRef = useRef(new Set<number>());
  const costGapRef = useRef(false);
  const fightStartFiredRef = useRef(false);
  const phraseCountsRef = useRef<Record<string, Map<string, number>>>({});
  const repetitionFiredRef = useRef(new Set<string>());
  const f1ScrollRef = useRef<HTMLDivElement>(null); const f2ScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { startTimeRef.current = Date.now(); }, []);

  const modeValue1 = activeMode(fighter1, mode1);
  const modeValue2 = activeMode(fighter2, mode2);
  const speed1 = fighterSpeed(fighter1, modeValue1) * (elapsed < boost1Until ? 1.8 : 1);
  const speed2 = fighterSpeed(fighter2, modeValue2) * (elapsed < boost2Until ? 1.8 : 1);
  const displayFighter1 = elapsed < tagIn1Until ? (getFighterById(fighter1.tagInFighterId ?? '') ?? fighter1) : fighter1;
  const displayFighter2 = elapsed < tagIn2Until ? (getFighterById(fighter2.tagInFighterId ?? '') ?? fighter2) : fighter2;

  useEffect(() => { pendingRef.current = pendingIntervention; }, [pendingIntervention]);
  useEffect(() => { eventsRef.current = events; }, [events]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const reveal = (
        target: string,
        indexRef: React.MutableRefObject<number>,
        setText: React.Dispatch<React.SetStateAction<string>>,
        scrollRef: React.RefObject<HTMLDivElement | null>,
      ) => {
        const backlog = target.length - indexRef.current;
        if (backlog <= 0) return;
        const step = Math.min(6, Math.max(1, Math.ceil(backlog / 90)));
        indexRef.current = Math.min(target.length, indexRef.current + step);
        setText(target.slice(0, indexRef.current));
        requestAnimationFrame(() => {
          if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        });
      };
      reveal(f1TextRef.current, f1DisplayIndexRef, setF1Text, f1ScrollRef);
      reveal(f2TextRef.current, f2DisplayIndexRef, setF2Text, f2ScrollRef);
    }, 28);
    return () => window.clearInterval(interval);
  }, []);

  const emit = useCallback((incoming: FightEvent) => {
    setEvents(previous => {
      const next = appendEvent(previous, { ...incoming, timestamp: incoming.timestamp || Date.now() });
      eventsRef.current = next;
      return next;
    });
    setActiveBanner(incoming);
    window.setTimeout(() => setActiveBanner(current => current?.id === incoming.id ? null : current), 3600);
    if (rules.commentaryEnabled && incoming.type !== 'commentary') {
      const line = commentaryForEvent(incoming, [fighter1, fighter2], usedCommentary.current);
      usedCommentary.current.add(line);
      setCommentary(previous => [...previous.slice(-3), line]);
      const commentaryEvent: FightEvent = {
        id: `${incoming.id}:commentary`, timestamp: Date.now(), elapsed: incoming.elapsed + 0.01,
        type: 'commentary', actor: 'commentator', headline: 'COLOR COMMENTARY', detail: line,
        commentaryTags: ['commentary', ...incoming.commentaryTags], accessibleText: line, priority: 3,
      };
      setEvents(previous => appendEvent(previous, commentaryEvent));
    }
  }, [fighter1, fighter2, rules.commentaryEnabled]);

  useEffect(() => {
    if (fightStartFiredRef.current) return;
    fightStartFiredRef.current = true;
    const modifiers = arena.modifiers;
    emit({
      id: `${fightId}:fight-start:system:0`, timestamp: Date.now(), elapsed: 0,
      type: 'fight-start', actor: 'system', headline: `${arena.name} RULES ACTIVE`,
      detail: `${arena.ruleSummary} Scoring profile: aggression ${modifiers.aggression > 1 ? 'boosted' : 'standard'}, rebuttal ${modifiers.rebuttal > 1 ? 'boosted' : 'standard'}, creativity ${modifiers.creativity > 1 ? 'boosted' : 'standard'}, volume ${modifiers.volume > 1 ? 'boosted' : 'standard'}, repetition penalty ×${modifiers.repetitionPenalty.toFixed(1)}.`,
      commentaryTags: ['fight-start', ...arena.phraseTags], accessibleText: `${arena.name} rules are active. ${arena.ruleSummary}`,
      visualCue: 'fight-start', audioCue: 'bell', priority: 5,
    });
  }, [arena, emit, fightId]);

  const trackRepetition = useCallback((fighter: Fighter, chunk: string) => {
    const key = chunk.trim().replace(/\s+/g, ' ');
    const counts = phraseCountsRef.current[fighter.id] ?? new Map<string, number>();
    phraseCountsRef.current[fighter.id] = counts;
    const count = (counts.get(key) ?? 0) + 1;
    counts.set(key, count);
    if (count < 3 || repetitionFiredRef.current.has(fighter.id)) return;
    repetitionFiredRef.current.add(fighter.id);
    emit({
      id: `${fightId}:stall:${fighter.id}:repetition`, timestamp: Date.now(), elapsed,
      type: 'stall', actor: 'system', target: fighter.id, headline: 'REPETITION PENALTY',
      detail: `${fighter.name} has repeated an exchange pattern three times. Creativity and crowd scores are reduced.`,
      scoreModifiers: { cre: -1, mc: -1 }, commentaryTags: ['repetition', ...fighter.loreTags.slice(0, 1)],
      accessibleText: `${fighter.name} receives a repetition penalty.`, visualCue: 'stall', audioCue: 'buzzer', priority: 6,
    });
  }, [elapsed, emit, fightId]);

  useEffect(() => {
    if (!isFighting || elapsed < 8) return;
    const totalTokens = f1Tokens + f2Tokens;
    for (const milestone of [100, 250, 500]) {
      if (totalTokens < milestone || milestoneRef.current.has(milestone)) continue;
      milestoneRef.current.add(milestone);
      emit({
        id: `${fightId}:fighter-output:system:${milestone}`, timestamp: Date.now(), elapsed,
        type: 'fighter-output', actor: 'system', headline: `${milestone} TOKEN MILESTONE`,
        detail: 'The combined burn crosses another officially unnecessary threshold.',
        commentaryTags: ['milestone', 'tokens'], accessibleText: `${milestone} combined tokens generated.`,
        visualCue: 'milestone', audioCue: 'tick', priority: 4,
      });
    }
    const leader = Math.abs(f1Tokens - f2Tokens) >= 8 ? (f1Tokens > f2Tokens ? fighter1 : fighter2) : null;
    if (leader && leaderRef.current && leaderRef.current !== leader.id) {
      emit({
        id: `${fightId}:momentum:${leader.id}:${elapsed}`, timestamp: Date.now(), elapsed,
        type: 'momentum', actor: leader.id, headline: 'LEAD CHANGE',
        detail: `${leader.name} takes the live output lead.`, scoreModifiers: { mc: 1 },
        commentaryTags: ['lead-change', ...leader.loreTags.slice(0, 1)], accessibleText: `${leader.name} takes the lead.`,
        visualCue: 'momentum', audioCue: 'lead-change', priority: 6,
      });
    }
    if (leader) leaderRef.current = leader.id;
    if (!costGapRef.current && f1Cost != null && f2Cost != null && Math.max(f1Cost, f2Cost) > 0.001) {
      const lower = Math.max(Math.min(f1Cost, f2Cost), 0.000001);
      if (Math.max(f1Cost, f2Cost) / lower >= 5) {
        costGapRef.current = true;
        const thrifty = f1Cost < f2Cost ? fighter1 : fighter2;
        emit({
          id: `${fightId}:cost-effect:${thrifty.id}:gap`, timestamp: Date.now(), elapsed,
          type: 'cost-effect', actor: thrifty.id, headline: 'BURN GAP',
          detail: `${thrifty.name} opens a five-to-one cost advantage.`, scoreModifiers: { eff: 1 },
          commentaryTags: ['cost-gap', 'efficiency'], accessibleText: `${thrifty.name} opens a large cost advantage.`,
          visualCue: 'cost-gap', audioCue: 'cache', priority: 6,
        });
      }
    }
  }, [elapsed, emit, f1Cost, f1Tokens, f2Cost, f2Tokens, fightId, fighter1, fighter2, isFighting]);

  useEffect(() => {
    if (!isFighting) return;
    const interval = window.setInterval(() => {
      setTimeLeft(value => {
        if (value <= 1) { setIsFighting(false); return 0; }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isFighting]);

  useEffect(() => {
    if (!isFighting) return;
    const timer = window.setTimeout(() => {
      for (const scheduled of schedule) {
        if (scheduled.fireAt > elapsed || firedIds.current.has(scheduled.id)) continue;
        firedIds.current.add(scheduled.id);
        emit({ ...scheduled, timestamp: Date.now() });
        const targetIsF1 = scheduled.target === fighter1.id || scheduled.actor === fighter1.id;
        const targetIsF2 = scheduled.target === fighter2.id || scheduled.actor === fighter2.id;
        if (scheduled.effect === 'speed-boost') {
          if (targetIsF1) setBoost1Until(elapsed + 7); if (targetIsF2) setBoost2Until(elapsed + 7);
        }
        if (scheduled.effect === 'mode-shift') {
          if (targetIsF1 && fighter1.modes) setMode1(value => (value + 1) % fighter1.modes!.length);
          if (targetIsF2 && fighter2.modes) setMode2(value => (value + 1) % fighter2.modes!.length);
        }
        if (scheduled.effect?.startsWith('mode:')) {
          const modeId = scheduled.effect.split(':')[1];
          if (targetIsF1) setMode1(Math.max(0, fighter1.modes?.findIndex(mode => mode.id === modeId) ?? 0));
          if (targetIsF2) setMode2(Math.max(0, fighter2.modes?.findIndex(mode => mode.id === modeId) ?? 0));
        }
        if (scheduled.effect?.startsWith('tag-in:')) {
          if (targetIsF1) setTagIn1Until(elapsed + 8); if (targetIsF2) setTagIn2Until(elapsed + 8);
        }
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [elapsed, emit, fighter1, fighter2, isFighting, schedule]);

  useEffect(() => {
    if (!isFighting) return;
    const interval = window.setInterval(() => {
      const intervention = pendingRef.current?.target === fighter1.id ? pendingRef.current.id : undefined;
      const sourceFighter = elapsed < tagIn1Until ? displayFighter1 : fighter1;
      const newTokens = tokensPerTick(speed1, random1.current) + (intervention === 'double-down' ? 3 : 0);
      const chunk = generateFightChunk(sourceFighter, fighter2, arena, rules.customPrompt, random1.current, intervention);
      const nextText = f1TextRef.current + chunk;
      trackRepetition(fighter1, chunk);
      const price = fighterPrice(fighter1, modeValue1);
      const signatureAt = schedule.find(item => item.actor === fighter1.id && item.type === 'signature')?.fireAt ?? Number.POSITIVE_INFINITY;
      const costMultiplier = intervention === 'double-down' ? 2 : fighter1.signature.effect === 'cache-hit' && elapsed >= signatureAt ? 0.02 : 1;
      f1TokensRef.current += newTokens; f1TextRef.current = nextText;
      setF1Tokens(f1TokensRef.current);
      if (price != null && f1CostRef.current != null) {
        f1CostRef.current += newTokens * price / 1_000_000 * costMultiplier; setF1Cost(f1CostRef.current);
      }
      if (intervention) { pendingRef.current = null; setPendingIntervention(null); }
    }, tickInterval(speed1));
    return () => window.clearInterval(interval);
  }, [arena, displayFighter1, elapsed, fighter1, fighter2, isFighting, modeValue1, rules.customPrompt, schedule, speed1, tagIn1Until, trackRepetition]);

  useEffect(() => {
    if (!isFighting) return;
    const interval = window.setInterval(() => {
      const intervention = pendingRef.current?.target === fighter2.id ? pendingRef.current.id : undefined;
      const sourceFighter = elapsed < tagIn2Until ? displayFighter2 : fighter2;
      const newTokens = tokensPerTick(speed2, random2.current) + (intervention === 'double-down' ? 3 : 0);
      const chunk = generateFightChunk(sourceFighter, fighter1, arena, rules.customPrompt, random2.current, intervention);
      const nextText = f2TextRef.current + chunk;
      trackRepetition(fighter2, chunk);
      const price = fighterPrice(fighter2, modeValue2);
      const signatureAt = schedule.find(item => item.actor === fighter2.id && item.type === 'signature')?.fireAt ?? Number.POSITIVE_INFINITY;
      const costMultiplier = intervention === 'double-down' ? 2 : fighter2.signature.effect === 'cache-hit' && elapsed >= signatureAt ? 0.02 : 1;
      f2TokensRef.current += newTokens; f2TextRef.current = nextText;
      setF2Tokens(f2TokensRef.current);
      if (price != null && f2CostRef.current != null) {
        f2CostRef.current += newTokens * price / 1_000_000 * costMultiplier; setF2Cost(f2CostRef.current);
      }
      if (intervention) { pendingRef.current = null; setPendingIntervention(null); }
    }, tickInterval(speed2));
    return () => window.clearInterval(interval);
  }, [arena, displayFighter2, elapsed, fighter1, fighter2, isFighting, modeValue2, rules.customPrompt, schedule, speed2, tagIn2Until, trackRepetition]);

  const stableOnFightEnd = useRef(onFightEnd);
  useEffect(() => { stableOnFightEnd.current = onFightEnd; }, [onFightEnd]);
  useEffect(() => {
    if (isFighting || fightEndedRef.current) return;
    fightEndedRef.current = true;
    const verdictEvent: FightEvent = {
      id: `${fightId}:verdict:system:60`, timestamp: Date.now(), elapsed: 60, type: 'verdict', actor: 'system',
      headline: 'FINAL BELL', detail: 'The official event record is closed and delivered to the referee.',
      commentaryTags: ['verdict', 'final-bell'], accessibleText: 'Final bell. The fight has ended.', priority: 10,
    };
    const finalEvents = appendEvent(eventsRef.current, verdictEvent); eventsRef.current = finalEvents; setEvents(finalEvents);
    const timer = window.setTimeout(() => stableOnFightEnd.current({
      f1Text: f1TextRef.current, f2Text: f2TextRef.current,
      f1Tokens: f1TokensRef.current, f2Tokens: f2TokensRef.current,
      f1Cost: f1CostRef.current, f2Cost: f2CostRef.current,
      duration: (Date.now() - startTimeRef.current) / 1000, events: finalEvents, seed,
    }), 500);
    return () => window.clearTimeout(timer);
  }, [fightId, isFighting, seed]);

  const submitIntervention = (id: InterventionId, target: Fighter) => {
    if (!isFighting || interventionCharges <= 0 || pendingRef.current) return;
    const command = interventionEvent(fightId, elapsed, id, target);
    pendingRef.current = { id, target: target.id };
    setPendingIntervention({ id, target: target.id });
    setInterventionCharges(value => Math.max(0, value - 1));
    setInterventionOpen(false);
    emit(command);
  };

  const totalCost = f1Cost == null || f2Cost == null ? null : f1Cost + f2Cost;
  const combinedTokens = f1Tokens + f2Tokens;
  const redMomentum = combinedTokens > 0 ? Math.max(12, Math.min(88, f1Tokens / combinedTokens * 100)) : 50;
  const crowdHeat = Math.min(100, Math.round(18 + elapsed * .75 + events.filter(event => event.priority >= 6).length * 7));
  const phase = timeLeft <= 10 ? 'final-ten' : timeLeft <= 30 ? 'meltdown' : timeLeft <= 45 ? 'overclock' : 'opening';
  const phaseLabel = phase === 'final-ten' ? 'FINAL TEN' : phase === 'meltdown' ? 'MELTDOWN' : phase === 'overclock' ? 'OVERCLOCK' : 'OPENING VOLLEY';
  const spectacleIntensity = phase === 'final-ten' ? 2.7 : phase === 'meltdown' ? 2.1 : phase === 'overclock' ? 1.55 : 1;
  const burnStrength = (fighter: Fighter, mode: FighterMode | null) => {
    const price = fighterPrice(fighter, mode); return price == null ? 1 : Math.max(1, Math.min(5, Math.ceil(price / 10)));
  };

  return (
    <div className={`fight-stage spectacle-fight battle-phase-${phase} ${effectsEnabled ? 'effects-full' : 'effects-reduced'} ${activeBanner ? `event-${activeBanner.visualCue}` : ''}`}>
      <img className="fight-arena-backdrop" src={arenaArt(arena.id)} alt="" />
      <SpectacleCanvas variant="fight" intensity={spectacleIntensity + (activeBanner ? .45 : 0)} pulse={events.length} reduced={!effectsEnabled} />
      <div className="fight-arena-shade" />

      <header className="arcade-hud">
        <div className="w-[38%] text-left min-w-0">
          <div className="text-xs text-red-400 tracking-[0.25em]">RED CORNER</div>
          <div className="fighter-hud-name text-neon-magenta"><FighterPortrait fighterId={displayFighter1.id} fighterName={displayFighter1.name} className="fight-hud-avatar" eager /> <span>{displayFighter1.name}</span></div>
          {modeValue1 && <div className="text-xs text-yellow-300">MODE: {modeValue1.name}</div>}
        </div>
        <div className="text-center">
          <div className={`text-4xl md:text-6xl font-black font-mono ${timeLeft <= 10 ? 'text-neon-red countdown-pulse' : 'text-white'}`}>0:{timeLeft.toString().padStart(2, '0')}</div>
          <div className="text-[10px] text-neon-orange uppercase tracking-widest">{arena.name} · {rules.venue.toUpperCase()}</div>
        </div>
        <div className="w-[38%] text-right min-w-0">
          <div className="text-xs text-blue-400 tracking-[0.25em]">BLUE CORNER</div>
          <div className="fighter-hud-name blue text-neon-cyan"><span>{displayFighter2.name}</span> <FighterPortrait fighterId={displayFighter2.id} fighterName={displayFighter2.name} className="fight-hud-avatar" eager /></div>
          {modeValue2 && <div className="text-xs text-yellow-300">MODE: {modeValue2.name}</div>}
        </div>
      </header>

      <div className="fight-notification" role="status" aria-live="polite" aria-atomic="true">
        <span>{activeBanner ? (activeBanner.type === 'commission' ? 'THE COMMISSION' : activeBanner.type.replace('-', ' ')) : 'FIGHT CONTROL'}</span>
        <strong>{activeBanner?.headline ?? `${arena.name} is live`}</strong>
        <small>{activeBanner?.detail ?? 'Official events will appear here without interrupting the action.'}</small>
      </div>

      <div className="speed-rail"><span style={{ width: `${speed1 / (speed1 + speed2) * 100}%` }} /><span style={{ width: `${speed2 / (speed1 + speed2) * 100}%` }} /></div>

      <div className="battle-vitals">
        <div className="momentum-readout"><span>{fighter1.name}</span><div aria-label={`${fighter1.name} momentum ${Math.round(redMomentum)} percent`}><i style={{ width: `${redMomentum}%` }} /></div><span>{fighter2.name}</span></div>
        <div className="phase-readout"><b>{phaseLabel}</b><span>{timeLeft <= 10 ? 'NO SAFETY LIMITS' : 'BROADCAST PHASE'}</span></div>
        <div className="crowd-readout"><span>CROWD HEAT</span><div><i style={{ width: `${crowdHeat}%` }} /></div><b>{crowdHeat}%</b></div>
      </div>

      <div className="fight-grid">
        <FighterPane fighter={displayFighter1} text={f1Text} tokens={f1Tokens} cost={f1Cost} speed={Math.round(speed1)} burnStrength={burnStrength(fighter1, modeValue1)} scrollRef={f1ScrollRef} />
        <FighterPane fighter={displayFighter2} text={f2Text} tokens={f2Tokens} cost={f2Cost} speed={Math.round(speed2)} burnStrength={burnStrength(fighter2, modeValue2)} scrollRef={f2ScrollRef} blue />
      </div>

      {rules.commentaryEnabled && (
        <div className="commentary-strip" aria-live="polite"><span>COLOR COMMENTARY</span>{commentary.at(-1) ?? 'The booth is reviewing the opening exchange.'}</div>
      )}

      <div className="flex gap-2 mt-2 relative">
        <div className="burn-total flex-grow"><b>LIVE BURN</b> {(f1Tokens + f2Tokens).toLocaleString()} TOKENS · {totalCost == null ? 'COST UNDER COMMISSION REVIEW' : `$${totalCost.toFixed(5)} EVAPORATED`}</div>
        <button className="intervention-button" onClick={() => setInterventionOpen(value => !value)} disabled={!isFighting || interventionCharges <= 0 || !!pendingIntervention}>
          CROWD ACTION ×{interventionCharges}
        </button>
        <button onClick={onCancel} className="forfeit-button">Forfeit</button>
        {interventionOpen && (
          <div className="intervention-panel">
            {INTERVENTIONS.map(item => (
              <div key={item.id} className="intervention-row">
                <div><b>{item.name}</b><small>{item.description}</small></div>
                <button onClick={() => submitIntervention(item.id, fighter1)}>RED</button>
                <button onClick={() => submitIntervention(item.id, fighter2)}>BLUE</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FighterPane({ fighter, text, tokens, cost, speed, burnStrength, scrollRef, blue = false }: {
  fighter: Fighter; text: string; tokens: number; cost: number | null; speed: number; burnStrength: number;
  scrollRef: React.RefObject<HTMLDivElement | null>; blue?: boolean;
}) {
  return (
    <section className={`fighter-pane ${blue ? 'blue-corner' : 'red-corner'}`}>
      <FighterMark fighterId={fighter.id} className="fighter-watermark" />
      <div ref={scrollRef} className="fighter-stream arena-scroll">{text}<span className="stream-cursor">█</span></div>
      <div className="burn-meter" aria-label={`${fighter.name} cost load ${burnStrength} of 5`}>
        <div><span>COST LOAD</span><strong>{cost == null ? 'REVIEW' : `$${cost.toFixed(5)}`}</strong></div>
        <div className="burn-meter-track" aria-hidden="true"><i style={{ width: `${burnStrength * 20}%` }} /></div>
      </div>
      <footer><span>TOKENS <b>{tokens.toLocaleString()}</b></span><span>SPEED <b>{speed} t/s</b></span></footer>
    </section>
  );
}
