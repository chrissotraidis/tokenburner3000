import { useMemo, useState } from 'react';
import { ChevronRight, Crosshair, LockKeyhole, Swords } from 'lucide-react';
import type { Fighter, RosterTier } from '../types';
import { displayPrice, FIGHTERS, ROSTER_TIER_LABELS } from '../data/fighters';
import FighterPortrait from './FighterPortrait';
import { isLiveReady, type FightMode, type FighterLiveRoute, type LiveStatus } from '../lib/live';

interface FighterSelectProps {
  mode?: FightMode;
  liveRoutes?: Record<string, FighterLiveRoute>;
  liveStatus?: LiveStatus | null;
  fighter1: Fighter | null;
  fighter2: Fighter | null;
  onSelectFighter: (f: Fighter) => void;
  onDeselectFighter: (which: 1 | 2) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const tiers: RosterTier[] = ['main', 'guest', 'restricted', 'legend'];

export default function FighterSelect({ mode = 'exhibition', liveRoutes = {}, liveStatus = null, fighter1, fighter2, onSelectFighter, onDeselectFighter, onConfirm, onBack }: FighterSelectProps) {
  const [tier, setTier] = useState<RosterTier>('main');
  const visible = useMemo(() => FIGHTERS.filter(fighter => fighter.rosterTier === tier), [tier]);
  const [highlightedId, setHighlightedId] = useState(visible[0]?.id ?? '');
  const highlighted = visible.find(fighter => fighter.id === highlightedId) ?? visible[0] ?? null;

  const choose = (fighter: Fighter) => {
    onSelectFighter(fighter);
    const next = visible.find(candidate => candidate.eligible && (mode !== 'live' || isLiveReady(candidate, liveRoutes, liveStatus)) && candidate.id !== fighter.id && candidate.id !== fighter1?.id);
    if (next) setHighlightedId(next.id);
  };

  const redPreview = fighter1 ?? highlighted;
  const bluePreview = fighter2 ?? (fighter1 ? highlighted : null);

  return (
    <div className="roster-screen arcade-roster screen-layout">
      <header className="roster-broadcast-heading">
        <div><span>{mode === 'live' ? 'SANCTIONED LIVE ROUTING VAULT' : 'GLOBAL COMMISSION FIGHTER VAULT'}</span><strong>CHOOSE YOUR MACHINES</strong></div>
        <div className="roster-step"><b>{fighter1 ? (fighter2 ? 'MATCH LOCKED' : 'BLUE CORNER') : 'RED CORNER'}</b><small>{fighter1 && fighter2 ? 'Ready to sanction' : 'Select a combatant'}</small></div>
      </header>

      <div className="roster-tabs" role="tablist" aria-label="Roster tiers">
        {tiers.map(item => (
          <button key={item} role="tab" aria-selected={tier === item} onClick={() => setTier(item)}>
            {ROSTER_TIER_LABELS[item]} <span>{FIGHTERS.filter(f => f.rosterTier === item).length}</span>
          </button>
        ))}
      </div>

      <div className="fighter-select-arena">
        <FighterPreview fighter={redPreview} side="red" locked={!!fighter1} onClear={fighter1 ? () => onDeselectFighter(1) : undefined} />

        <section className="roster-matrix" aria-label={`${ROSTER_TIER_LABELS[tier]} fighters`}>
          <div className="matrix-crosshair"><Crosshair aria-hidden="true" /> ROSTER MATRIX</div>
          <div className="roster-tile-grid">
            {visible.map((fighter, index) => {
              const isF1 = fighter1?.id === fighter.id;
              const isF2 = fighter2?.id === fighter.id;
              const selected = isF1 || isF2;
              const liveReady = mode !== 'live' || isLiveReady(fighter, liveRoutes, liveStatus);
              const disabled = !fighter.eligible || !liveReady || selected || (!!fighter1 && !!fighter2);
              return (
                <button
                  key={fighter.id}
                  type="button"
                  data-testid={`fighter-${fighter.id}`}
                  disabled={disabled}
                  onMouseEnter={() => setHighlightedId(fighter.id)}
                  onFocus={() => setHighlightedId(fighter.id)}
                  onClick={() => choose(fighter)}
                  className={`roster-tile ${highlighted?.id === fighter.id ? 'is-highlighted' : ''} ${selected ? 'is-selected' : ''} ${!fighter.eligible ? 'is-restricted' : ''} ${!liveReady ? 'is-unrouted' : ''}`}
                  aria-label={`${fighter.name}, ${fighter.title}${!liveReady ? ', needs live route' : ''}${isF1 ? ', red corner' : isF2 ? ', blue corner' : ''}`}
                >
                  <span className="tile-number">{String(index + 1).padStart(2, '0')}</span>
                  <FighterPortrait fighterId={fighter.id} fighterName={fighter.name} className="tile-portrait" />
                  <span className="tile-nameplate"><strong>{fighter.name}</strong><small>{fighter.provider}</small></span>
                  {!fighter.eligible && <LockKeyhole className="tile-lock" aria-hidden="true" />}
                  {mode === 'live' && fighter.eligible && <span className={`tile-live-state ${liveReady ? 'ready' : ''}`}>{liveReady ? 'LIVE' : 'ROUTE'}</span>}
                  {isF1 && <i>RED</i>}{isF2 && <i>BLUE</i>}
                </button>
              );
            })}
          </div>
          <div className="matrix-readout">
            <span>{highlighted?.signature.name ?? 'NO SIGNAL'}</span>
            <b>{mode === 'live' && highlighted && !isLiveReady(highlighted, liveRoutes, liveStatus) ? 'Configure this fighter route in Sanctioned Live settings.' : highlighted?.signature.description ?? 'Select an eligible fighter.'}</b>
          </div>
        </section>

        <FighterPreview fighter={bluePreview} side="blue" locked={!!fighter2} onClear={fighter2 ? () => onDeselectFighter(2) : undefined} />
      </div>

      <div className="selection-dock arcade-selection-dock">
        <button onClick={onBack} className="secondary-action">Back</button>
        <div className="matchup-lock"><Swords aria-hidden="true" /><span>{fighter1?.name ?? 'RED TBD'}</span><b>VS</b><span>{fighter2?.name ?? 'BLUE TBD'}</span></div>
        <button onClick={onConfirm} className="primary-action" disabled={!fighter1 || !fighter2}>Confirm Matchup <ChevronRight aria-hidden="true" /></button>
      </div>
    </div>
  );
}

function FighterPreview({ fighter, side, locked, onClear }: { fighter: Fighter | null; side: 'red' | 'blue'; locked: boolean; onClear?: () => void }) {
  if (!fighter) return <aside className={`fighter-preview ${side} is-empty`}><Crosshair aria-hidden="true" /><strong>AWAITING TARGET</strong><small>Move through the roster matrix</small></aside>;
  const intelligence = fighter.intelligenceIndex ?? 40;
  const speed = Math.min(100, fighter.tokensPerSecond / 1.8);
  const cost = fighter.outputPer1M == null ? 16 : Math.min(100, fighter.outputPer1M * 2);
  return (
    <aside className={`fighter-preview ${side} ${locked ? 'is-locked' : ''}`}>
      <div className="preview-corner"><span>{side.toUpperCase()} CORNER</span>{locked && <b>LOCKED</b>}</div>
      <div className="preview-character"><FighterPortrait fighterId={fighter.id} fighterName={fighter.name} className="preview-portrait" eager /></div>
      <div className="preview-provider">{fighter.provider} · {fighter.availability}</div>
      <h2>{fighter.name}</h2>
      <em>“{fighter.title}”</em>
      <dl className="preview-stats">
        <Stat label="POWER" value={intelligence} display={fighter.intelligenceIndex ?? 'UNSEEDED'} />
        <Stat label="SPEED" value={speed} display={`${fighter.tokensPerSecond} t/s`} />
        <Stat label="BURN" value={cost} display={displayPrice(fighter)} />
      </dl>
      <div className="preview-signature"><span>SIGNATURE MOVE</span><strong>{fighter.signature.name}</strong><small>{fighter.signature.description}</small></div>
      {onClear && <button className="preview-clear" onClick={onClear}>Release corner</button>}
    </aside>
  );
}

function Stat({ label, value, display }: { label: string; value: number; display: string | number }) {
  return <div><dt>{label}</dt><dd>{display}</dd><span><i style={{ width: `${Math.max(8, Math.min(100, value))}%` }} /></span></div>;
}
