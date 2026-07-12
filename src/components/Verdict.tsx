import { useEffect, useState } from 'react';
import { Brain, ChevronRight, Crown, Drama, Flame, Map as MapIcon, MessageSquare, RadioTower, RotateCcw, Share2, Swords, Trophy } from 'lucide-react';
import type { Arena, CompetitionProgram, Fighter, FightRules, VerdictData } from '../types';
import { getFighterById } from '../data/fighters';
import { majorEvents } from '../lib/fightEngine';
import { arenaArt } from '../lib/presentation';
import FighterPortrait from './FighterPortrait';

interface VerdictProps {
  fighter1: Fighter;
  fighter2: Fighter;
  arena: Arena;
  rules: FightRules;
  competition: CompetitionProgram | null;
  onContinueProgram: () => void;
  onRematch: () => void;
  onAlternateArena: () => void;
  onNewFight: () => void;
  onViewLeaderboard: () => void;
  verdictData: VerdictData | null;
}

type VerdictPanel = 'summary' | 'scores' | 'timeline' | 'receipt';

export default function Verdict({
  fighter1, fighter2, arena, rules, competition, onContinueProgram, onRematch, onAlternateArena, onNewFight, onViewLeaderboard, verdictData,
}: VerdictProps) {
  const [showVerdict, setShowVerdict] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [replayEvent, setReplayEvent] = useState<VerdictData['events'][number] | null>(null);
  const [panel, setPanel] = useState<VerdictPanel>('summary');
  useEffect(() => { const timer = window.setTimeout(() => setShowVerdict(true), 350); return () => window.clearTimeout(timer); }, []);

  if (!showVerdict || !verdictData) return <div className="judging-screen"><div>JUDGING</div><p>THE EVENT LOG IS UNDER FORMAL REVIEW</p></div>;

  const { f1Score, f2Score, f1Total, f2Total, winner, result, statement, totalTokens, totalCost, f1Cost, f2Cost, duration } = verdictData;
  const timeline = majorEvents(verdictData.events);
  const signatureReplay = timeline.find(event => event.type === 'signature');
  const decisionLabel = result === 'draw' || !winner ? 'OFFICIAL DRAW' : `${winner.name} WINS`;

  const replaySignature = () => {
    if (!signatureReplay) return;
    setReplayEvent(signatureReplay);
    window.setTimeout(() => setReplayEvent(null), 2200);
  };

  const shareResult = async () => {
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 630;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ff00ff'; ctx.lineWidth = 10; ctx.strokeRect(18, 18, 1164, 594);
    ctx.font = 'bold 36px monospace'; ctx.fillStyle = '#39ff14'; ctx.fillText('TOKENBURNER 3000 · OFFICIAL RESULT', 60, 80);
    ctx.font = 'bold 64px sans-serif'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.fillText(`${fighter1.name}  ${f1Total} — ${f2Total}  ${fighter2.name}`, 600, 220);
    ctx.font = 'bold 54px sans-serif'; ctx.fillStyle = '#00ffff';
    ctx.fillText(result === 'draw' ? 'DRAW' : `${winner?.name} WINS BY DECISION`, 600, 330);
    ctx.font = '28px monospace'; ctx.fillStyle = '#ff5e00'; ctx.fillText(arena.name, 600, 400);
    ctx.fillStyle = '#aaaaaa'; ctx.fillText(`${totalTokens.toLocaleString()} TOKENS · ${totalCost == null ? 'COST UNDER REVIEW' : `$${totalCost.toFixed(5)} EVAPORATED`}`, 600, 470);
    ctx.fillStyle = '#666666'; ctx.font = '22px monospace'; ctx.fillText('SANCTIONED COMPUTATIONAL WASTE', 600, 550);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return;
    const file = new File([blob], 'tokenburner-result.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ title: 'TokenBurner 3000 Result', text: statement, files: [file] }); setShareStatus('RESULT TRANSMITTED'); return; } catch { /* User cancelled or sharing failed; fall back. */ }
    }
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = file.name; link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000); setShareStatus('RESULT CARD DOWNLOADED');
  };

  return (
    <div className={`verdict-screen verdict-show screen-layout ${result === 'draw' ? 'is-draw' : 'has-winner'} fade-in`}>
      <img className="verdict-backdrop" src={arenaArt(arena.id)} alt="" />
      <div className="verdict-backdrop-shade" />
      <div className="verdict-frame">
        <header className="verdict-broadcast-header"><div className="commission-kicker">{verdictData.mode === 'live' ? 'SANCTIONED LIVE · PROVIDER-METERED DECISION' : `LEAGUE-CERTIFIED DECISION · SEED ${verdictData.seed}`}</div><h2>THE VERDICT</h2><span>{arena.name} · {rules.venue.toUpperCase()}</span></header>

        <div className="verdict-showcase">
          <Score fighter={fighter1} total={f1Total} opponent={f2Total} side="red" won={winner?.id === fighter1.id} />
          <section className="verdict-decision-core" aria-label={decisionLabel}>
            <span>{result === 'draw' ? 'SCORECARDS LEVEL' : 'WINNER BY DECISION'}</span>
            <strong>{decisionLabel}</strong>
            {winner && <FighterPortrait fighterId={winner.id} fighterName={winner.name} className="winner-medallion" eager />}
            <div><b>{totalTokens.toLocaleString()}</b><small>TOKENS DESTROYED</small></div>
            <div><b>{totalCost == null ? 'UNDER REVIEW' : `$${totalCost.toFixed(4)}`}</b><small>CAPITAL EVAPORATED</small></div>
          </section>
          <Score fighter={fighter2} total={f2Total} opponent={f1Total} side="blue" won={winner?.id === fighter2.id} />
        </div>

        <div className="verdict-tabs" role="tablist" aria-label="Verdict sections">
          {(['summary', 'scores', 'timeline', 'receipt'] as const).map(item => <button key={item} role="tab" aria-selected={panel === item} onClick={() => setPanel(item)}>{item}</button>)}
        </div>

        {replayEvent && <div className="replay-notice" role="status"><span>SIGNATURE REPLAY</span><strong>{replayEvent.headline}</strong><small>{replayEvent.detail}</small></div>}

        <div className="verdict-panel" role="tabpanel" aria-label={`${panel} verdict panel`}>
          {panel === 'summary' && <>
            <section className="referee-report">
              <header><RadioTower aria-hidden="true" /><div><span>REFEREE STATEMENT</span><b>UNABRIDGED OFFICIAL REPORT</b></div></header>
              <p>{statement}</p>
            </section>

            {competition && (
              <section className="program-verdict">
                <span>{competition.completed ? 'PROGRAM COMPLETE' : `PROGRAM BOUT ${competition.currentIndex + 1}`}</span>
                <h3>{competition.title}</h3>
                <div>{Object.entries(competition.scores).map(([id, score]) => <b key={id}>{getFighterById(id)?.name ?? id}: {score}</b>)}</div>
                {competition.completed && <strong>{competition.championId ? `${getFighterById(competition.championId)?.name ?? competition.championId} WINS THE PROGRAM` : 'PROGRAM ENDS LEVEL'}</strong>}
              </section>
            )}

            {(verdictData.turningPoint || verdictData.biggestBurn) && (
              <div className="highlight-grid">
                {verdictData.turningPoint && <div><span>TURNING POINT</span><b>{verdictData.turningPoint.headline}</b><small>{verdictData.turningPoint.detail}</small></div>}
                {verdictData.biggestBurn && <div><span>BIGGEST BURN SWING</span><b>{verdictData.biggestBurn.headline}</b><small>{verdictData.biggestBurn.detail}</small></div>}
              </div>
            )}

            <div className="verdict-jump-grid" aria-label="Explore the official report">
              <button onClick={() => setPanel('scores')}><span>01</span><b>Inspect Scorecards</b><ChevronRight aria-hidden="true" /></button>
              <button onClick={() => setPanel('timeline')}><span>02</span><b>Review Incident Tape</b><ChevronRight aria-hidden="true" /></button>
              <button onClick={() => setPanel('receipt')}><span>03</span><b>Audit The Burn</b><ChevronRight aria-hidden="true" /></button>
            </div>
          </>}

          {panel === 'scores' && <><div className="category-card"><ScoreDetails fighter={fighter1} scores={f1Score} /><ScoreDetails fighter={fighter2} scores={f2Score} /></div><JudgeCards fighter1={fighter1} fighter2={fighter2} f1={f1Score} f2={f2Score} /></>}

          {panel === 'timeline' && <section className="event-timeline">
            <h3>OFFICIAL EVENT TIMELINE</h3>
            {timeline.length === 0 ? <p>No major incidents. A clean and suspiciously professional bout.</p> : timeline.map(event => (
              <div key={event.id}><time>{Math.floor(event.elapsed)}s</time><span>{event.type}</span><b>{event.headline}</b><small>{event.detail}</small></div>
            ))}
          </section>}

          {panel === 'receipt' && <div className="compute-receipt">
            <b>{verdictData.mode === 'live' ? 'PROVIDER-METERED COMPUTE RECEIPT' : 'OFFICIAL COMPUTE RECEIPT'}</b>
            <span>Arena: {arena.name}</span>{rules.customPrompt && <span>Mandate: {rules.customPrompt}</span>}
            <span>Duration: {duration.toFixed(2)}s</span><span>Tokens Obliterated: {totalTokens.toLocaleString()}</span>
            <span>{fighter1.name}: {f1Cost == null ? 'COMMISSION REVIEW' : `$${f1Cost.toFixed(5)}`}</span>
            <span>{fighter2.name}: {f2Cost == null ? 'COMMISSION REVIEW' : `$${f2Cost.toFixed(5)}`}</span>
            <span>Total Capital Evaporated: <strong>{totalCost == null ? 'PARTIALLY UNPRICED' : `$${totalCost.toFixed(5)}`}</strong></span>
            {verdictData.liveUsage && <>
              <span>{fighter1.name}: {verdictData.liveUsage.fighter1.inputTokens} input + {verdictData.liveUsage.fighter1.outputTokens} output · {verdictData.liveUsage.fighter1.provider}/{verdictData.liveUsage.fighter1.model}</span>
              <span>{fighter2.name}: {verdictData.liveUsage.fighter2.inputTokens} input + {verdictData.liveUsage.fighter2.outputTokens} output · {verdictData.liveUsage.fighter2.provider}/{verdictData.liveUsage.fighter2.model}</span>
              <span>Cost provenance: {verdictData.liveUsage.fighter1.costSource} / {verdictData.liveUsage.fighter2.costSource}</span>
            </>}
          </div>}
        </div>

        <div className="verdict-actions">
          {competition && !competition.completed && <button className="program-continue" onClick={onContinueProgram}>{verdictData.result === 'draw' ? 'Replay Drawn Bout' : 'Continue Program'}</button>}
          {!competition && <button onClick={onRematch}><RotateCcw aria-hidden="true" /> Rematch</button>}
          {!competition && <button onClick={onAlternateArena}><MapIcon aria-hidden="true" /> Alternate Arena</button>}
          {signatureReplay && <button onClick={replaySignature}><Swords aria-hidden="true" /> Replay Signature</button>}
          <button onClick={onViewLeaderboard}><Trophy aria-hidden="true" /> Hall of Shame</button>
          <button onClick={shareResult}><Share2 aria-hidden="true" /> Share Result</button>
          <button onClick={onNewFight}><Crown aria-hidden="true" /> New Fight</button>
        </div>
        {shareStatus && <div className="share-status" role="status">{shareStatus}</div>}
      </div>
    </div>
  );
}

function Score({ fighter, total, opponent, side, won }: { fighter: Fighter; total: number; opponent: number; side: 'red' | 'blue'; won: boolean }) {
  return (
    <article className={`verdict-fighter-card ${side} ${won ? 'is-winner' : ''}`}>
      <FighterPortrait fighterId={fighter.id} fighterName={fighter.name} className="verdict-fighter-portrait" eager />
      <div className="verdict-fighter-shade" />
      <div className="verdict-fighter-name"><span>{side.toUpperCase()} CORNER</span><h3>{fighter.name}</h3><small>“{fighter.title}”</small></div>
      <div className="verdict-fighter-score"><strong className={total >= opponent ? 'leading' : ''}>{total}</strong><small>/50</small></div>
      {won && <div className="decision-winner"><Crown aria-hidden="true" /> DECISION WINNER</div>}
    </article>
  );
}

function ScoreDetails({ fighter, scores }: { fighter: Fighter; scores: VerdictData['f1Score'] }) {
  return <div><h4>{fighter.name}</h4><p><span><Flame /> Devastation</span><b>{scores.dev}</b></p><p><span><Drama /> Commitment</span><b>{scores.com}</b></p><p><span><Brain /> Creativity</span><b>{scores.cre}</b></p><p><span><MessageSquare /> Efficiency</span><b>{scores.eff}</b></p><p><span><Crown /> Main Character</span><b>{scores.mc}</b></p></div>;
}

function JudgeCards({ fighter1, fighter2, f1, f2 }: { fighter1: Fighter; fighter2: Fighter; f1: VerdictData['f1Score']; f2: VerdictData['f2Score'] }) {
  const cards = [
    { name: 'Judge Volume', red: f1.dev + f1.com, blue: f2.dev + f2.com },
    { name: 'Judge Craft', red: f1.cre + f1.mc, blue: f2.cre + f2.mc },
    { name: 'Judge Ledger', red: f1.eff + f1.com, blue: f2.eff + f2.com },
  ];
  return <section className="judge-cards"><h3>JUDGE-BY-JUDGE CARDS</h3><div>{cards.map(card => {
    const call = card.red === card.blue ? 'EVEN' : card.red > card.blue ? fighter1.name : fighter2.name;
    return <article key={card.name}><span>{card.name}</span><b>{card.red}–{card.blue}</b><small>{call}</small></article>;
  })}</div></section>;
}
