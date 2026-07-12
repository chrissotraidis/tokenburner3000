import { useEffect, useState, type PointerEvent } from 'react';
import { Activity, ChevronRight, KeyRound, Radio, Skull, TriangleAlert, Trophy, Zap } from 'lucide-react';
import SpectacleCanvas from './LazySpectacleCanvas';

interface LandingProps {
  effectsEnabled: boolean;
  onEnterArena: () => void;
  onEnterLive: () => void;
  onFightPrograms: () => void;
  onViewLeaderboard: () => void;
}

export default function Landing({ effectsEnabled, onEnterArena, onEnterLive, onFightPrograms, onViewLeaderboard }: LandingProps) {
  const [overload, setOverload] = useState(87);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setOverload(value => value >= 99 ? 84 : value + 1), 1150);
    return () => window.clearInterval(timer);
  }, []);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!effectsEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({ x: (event.clientX - rect.left) / rect.width - .5, y: (event.clientY - rect.top) / rect.height - .5 });
  };

  const enter = () => {
    if (launching) return;
    setLaunching(true);
    window.setTimeout(onEnterArena, effectsEnabled ? 520 : 0);
  };

  return (
    <div className={`landing-screen singularity-lobby ${launching ? 'is-launching' : ''}`} onPointerMove={move} onPointerLeave={() => setPointer({ x: 0, y: 0 })}>
      <img
        className="singularity-backdrop"
        src="/art/datacenter-singularity.jpg"
        alt=""
        style={{ transform: `scale(1.06) translate(${pointer.x * -12}px, ${pointer.y * -8}px)` }}
      />
      <SpectacleCanvas intensity={1 + overload / 95} pulse={overload} reduced={!effectsEnabled} />
      <div className="lobby-shade" />

      <div className="landing-status"><Activity aria-hidden="true" /><span>ARCADE ONLINE</span></div>
      <div className="system-critical"><TriangleAlert aria-hidden="true" /><span>SYSTEM CRITICAL</span></div>

      <aside className="overload-console red" aria-label={`Cost overflow ${overload} percent`}>
        <Skull aria-hidden="true" />
        <span>COST OVERFLOW</span>
        <strong>+${(12847.31 + overload * 71.4).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
        <div><i style={{ width: `${overload}%` }} /></div>
        <small>{overload}% AND CLIMBING</small>
      </aside>
      <aside className="overload-console blue" aria-label={`Compute meltdown ${Math.min(99, overload + 4)} percent`}>
        <Zap aria-hidden="true" />
        <span>COMPUTE MELTDOWN</span>
        <strong>{Math.min(99, overload + 4)}.87%</strong>
        <div><i style={{ width: `${Math.min(99, overload + 4)}%` }} /></div>
        <small>NO STABLE BASELINE</small>
      </aside>

      <div className="singularity-content">
        <div className="logo-overline"><span /> COMPETITIVE AI TOKEN WASTAGE <span /></div>
        <h1><span>TokenBurner</span><b>3000</b></h1>
        <p className="landing-deck">
          <span>Live.</span> Unhinged. <b>Probably unnecessary.</b>
        </p>
        <div className="overload-meter" aria-label={`Arcade overload ${overload} percent`}>
          <span>ARCADE OVERLOAD</span><div><i style={{ width: `${overload}%` }} /></div><strong>{overload}%</strong>
        </div>
        <div className="landing-actions">
          <button data-testid="enter-arena" onClick={enter} className="primary-action landing-primary">
            <span>{launching ? 'OPENING SINGULARITY' : 'ENTER THE ARENA'}</span><ChevronRight aria-hidden="true" />
          </button>
          <button onClick={onFightPrograms} className="secondary-action"><Radio aria-hidden="true" /> Fight Programs</button>
          <button onClick={onViewLeaderboard} className="secondary-action"><Trophy aria-hidden="true" /> Hall of Shame</button>
          <button onClick={onEnterLive} className="secondary-action landing-live"><KeyRound aria-hidden="true" /> Sanctioned Live <small>REAL TOKENS</small></button>
        </div>
      </div>

      <div className="lobby-bottom-feed" aria-hidden="true">
        <span>LIVE BURN FEED</span><b>+2,841,993 TOKENS</b><i>NEURAL SIMP OVERLOADED</i><b>$42,019.37 WASTED</b>
      </div>
    </div>
  );
}
