import { useState } from 'react';
import type { CompetitionProgram } from '../types';
import { createDailyProgram, createFourBracket, createProviderCard, currentProgramMatchup, providerNames } from '../lib/competition';
import { getFighterById } from '../data/fighters';

interface FightProgramsProps {
  activeProgram: CompetitionProgram | null;
  onBestOfThree: () => void;
  onStartProgram: (program: CompetitionProgram) => void;
  onBack: () => void;
}

export default function FightPrograms({ activeProgram, onBestOfThree, onStartProgram, onBack }: FightProgramsProps) {
  const providers = providerNames();
  const [provider1, setProvider1] = useState(providers[0] ?? '');
  const [provider2, setProvider2] = useState(providers.find(provider => provider !== providers[0]) ?? '');
  const providerCard = createProviderCard(provider1, provider2);
  const current = activeProgram ? currentProgramMatchup(activeProgram) : null;

  return (
    <div className="programs-screen screen-layout">
      <div className="screen-heading"><div className="commission-kicker">LOCAL LEAGUE OFFICE · NO ACCOUNT REQUIRED</div>
      <h2>Fight <span>Programs</span></h2>
      <p>Every program runs through the same sanctioned Exhibition engine and produces ordinary fight records.</p></div>

      {activeProgram && !activeProgram.completed && current && (
        <section className="resume-program">
          <div><small>ACTIVE PROGRAM</small><b>{activeProgram.title}</b><span>{current.label}: {getFighterById(current.fighter1Id)?.name} vs {getFighterById(current.fighter2Id)?.name}</span></div>
          <button onClick={() => onStartProgram(activeProgram)}>Resume Program</button>
        </section>
      )}

      <div className="program-grid screen-scroll-region">
        <article><span>01</span><h3>Best of Three</h3><p>Select two fighters. First to two official decisions wins the series.</p><button onClick={onBestOfThree}>Select Fighters</button></article>
        <article><span>02</span><h3>Provider Card</h3><p>Up to three cross-provider bouts, scored as one local fight card.</p>
          <div className="provider-pickers"><select aria-label="Red provider" value={provider1} onChange={event => setProvider1(event.target.value)}>{providers.map(provider => <option key={provider}>{provider}</option>)}</select><b>VS</b><select aria-label="Blue provider" value={provider2} onChange={event => setProvider2(event.target.value)}>{providers.map(provider => <option key={provider}>{provider}</option>)}</select></div>
          <button disabled={!providerCard} onClick={() => providerCard && onStartProgram(providerCard)}>Sanction Card</button>
        </article>
        <article><span>03</span><h3>Final Four</h3><p>The four highest eligible Intelligence Index seeds enter a two-round bracket.</p><button onClick={() => onStartProgram(createFourBracket())}>Open Bracket</button></article>
        <article><span>04</span><h3>Daily Main Event</h3><p>A deterministic local-date pairing. Same matchup all day, no network required.</p><button onClick={() => onStartProgram(createDailyProgram())}>Load Today’s Fight</button></article>
      </div>
      <div className="screen-actions"><button className="secondary-action" onClick={onBack}>Back to Cabinet</button></div>
    </div>
  );
}
