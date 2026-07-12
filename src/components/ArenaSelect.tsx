import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPinned, RadioTower, WandSparkles } from 'lucide-react';
import type { Arena, Fighter, FightRules } from '../types';
import { ARENAS } from '../data/arenas';
import { arenaArt } from '../lib/presentation';
import FighterMark from './FighterMark';
import SpectacleCanvas from './LazySpectacleCanvas';

interface ArenaSelectProps {
  fighter1: Fighter;
  fighter2: Fighter;
  effectsEnabled?: boolean;
  onSelectArena: (arena: Arena, rules: FightRules) => void;
  onBack: () => void;
}

export default function ArenaSelect({ fighter1, fighter2, effectsEnabled = true, onSelectArena, onBack }: ArenaSelectProps) {
  const [selectedId, setSelectedId] = useState(ARENAS[0].id);
  const [freestylePrompt, setFreestylePrompt] = useState('');
  const [showFreestyle, setShowFreestyle] = useState(false);
  const [commissionEnabled, setCommissionEnabled] = useState(true);
  const [commentaryEnabled, setCommentaryEnabled] = useState(true);
  const [venue, setVenue] = useState<'global' | 'eu'>('global');
  const selected = ARENAS.find(arena => arena.id === selectedId) ?? ARENAS[0];
  const selectedIndex = ARENAS.findIndex(arena => arena.id === selected.id);

  const rules = (customPrompt = ''): FightRules => ({ customPrompt, commissionEnabled, commentaryEnabled, venue });
  const confirm = () => selected.id === 'freestyle' ? setShowFreestyle(true) : onSelectArena(selected, rules());
  const step = (direction: -1 | 1) => {
    const next = (selectedIndex + direction + ARENAS.length) % ARENAS.length;
    setSelectedId(ARENAS[next].id);
    setShowFreestyle(false);
  };

  return (
    <div className="arena-screen stage-select-screen">
      <img className="stage-select-backdrop" src={arenaArt(selected.id)} alt="" />
      <SpectacleCanvas variant="arena" intensity={.75 + selectedIndex * .12} pulse={selectedIndex + 1} reduced={!effectsEnabled} />
      <div className="stage-select-shade" />

      <header className="stage-select-header">
        <div><span>WORLD CIRCUIT STAGE SELECT</span><h2>CHOOSE THE <b>KILLBOX</b></h2></div>
        <div className="stage-matchup"><FighterMark fighterId={fighter1.id} /><strong>{fighter1.name}</strong><b>VS</b><strong>{fighter2.name}</strong><FighterMark fighterId={fighter2.id} /></div>
      </header>

      <section className="stage-hero" aria-live="polite">
        <button className="stage-arrow" onClick={() => step(-1)} aria-label="Previous arena"><ChevronLeft aria-hidden="true" /></button>
        <div className="stage-title-card" key={selected.id}>
          <div><MapPinned aria-hidden="true" /> STAGE {String(selectedIndex + 1).padStart(2, '0')} / {String(ARENAS.length).padStart(2, '0')}</div>
          <h3>{selected.name}</h3>
          <p>{selected.desc}</p>
          <strong>{selected.ruleSummary}</strong>
          <div className="stage-modifiers">
            <Modifier label="AGGRO" value={selected.modifiers.aggression} />
            <Modifier label="REBUTTAL" value={selected.modifiers.rebuttal} />
            <Modifier label="CREATIVE" value={selected.modifiers.creativity} />
            <Modifier label="VOLUME" value={selected.modifiers.volume} />
          </div>
        </div>
        <button className="stage-arrow" onClick={() => step(1)} aria-label="Next arena"><ChevronRight aria-hidden="true" /></button>
      </section>

      <div className="stage-select-bottom">
        <div className="stage-carousel" role="listbox" aria-label="Fight arenas">
          {ARENAS.map((arena, index) => (
            <button
              key={arena.id}
              type="button"
              role="option"
              aria-selected={arena.id === selected.id}
              data-testid={`arena-${arena.id}`}
              onClick={() => { setSelectedId(arena.id); setShowFreestyle(false); }}
              className={arena.id === selected.id ? 'is-selected' : ''}
            >
              <img src={arenaArt(arena.id)} alt="" />
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{arena.name}</strong>
            </button>
          ))}
        </div>

        <div className="stage-rules-console">
          <div><RadioTower aria-hidden="true" /><span>MATCH CONDITIONS</span></div>
          <label><input type="checkbox" checked={commissionEnabled} onChange={event => setCommissionEnabled(event.target.checked)} /> COMMISSION</label>
          <label><input type="checkbox" checked={commentaryEnabled} onChange={event => setCommentaryEnabled(event.target.checked)} /> COMMENTARY</label>
          <label>VENUE<select value={venue} onChange={event => setVenue(event.target.value as 'global' | 'eu')}><option value="global">GLOBAL</option><option value="eu">EU</option></select></label>
        </div>
      </div>

      {showFreestyle && (
        <div className="freestyle-console stage-freestyle">
          <WandSparkles aria-hidden="true" />
          <h3>GENERATE THE MANDATE</h3>
          <p>The prompt becomes the physical law of this arena.</p>
          <textarea value={freestylePrompt} onChange={event => setFreestylePrompt(event.target.value)} maxLength={500} placeholder="Argue whether hotdogs are sandwiches like your market cap depends on it." autoFocus />
          <div>{freestylePrompt.length}/500</div>
          <button type="button" data-testid="file-mandate" className="primary-action" disabled={!freestylePrompt.trim()} onClick={() => onSelectArena(selected, rules(freestylePrompt.trim()))}>File Mandate</button>
          <button className="secondary-action" onClick={() => setShowFreestyle(false)}>Cancel</button>
        </div>
      )}

      <div className="stage-actions">
        <button onClick={onBack} className="secondary-action">Change Fighters</button>
        <button data-testid="confirm-arena" onClick={confirm} className="primary-action">{selected.id === 'freestyle' ? 'Write Mandate' : 'Sanction This Arena'} <ChevronRight aria-hidden="true" /></button>
      </div>
    </div>
  );
}

function Modifier({ label, value }: { label: string; value: number }) {
  const width = Math.min(100, Math.max(12, value / 1.6 * 100));
  return <div><span>{label}</span><i><b style={{ width: `${width}%` }} /></i><strong>{value.toFixed(2)}×</strong></div>;
}
