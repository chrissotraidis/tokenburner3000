import { useState } from 'react';
import { FIGHTERS } from '../data/fighters';
import { getLeaderboard, getHeadToHead, type LeaderboardEntry } from '../lib/storage';

interface LeaderboardProps {
  onBack: () => void;
}

const TITLES = [
  'Reigning Champion',
  "The People's Runner-Up",
  'Most Improved (Still Mid)',
  'Promising Contender',
  'Dark Horse',
  'Under Review',
  'Showing Promise (Allegedly)',
  'Consistently Present',
  'Participation Trophy',
  'Bench Warmer',
  'Warm Body',
  'Career Minor Leaguer',
  'Administrative Error',
  'Last Place (With Dignity)',
];

const CATEGORY_AWARDS = [
  { key: 'winRate', label: 'Overall Champion', desc: 'Highest win rate', icon: '👑', sortDesc: true, getValue: (e: LeaderboardEntry) => `${e.winRate.toFixed(1)}%` },
  { key: 'totalTokens', label: 'The Biggest Burner', desc: 'Most tokens wasted', icon: '🔥', sortDesc: true, getValue: (e: LeaderboardEntry) => e.totalTokens.toLocaleString() },
  { key: 'totalCost', label: 'The Money Pit', desc: 'Most dollars burned', icon: '💸', sortDesc: true, getValue: (e: LeaderboardEntry) => `$${e.totalCost.toFixed(2)}` },
  { key: 'efficiency', label: 'The Efficient Assassin', desc: 'Highest score per token', icon: '🎯', sortDesc: true, getValue: (e: LeaderboardEntry) => `${(e.avgScore / Math.max(e.totalTokens / e.fights, 1) * 100).toFixed(1)} pts/100tok` },
  { key: 'losses', label: 'The Punching Bag', desc: 'Most losses (they showed up)', icon: '🥊', sortDesc: true, getValue: (e: LeaderboardEntry) => `${e.losses} losses` },
];

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const entries = getLeaderboard();
  const [h2hFighter1, setH2hFighter1] = useState('');
  const [h2hFighter2, setH2hFighter2] = useState('');

  const getFighter = (id: string) => FIGHTERS.find(f => f.id === id);

  const h2h = h2hFighter1 && h2hFighter2 && h2hFighter1 !== h2hFighter2
    ? getHeadToHead(h2hFighter1, h2hFighter2)
    : null;

  const categoryWinners = CATEGORY_AWARDS.map(award => {
    if (entries.length === 0) return { ...award, winner: null };
    const sorted = [...entries].sort((a, b) => {
      if (award.key === 'efficiency') {
        const effA = a.avgScore / Math.max(a.totalTokens / a.fights, 1);
        const effB = b.avgScore / Math.max(b.totalTokens / b.fights, 1);
        return effB - effA;
      }
      const key = award.key as keyof LeaderboardEntry;
      return (b[key] as number) - (a[key] as number);
    });
    return { ...award, winner: sorted[0] };
  });

  return (
    <div className="p-8 max-w-6xl mx-auto relative z-10 min-h-[80vh] w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white flicker">
          Hall of <span className="text-neon-magenta">Shame</span>
        </h2>
        <button
          onClick={onBack}
          className="border-2 border-gray-500 text-gray-300 font-black px-6 py-2 uppercase hover:bg-white hover:text-black transition-colors cursor-pointer"
        >
          Back
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏟️</div>
          <h3 className="text-3xl font-black uppercase text-gray-500 mb-2">No Fights Recorded</h3>
          <p className="text-gray-600 font-mono">
            The arena awaits its first sanctioned bout. Enter the arena to begin.
          </p>
        </div>
      ) : (
        <>
          {/* Rankings Table */}
          <div className="mb-12 overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="text-left text-gray-500 uppercase border-b-2 border-gray-800">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Fighter</th>
                  <th className="p-3">W</th>
                  <th className="p-3">L</th>
                  <th className="p-3">Win %</th>
                  <th className="p-3">Tokens Burned</th>
                  <th className="p-3">$ Wasted</th>
                  <th className="p-3">Avg Score</th>
                  <th className="p-3">Title</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => {
                  const fighter = getFighter(entry.fighterId);
                  if (!fighter) return null;
                  return (
                    <tr key={entry.fighterId} className="border-b border-gray-800 hover:bg-gray-900/50">
                      <td className="p-3 text-gray-400">{i + 1}</td>
                      <td className="p-3">
                        <span className={`font-black ${fighter.color}`}>
                          {fighter.logo} {fighter.name}
                        </span>
                      </td>
                      <td className="p-3 text-neon-green">{entry.wins}</td>
                      <td className="p-3 text-neon-red">{entry.losses}</td>
                      <td className="p-3 text-white font-bold">{entry.winRate.toFixed(1)}%</td>
                      <td className="p-3">{entry.totalTokens.toLocaleString()}</td>
                      <td className="p-3 text-neon-green">${entry.totalCost.toFixed(2)}</td>
                      <td className="p-3">{entry.avgScore.toFixed(1)}/50</td>
                      <td className="p-3 text-gray-400 italic text-xs">{TITLES[i] || 'Unranked'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Category Awards */}
          <h3 className="text-2xl font-black uppercase text-neon-orange mb-4">Category Awards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {categoryWinners.map(award => {
              const fighter = award.winner ? getFighter(award.winner.fighterId) : null;
              return (
                <div key={award.key} className="bg-gray-900 border border-gray-800 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{award.icon}</span>
                    <div>
                      <div className="font-black uppercase text-white">{award.label}</div>
                      <div className="text-xs text-gray-500">{award.desc}</div>
                    </div>
                  </div>
                  {fighter && award.winner ? (
                    <div className="mt-3 flex justify-between items-center">
                      <span className={`font-bold ${fighter.color}`}>{fighter.logo} {fighter.name}</span>
                      <span className="font-mono text-neon-green">{award.getValue(award.winner)}</span>
                    </div>
                  ) : (
                    <div className="mt-3 text-gray-600 text-sm">No data yet</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Head-to-Head */}
          <h3 className="text-2xl font-black uppercase text-neon-cyan mb-4">Head-to-Head</h3>
          <div className="bg-gray-900 border border-gray-800 p-6">
            <div className="flex gap-4 mb-4 flex-wrap">
              <select
                value={h2hFighter1}
                onChange={e => setH2hFighter1(e.target.value)}
                className="bg-black border border-gray-700 text-white p-2 font-mono cursor-pointer"
              >
                <option value="">Select Fighter 1</option>
                {FIGHTERS.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <span className="text-gray-600 font-black text-xl self-center">VS</span>
              <select
                value={h2hFighter2}
                onChange={e => setH2hFighter2(e.target.value)}
                className="bg-black border border-gray-700 text-white p-2 font-mono cursor-pointer"
              >
                <option value="">Select Fighter 2</option>
                {FIGHTERS.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            {h2h ? (
              h2h.totalFights > 0 ? (
                <div className="font-mono text-center">
                  <div className="text-2xl font-black">
                    <span className={getFighter(h2hFighter1)?.color}>{getFighter(h2hFighter1)?.name}</span>
                    <span className="text-white mx-4">{h2h.f1Wins} - {h2h.f2Wins}</span>
                    <span className={getFighter(h2hFighter2)?.color}>{getFighter(h2hFighter2)?.name}</span>
                  </div>
                  <div className="text-gray-500 text-sm mt-2">{h2h.totalFights} total bouts</div>
                </div>
              ) : (
                <p className="text-gray-600 font-mono text-center">
                  These fighters have not yet been matched. The commission awaits.
                </p>
              )
            ) : (
              <p className="text-gray-600 font-mono text-center">Select two different fighters to view their rivalry.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
