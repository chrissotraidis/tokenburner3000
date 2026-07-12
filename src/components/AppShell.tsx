import { useEffect, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  Home,
  KeyRound,
  Menu,
  Radio,
  SlidersHorizontal,
  Swords,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type { ViewState } from '../types';

interface AppShellProps {
  view: ViewState;
  volume: number;
  muted: boolean;
  reduceEffects: boolean;
  liveConnected: number;
  onNavigate: (destination: 'home' | 'exhibition' | 'live' | 'programs' | 'leaderboard') => void;
  onVolumeChange: (value: number) => void;
  onMutedChange: (value: boolean) => void;
  onReduceEffectsChange: (value: boolean) => void;
  children: ReactNode;
}

const VIEW_LABELS: Record<ViewState, string> = {
  landing: 'Arcade Lobby',
  'live-settings': 'Sanctioned Live',
  programs: 'Fight Programs',
  'select-fighters': 'Choose Fighters',
  'select-arena': 'Choose Arena',
  'tale-of-tape': 'Tale of the Tape',
  fight: 'Live Bout',
  verdict: 'Official Verdict',
  leaderboard: 'Hall of Shame',
};

const NAV_ITEMS = [
  { id: 'home' as const, label: 'Arcade Lobby', icon: Home },
  { id: 'exhibition' as const, label: 'Exhibition Fight', icon: Swords },
  { id: 'live' as const, label: 'Sanctioned Live', icon: KeyRound },
  { id: 'programs' as const, label: 'Fight Programs', icon: Radio },
  { id: 'leaderboard' as const, label: 'Hall of Shame', icon: Trophy },
];

export default function AppShell({
  view,
  volume,
  muted,
  reduceEffects,
  liveConnected,
  onNavigate,
  onVolumeChange,
  onMutedChange,
  onReduceEffectsChange,
  children,
}: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const navigate = (destination: Parameters<AppShellProps['onNavigate']>[0]) => {
    setMenuOpen(false);
    onNavigate(destination);
  };

  return (
    <div className="app-frame arcade-cabinet">
      <header className="command-bar">
        <button
          type="button"
          className="icon-button menu-trigger"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="app-navigation"
          onClick={() => setMenuOpen(open => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <button type="button" className="command-brand" onClick={() => navigate('home')} aria-label="TokenBurner 3000 home">
          <span>TB</span><b>3000</b>
        </button>
        <div className="command-context">
          <span>NOW VIEWING</span>
          <strong>{VIEW_LABELS[view]}</strong>
        </div>
        <div className="command-status" aria-label="Application status">
          <i aria-hidden="true" /> SYSTEM READY
        </div>
        <button
          type="button"
          className="icon-button audio-trigger"
          aria-label={muted || volume === 0 ? 'Unmute music' : 'Mute music'}
          aria-pressed={muted}
          onClick={() => onMutedChange(!muted)}
        >
          {muted || volume === 0 ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button>
      </header>

      <main className="app-main">{children}</main>

      <button
        type="button"
        className={`drawer-scrim ${menuOpen ? 'is-open' : ''}`}
        aria-label="Close navigation menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />
      <aside id="app-navigation" className={`navigation-drawer ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="drawer-heading">
          <div><span>ARCADE CONTROL</span><strong>Choose a destination</strong></div>
          <button type="button" className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu"><X aria-hidden="true" /></button>
        </div>
        <nav aria-label="Primary navigation">
          {view === 'fight' && <p className="drawer-fight-warning"><AlertTriangle aria-hidden="true" /> Leaving the live bout forfeits it without creating a record.</p>}
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button type="button" key={item.id} onClick={() => navigate(item.id)}>
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <section className="drawer-settings" aria-labelledby="effects-settings-title">
          <h2 id="effects-settings-title"><SlidersHorizontal aria-hidden="true" /> Cabinet settings</h2>
          <label htmlFor="music-volume">Music volume <output>{muted ? 0 : Math.round(volume * 100)}%</output></label>
          <input
            id="music-volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={event => {
              const next = Number(event.target.value);
              onVolumeChange(next);
              onMutedChange(next === 0);
            }}
          />
          <button
            type="button"
            className="setting-toggle"
            aria-pressed={reduceEffects}
            onClick={() => onReduceEffectsChange(!reduceEffects)}
          >
            <span><b>Reduce effects</b><small>Calmer motion, glow, and screen shake</small></span>
            <i aria-hidden="true" />
          </button>
          <button type="button" className="live-settings-shortcut" onClick={() => navigate('live')}>
            <KeyRound aria-hidden="true" />
            <span><b>Sanctioned Live</b><small>{liveConnected ? `${liveConnected} provider${liveConnected === 1 ? '' : 's'} connected` : 'Configure real model APIs'}</small></span>
          </button>
        </section>
      </aside>
    </div>
  );
}
