import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Gauge, RadioTower, RefreshCw, ShieldAlert, Zap } from 'lucide-react';
import type { Arena, Fighter, FightEvent, FightOutcome, FightRules, LiveUsageBreakdown } from '../types';
import { requestLiveTurn, type FighterLiveRoute, type LiveTurnResult } from '../lib/live';
import { arenaArt } from '../lib/presentation';
import FighterPortrait from './FighterPortrait';

interface LiveFightProps {
  fightId: string;
  seed: number;
  fighter1: Fighter;
  fighter2: Fighter;
  arena: Arena;
  rules: FightRules;
  routes: Record<string, FighterLiveRoute>;
  budgetUsd: number;
  onFightEnd: (outcome: FightOutcome) => void;
  onCancel: () => void;
}

interface Exchange extends LiveTurnResult { fighterId: string; fighterName: string; round: number }
type Phase = 'running' | 'error' | 'complete';

export default function LiveFight({ fightId, seed, fighter1, fighter2, arena, rules, routes, budgetUsd, onFightEnd, onCancel }: LiveFightProps) {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<Phase>('running');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [retryTargets, setRetryTargets] = useState<string[]>([]);
  const exchangesRef = useRef<Exchange[]>([]);
  const startedRef = useRef(false);
  const runningRef = useRef(false);
  const endedRef = useRef(false);
  const startRef = useRef(0);
  const runTargetsRef = useRef<(roundNumber: number, targetIds: string[]) => Promise<void>>(async () => undefined);
  const fighters = useMemo(() => [fighter1, fighter2], [fighter1, fighter2]);

  const totals = useMemo(() => Object.fromEntries(fighters.map(fighter => {
    const own = exchanges.filter(exchange => exchange.fighterId === fighter.id);
    return [fighter.id, {
      input: own.reduce((sum, item) => sum + item.usage.inputTokens, 0),
      output: own.reduce((sum, item) => sum + item.usage.outputTokens, 0),
      total: own.reduce((sum, item) => sum + item.usage.totalTokens, 0),
      cost: own.every(item => item.usage.costUsd != null) ? own.reduce((sum, item) => sum + (item.usage.costUsd ?? 0), 0) : null,
    }];
  })), [exchanges, fighters]);

  const finish = useCallback(() => {
    if (endedRef.current) return;
    const f1Exchanges = exchangesRef.current.filter(exchange => exchange.fighterId === fighter1.id);
    const f2Exchanges = exchangesRef.current.filter(exchange => exchange.fighterId === fighter2.id);
    if (!f1Exchanges.length || !f2Exchanges.length) return;
    endedRef.current = true; setPhase('complete');
    const events: FightEvent[] = [{
      id: `${fightId}:live:start`, timestamp: startRef.current, elapsed: 0, type: 'fight-start', actor: 'system',
      headline: 'SANCTIONED LIVE METER ONLINE', detail: 'Provider responses and provider-reported usage govern this bout.',
      commentaryTags: ['live', 'provider'], accessibleText: 'Sanctioned Live fight started.', priority: 8,
    }, ...exchangesRef.current.map((exchange, index): FightEvent => ({
      id: `${fightId}:live:${exchange.round}:${exchange.fighterId}`, timestamp: startRef.current + exchange.latencyMs,
      elapsed: (Date.now() - startRef.current) / 1000 + index / 100, type: 'fighter-output', actor: exchange.fighterId,
      headline: `ROUND ${exchange.round} · ${exchange.model}`, detail: `${exchange.usage.totalTokens} provider-metered tokens in ${exchange.latencyMs} ms.`,
      commentaryTags: ['live', exchange.provider], accessibleText: `${exchange.fighterName} used ${exchange.usage.totalTokens} tokens.`, priority: 5,
    }))];
    const toUsage = (items: Exchange[]): LiveUsageBreakdown => ({
      inputTokens: items.reduce((sum, item) => sum + item.usage.inputTokens, 0),
      outputTokens: items.reduce((sum, item) => sum + item.usage.outputTokens, 0),
      totalTokens: items.reduce((sum, item) => sum + item.usage.totalTokens, 0),
      cachedTokens: items.reduce((sum, item) => sum + item.usage.cachedTokens, 0),
      reasoningTokens: items.reduce((sum, item) => sum + item.usage.reasoningTokens, 0),
      costSource: items.some(item => item.usage.costSource === 'provider-reported') ? 'provider-reported' : items.some(item => item.usage.costSource === 'price-estimate') ? 'price-estimate' : 'unavailable',
      provider: items.at(-1)?.provider ?? 'unknown', model: items.at(-1)?.model ?? 'unknown',
    });
    const sumCost = (items: Exchange[]) => items.every(item => item.usage.costUsd != null) ? items.reduce((sum, item) => sum + (item.usage.costUsd ?? 0), 0) : null;
    window.setTimeout(() => onFightEnd({
      f1Text: f1Exchanges.map(item => item.text).join('\n\n'), f2Text: f2Exchanges.map(item => item.text).join('\n\n'),
      f1Tokens: f1Exchanges.reduce((sum, item) => sum + item.usage.totalTokens, 0), f2Tokens: f2Exchanges.reduce((sum, item) => sum + item.usage.totalTokens, 0),
      f1Cost: sumCost(f1Exchanges), f2Cost: sumCost(f2Exchanges), duration: (Date.now() - startRef.current) / 1000,
      events, seed, mode: 'live', liveUsage: { fighter1: toUsage(f1Exchanges), fighter2: toUsage(f2Exchanges) },
    }), 650);
  }, [fightId, fighter1.id, fighter2.id, onFightEnd, seed]);

  const runTargets = useCallback(async (roundNumber: number, targetIds: string[]) => {
    if (runningRef.current || endedRef.current) return;
    runningRef.current = true; setPhase('running'); setErrors({}); setRetryTargets([]); setRound(roundNumber);
    const previous = exchangesRef.current.map(exchange => ({ fighterName: exchange.fighterName, text: exchange.text }));
    const targets = fighters.filter(fighter => targetIds.includes(fighter.id));
    const settled = await Promise.allSettled(targets.map(async fighter => {
      const opponent = fighter.id === fighter1.id ? fighter2 : fighter1;
      const result = await requestLiveTurn({
        fightId, fighterId: fighter.id, fighterName: fighter.name, fighterTitle: fighter.title,
        opponentId: opponent.id, opponentName: opponent.name, arenaName: arena.name, arenaRuleSummary: arena.ruleSummary,
        customPrompt: rules.customPrompt, round: roundNumber, previousExchanges: previous,
        maxOutputTokens: 140, budgetUsd, route: routes[fighter.id],
      });
      return { ...result, fighterId: fighter.id, fighterName: fighter.name, round: roundNumber } as Exchange;
    }));
    const nextErrors: Record<string, string> = {};
    settled.forEach((result, index) => {
      const fighter = targets[index]; if (!fighter) return;
      if (result.status === 'fulfilled') {
        exchangesRef.current = [...exchangesRef.current.filter(item => !(item.round === roundNumber && item.fighterId === fighter.id)), result.value];
      } else nextErrors[fighter.id] = result.reason instanceof Error ? result.reason.message : 'Provider request failed.';
    });
    setExchanges([...exchangesRef.current]); runningRef.current = false;
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors); setRetryTargets(Object.keys(nextErrors)); setPhase('error'); return;
    }
    const completedIds = new Set(exchangesRef.current.filter(item => item.round === roundNumber).map(item => item.fighterId));
    if (completedIds.size < 2) return;
    const accumulatedCost = exchangesRef.current.reduce((sum, item) => sum + (item.usage.costUsd ?? 0), 0);
    if (roundNumber >= 3 || accumulatedCost >= budgetUsd) { finish(); return; }
    window.setTimeout(() => void runTargetsRef.current(roundNumber + 1, [fighter1.id, fighter2.id]), 800);
  }, [arena.name, arena.ruleSummary, budgetUsd, fightId, fighter1, fighter2, fighters, finish, routes, rules.customPrompt]);

  useEffect(() => { runTargetsRef.current = runTargets; }, [runTargets]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startRef.current = Date.now();
    const timer = window.setTimeout(() => void runTargets(1, [fighter1.id, fighter2.id]), 0);
    return () => window.clearTimeout(timer);
  }, [fighter1.id, fighter2.id, runTargets]);

  return (
    <div className="live-fight-screen screen-layout">
      <img className="fight-arena-backdrop" src={arenaArt(arena.id)} alt="" />
      <div className="live-fight-shade" />
      <header className="live-fight-header">
        <div><RadioTower aria-hidden="true" /><span>SANCTIONED LIVE</span><b>ROUND {round} / 3</b></div>
        <strong>PROVIDER METER</strong>
        <div><Gauge aria-hidden="true" /><span>SPEND GUARD</span><b>${budgetUsd.toFixed(2)}</b></div>
      </header>
      <div className="live-fight-rail"><Zap aria-hidden="true" /><b>{phase === 'running' ? 'AWAITING PROVIDER METER' : phase === 'error' ? 'PROVIDER INTERRUPTION' : 'METER RECONCILED'}</b><span>Token counters change only from provider usage metadata.</span></div>

      <div className="live-corners">
        {fighters.map((fighter, index) => {
          const own = exchanges.filter(exchange => exchange.fighterId === fighter.id).sort((a, b) => a.round - b.round);
          const total = totals[fighter.id]; const error = errors[fighter.id];
          return <section className={`live-corner ${index === 0 ? 'red' : 'blue'} ${error ? 'has-error' : ''}`} key={fighter.id}>
            <header><FighterPortrait fighterId={fighter.id} fighterName={fighter.name} className="live-corner-avatar" eager /><div><span>{index === 0 ? 'RED' : 'BLUE'} CORNER · {routes[fighter.id].provider}</span><h2>{fighter.name}</h2><small>{routes[fighter.id].modelId}</small></div></header>
            <div className="live-output-scroll">
              {own.length === 0 && !error && <div className="live-thinking"><RadioTower aria-hidden="true" /> CONTACTING MODEL…</div>}
              {own.map(exchange => <article key={`${exchange.round}-${exchange.requestId ?? exchange.fighterId}`}><span>ROUND {exchange.round} · {exchange.latencyMs}ms</span><p>{exchange.text}</p><small><CheckCircle2 aria-hidden="true" /> {exchange.usage.inputTokens} IN + {exchange.usage.outputTokens} OUT = {exchange.usage.totalTokens} ACTUAL TOKENS</small></article>)}
              {error && <div className="live-provider-error"><ShieldAlert aria-hidden="true" /><b>REQUEST REJECTED</b><p>{error}</p></div>}
            </div>
            <footer><div><span>INPUT</span><b>{total.input.toLocaleString()}</b></div><div><span>OUTPUT</span><b>{total.output.toLocaleString()}</b></div><div><span>ACTUAL TOTAL</span><b>{total.total.toLocaleString()}</b></div><div><span>{own.at(-1)?.usage.costSource === 'provider-reported' ? 'BILLED COST' : 'EST. COST'}</span><b>{total.cost == null ? 'UNPRICED' : `$${total.cost.toFixed(5)}`}</b></div></footer>
          </section>;
        })}
      </div>

      <footer className="live-fight-actions">
        {phase === 'error' && <><button className="primary-action" onClick={() => void runTargets(round, retryTargets)}><RefreshCw aria-hidden="true" /> Retry Failed Corner</button><button disabled={!fighters.every(fighter => exchanges.some(exchange => exchange.fighterId === fighter.id))} onClick={finish}>Accept Early Verdict</button></>}
        {phase === 'running' && <span><AlertTriangle aria-hidden="true" /> Provider requests may already be billed before cancellation.</span>}
        <button onClick={onCancel}>Forfeit Live Bout</button>
      </footer>
    </div>
  );
}
