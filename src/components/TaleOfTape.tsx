import { useState } from 'react';
import { Activity, ChevronRight, Gauge, Siren, Sparkles } from 'lucide-react';
import type { Arena, Fighter, FightRules } from '../types';
import { displayPrice } from '../data/fighters';
import { getHeadToHead, getPredictionStreak } from '../lib/storage';
import { arenaArt } from '../lib/presentation';
import FighterPortrait from './FighterPortrait';
import SpectacleCanvas from './LazySpectacleCanvas';
import type { FightMode } from '../lib/live';

interface TaleOfTapeProps {
  mode?: FightMode;
  liveBudget?: number;
  fighter1: Fighter;
  fighter2: Fighter;
  arena: Arena;
  rules: FightRules;
  seed: number;
  effectsEnabled?: boolean;
  onStart: (prediction: string | null) => void;
  onBack: () => void;
}

export default function TaleOfTape({ mode = 'exhibition', liveBudget = .25, fighter1, fighter2, arena, rules, seed, effectsEnabled = true, onStart, onBack }: TaleOfTapeProps) {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [hype, setHype] = useState(25);
  const h2h = getHeadToHead(fighter1.id, fighter2.id);
  const risks = [
    ...(rules.commissionEnabled && fighter1.loreTags.includes('export-control') ? [`${fighter1.name}: Export Control eligible`] : []),
    ...(rules.commissionEnabled && fighter2.loreTags.includes('export-control') ? [`${fighter2.name}: Export Control eligible`] : []),
    ...(rules.venue === 'eu' && fighter1.restrictedRegions?.includes('eu') ? [`${fighter1.name}: Region Lock eligible`] : []),
    ...(rules.venue === 'eu' && fighter2.restrictedRegions?.includes('eu') ? [`${fighter2.name}: Region Lock eligible`] : []),
  ];

  return (
    <div className={`tale-screen faceoff-screen hype-${hype} ${hype >= 100 ? 'is-max-hype' : ''}`} data-hype={hype}>
      <img className="faceoff-backdrop" src={arenaArt(arena.id)} alt="" />
      <SpectacleCanvas variant="faceoff" intensity={.9 + hype / 80} pulse={hype} reduced={!effectsEnabled} />
      <div className="faceoff-shade" />

      <header className="faceoff-header"><span>{mode === 'live' ? 'SANCTIONED LIVE · PROVIDER BILLING ARMED' : `VERSUS PROTOCOL · SEED ${seed}`}</span><h2>FACE <b>OFF</b></h2><small>{arena.name} · {rules.venue.toUpperCase()}</small></header>

      <div className="faceoff-stage">
        <FighterDossier fighter={fighter1} side="red" />
        <div className="faceoff-core">
          <span>HEAD TO HEAD</span><strong>{h2h.f1Wins}–{h2h.f2Wins}</strong><small>{h2h.draws} DRAWS</small>
          <b>VS</b>
          <button onClick={() => setHype(value => Math.min(100, value + 25))} disabled={hype >= 100}><Siren aria-hidden="true" /> {hype >= 100 ? 'MAXIMUM HYPE' : 'HYPE THE CROWD'}</button>
          <div className="hype-meter" aria-label={`Crowd hype ${hype} percent`}><i style={{ width: `${hype}%` }} /></div>
        </div>
        <FighterDossier fighter={fighter2} side="blue" />
      </div>

      <div className="faceoff-intel">
        <div><Activity aria-hidden="true" /><span>RULESET</span><strong>{rules.commissionEnabled ? 'COMMISSION CHAOS' : 'PURE COMPETITION'}</strong></div>
        <div><Gauge aria-hidden="true" /><span>PREDICTION STREAK</span><strong>{getPredictionStreak()}</strong></div>
        <div><Sparkles aria-hidden="true" /><span>ARENA LAW</span><strong>{arena.ruleSummary}</strong></div>
      </div>

      {rules.customPrompt && <div className="official-mandate"><span>OFFICIAL MANDATE</span>“{rules.customPrompt}”</div>}
      {mode === 'live' && <div className="live-faceoff-notice"><Siren aria-hidden="true" /><b>REAL TOKEN DIVISION</b><span>Three provider exchanges · ${liveBudget.toFixed(2)} spend guard · counters reconcile from API usage</span></div>}
      {risks.length > 0 && <div className="risk-notice"><b>COMMISSION RISK</b>{risks.join(' · ')}</div>}

      <div className="prediction-box faceoff-prediction">
        <span>CALL THE WINNER</span>
        <button className={prediction === fighter1.id ? 'active red' : ''} onClick={() => setPrediction(fighter1.id)}>{fighter1.name}</button>
        <button className={prediction === fighter2.id ? 'active blue' : ''} onClick={() => setPrediction(fighter2.id)}>{fighter2.name}</button>
      </div>
      <div className="screen-actions faceoff-actions">
        <button className="secondary-action" onClick={onBack}>Back</button>
        <button type="button" data-testid="start-fight" className="primary-action start-fight" onClick={() => onStart(prediction)}>{mode === 'live' ? 'Authorize Real Fight' : 'Release The Fighters'} <ChevronRight aria-hidden="true" /></button>
      </div>
    </div>
  );
}

function FighterDossier({ fighter, side }: { fighter: Fighter; side: 'red' | 'blue' }) {
  return (
    <section className={`fighter-dossier faceoff-fighter ${side}`}>
      <div className="fighter-scanline" />
      <FighterPortrait fighterId={fighter.id} fighterName={fighter.name} className="faceoff-character-art" eager />
      <div className="faceoff-character-shade" />
      <div className="faceoff-identity">
        <FighterPortrait fighterId={fighter.id} fighterName={fighter.name} className="faceoff-avatar" eager />
        <div><span className="corner-call">{side.toUpperCase()} CORNER</span><h3>{fighter.name}</h3><em>“{fighter.title}”</em></div>
      </div>
      <dl>
        <div><dt>AA POWER</dt><dd>{fighter.intelligenceIndex ?? 'UNSEEDED'}</dd></div>
        <div><dt>SPEED</dt><dd>{fighter.tokensPerSecond} t/s</dd></div>
        <div><dt>OUTPUT / 1M</dt><dd>{displayPrice(fighter)}</dd></div>
        <div><dt>SIGNATURE</dt><dd>{fighter.signature.name}</dd></div>
      </dl>
    </section>
  );
}
