import { useState } from 'react';
import { Banknote, Crown, Flame, Shield, Target, Trophy } from 'lucide-react';
import { SELECTABLE_FIGHTERS } from '../data/fighters';
import { getFightRecords, getHeadToHead, getLeaderboard, type LeaderboardEntry } from '../lib/storage';
import FighterPortrait from './FighterPortrait';

interface LeaderboardProps { onBack: () => void }

const awards = [
  { key: 'winRate', label: 'Overall Champion', icon: Crown, value: (entry: LeaderboardEntry) => `${entry.winRate.toFixed(1)}%` },
  { key: 'totalTokens', label: 'Biggest Burner', icon: Flame, value: (entry: LeaderboardEntry) => entry.totalTokens.toLocaleString() },
  { key: 'totalCost', label: 'The Money Pit', icon: Banknote, value: (entry: LeaderboardEntry) => entry.pricedFights ? `$${entry.totalCost.toFixed(4)}` : 'REVIEW' },
  { key: 'efficiency', label: 'Efficient Assassin', icon: Target, value: (entry: LeaderboardEntry) => `${(entry.avgScore / Math.max(entry.totalTokens / entry.fights, 1) * 100).toFixed(1)} pts/100tok` },
  { key: 'losses', label: 'The Punching Bag', icon: Shield, value: (entry: LeaderboardEntry) => `${entry.losses} losses` },
] as const;

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const entries = getLeaderboard(); const records = getFightRecords();
  const [panel, setPanel] = useState<'standings' | 'awards' | 'matchups' | 'tapes'>('standings');
  const [first, setFirst] = useState(''); const [second, setSecond] = useState('');
  const h2h = first && second && first !== second ? getHeadToHead(first, second) : null;
  const winners = awards.map(award => ({ ...award, winner: [...entries].sort((a, b) => {
    if (award.key === 'efficiency') return b.avgScore / Math.max(b.totalTokens / b.fights, 1) - a.avgScore / Math.max(a.totalTokens / a.fights, 1);
    return (b[award.key as keyof LeaderboardEntry] as number) - (a[award.key as keyof LeaderboardEntry] as number);
  })[0] }));

  return (
    <div className="leaderboard-screen screen-layout">
      <div className="screen-heading split"><div><div className="commission-kicker">LOCAL EXHIBITION RECORDS · SCHEMA V2</div><h2>HALL OF <span>SHAME</span></h2></div><button className="secondary-action" onClick={onBack}>Back</button></div>
      <div className="record-tabs" role="tablist" aria-label="Hall of Shame sections">
        {(['standings', 'awards', 'matchups', 'tapes'] as const).map(item => <button key={item} role="tab" aria-selected={panel === item} onClick={() => setPanel(item)}>{item}</button>)}
      </div>
      {entries.length === 0 ? <div className="empty-records"><Trophy aria-hidden="true" /><h3>NO FIGHTS RECORDED</h3><p>The upgraded arena awaits its first sanctioned exhibition.</p></div> : <div className="leaderboard-panel">
        {panel === 'standings' && <div className="leaderboard-table-wrap"><table><thead><tr><th>#</th><th>Fighter</th><th>W</th><th>L</th><th>D</th><th>Win %</th><th>Tokens</th><th>Priced Cost</th><th>Avg</th></tr></thead>
          <tbody>{entries.map((entry, index) => <tr key={entry.fighterId}><td>{index + 1}</td><td className={`leaderboard-fighter ${entry.snapshot.color}`}><FighterPortrait fighterId={entry.fighterId} fighterName={entry.snapshot.name} className="leaderboard-avatar" /><span>{entry.snapshot.name}<small>{entry.snapshot.rosterTier}</small></span></td><td>{entry.wins}</td><td>{entry.losses}</td><td>{entry.draws}</td><td>{entry.winRate.toFixed(1)}%</td><td>{entry.totalTokens.toLocaleString()}</td><td>{entry.pricedFights ? `$${entry.totalCost.toFixed(4)}` : 'REVIEW'}</td><td>{entry.avgScore.toFixed(1)}</td></tr>)}</tbody></table></div>}
        {panel === 'awards' && <div className="award-grid">{winners.map(award => { const Icon = award.icon; return <div key={award.key}><Icon aria-hidden="true" /><small>{award.label}</small>{award.winner ? <><b className={award.winner.snapshot.color}>{award.winner.snapshot.name}</b><strong>{award.value(award.winner)}</strong></> : <em>No data</em>}</div>; })}</div>}
        {panel === 'matchups' && <div className="h2h-console"><select value={first} onChange={event => setFirst(event.target.value)}><option value="">Fighter 1</option>{SELECTABLE_FIGHTERS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select><b>VS</b><select value={second} onChange={event => setSecond(event.target.value)}><option value="">Fighter 2</option>{SELECTABLE_FIGHTERS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>{h2h && <p>{h2h.f1Wins} wins · {h2h.draws} draws · {h2h.f2Wins} wins across {h2h.totalFights} bouts</p>}</div>}
        {panel === 'tapes' && <div className="recent-tapes">{records.slice(-8).reverse().map(record => <div key={record.id}><time>{new Date(record.timestamp).toLocaleDateString()}</time><b>{record.fighter1Snapshot.name} {record.f1Score}–{record.f2Score} {record.fighter2Snapshot.name}</b><span>{record.result === 'draw' ? 'DRAW' : `${record.winner === record.fighter1 ? record.fighter1Snapshot.name : record.fighter2Snapshot.name} WON`} · {record.events.length} events</span></div>)}</div>}
      </div>}
    </div>
  );
}
