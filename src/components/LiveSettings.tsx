import { useMemo, useState } from 'react';
import { AlertTriangle, Check, KeyRound, RadioTower, ShieldCheck, Trash2, Zap } from 'lucide-react';
import { FIGHTERS } from '../data/fighters';
import {
  LIVE_PROVIDERS, clearProviderKey, isLiveReady, providerOptionsFor, saveLiveBudget,
  saveLiveRoutes, saveProviderKey, suggestedModel, testProviderKey,
  type FighterLiveRoute, type LiveProviderId, type LiveStatus,
} from '../lib/live';
import FighterPortrait from './FighterPortrait';

interface LiveSettingsProps {
  routes: Record<string, FighterLiveRoute>;
  budget: number;
  status: LiveStatus | null;
  onRoutesChange: (routes: Record<string, FighterLiveRoute>) => void;
  onBudgetChange: (budget: number) => void;
  onStatusChange: (status: LiveStatus) => void;
  onEnter: () => void;
  onBack: () => void;
}

export default function LiveSettings({ routes, budget, status, onRoutesChange, onBudgetChange, onStatusChange, onEnter, onBack }: LiveSettingsProps) {
  const [draftKeys, setDraftKeys] = useState<Partial<Record<LiveProviderId, string>>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState('Keys live only in this server session. Restarting the server clears the vault.');
  const [consented, setConsented] = useState(false);
  const readyCount = useMemo(() => FIGHTERS.filter(fighter => isLiveReady(fighter, routes, status)).length, [routes, status]);
  const connectedCount = status ? Object.values(status.providers).filter(provider => provider.configured).length : 0;

  const action = async (id: string, operation: () => Promise<LiveStatus>, success: string) => {
    setBusy(id); setNotice('CONTACTING PROVIDER CONTROL…');
    try { const next = await operation(); onStatusChange(next); setNotice(success); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Provider operation failed.'); }
    finally { setBusy(null); }
  };

  const updateRoute = (fighterId: string, patch: Partial<FighterLiveRoute>) => {
    const next = { ...routes, [fighterId]: { ...routes[fighterId], ...patch } };
    onRoutesChange(next); saveLiveRoutes(next);
  };

  const setProvider = (fighterId: string, provider: LiveProviderId) => {
    const fighter = FIGHTERS.find(item => item.id === fighterId);
    if (!fighter) return;
    updateRoute(fighterId, { provider, modelId: suggestedModel(fighter, provider) });
  };

  return (
    <div className="live-settings-screen screen-layout">
      <header className="live-settings-header">
        <div><span>PREMIUM COMPUTE DIVISION</span><h2>SANCTIONED <b>LIVE</b></h2><p>Real models. Real provider usage. Real financial consequences.</p></div>
        <div className="live-readiness"><strong>{readyCount}</strong><span>LIVE READY</span><small>{connectedCount} providers connected</small></div>
      </header>

      <div className="live-security-rail" role="status"><ShieldCheck aria-hidden="true" /><b>EPHEMERAL KEY VAULT</b><span>{notice}</span></div>

      <div className="live-settings-body">
        <section className="provider-vault" aria-labelledby="provider-vault-title">
          <header><KeyRound aria-hidden="true" /><div><h3 id="provider-vault-title">Provider Credentials</h3><p>Saved server-side only. Status responses never contain the key.</p></div></header>
          <div className="provider-card-grid">
            {LIVE_PROVIDERS.map(provider => {
              const providerStatus = status?.providers[provider.id];
              const configured = !!providerStatus?.configured;
              const tested = !!providerStatus?.testedAt;
              const value = draftKeys[provider.id] ?? '';
              return <article className={`provider-key-card ${configured ? 'is-connected' : ''}`} key={provider.id}>
                <div><span>{provider.label}</span>{configured && <b><Check aria-hidden="true" /> CONNECTED</b>}</div>
                <p>{provider.note}</p>
                <label htmlFor={`key-${provider.id}`}>API key</label>
                <input id={`key-${provider.id}`} type="password" autoComplete="off" placeholder={configured ? 'Saved in session vault' : 'Paste key'} value={value} onChange={event => setDraftKeys(keys => ({ ...keys, [provider.id]: event.target.value }))} />
                <div className="provider-key-actions">
                  <button disabled={busy != null || value.trim().length < 8} onClick={() => action(`save-${provider.id}`, () => saveProviderKey(provider.id, value).then(next => { setDraftKeys(keys => ({ ...keys, [provider.id]: '' })); return next; }), `${provider.label} key sealed in the session vault.`)}><KeyRound aria-hidden="true" /> {configured ? 'Replace' : 'Save'}</button>
                  <button disabled={busy != null || !configured} onClick={() => action(`test-${provider.id}`, () => testProviderKey(provider.id), `${provider.label} answered the credential test.`)}><RadioTower aria-hidden="true" /> {tested ? 'Retest' : 'Test'}</button>
                  <button aria-label={`Clear ${provider.label} key`} disabled={busy != null || !configured} onClick={() => action(`clear-${provider.id}`, () => clearProviderKey(provider.id), `${provider.label} key destroyed.`)}><Trash2 aria-hidden="true" /></button>
                </div>
              </article>;
            })}
          </div>
        </section>

        <section className="fighter-routing" aria-labelledby="fighter-routing-title">
          <header><Zap aria-hidden="true" /><div><h3 id="fighter-routing-title">Fighter Routing Matrix</h3><p>Display names and callable model IDs are deliberately separate.</p></div></header>
          <div className="route-list">
            {FIGHTERS.map(fighter => {
              const route = routes[fighter.id];
              const ready = isLiveReady(fighter, routes, status);
              return <article className={`fighter-route ${ready ? 'is-ready' : ''}`} key={fighter.id}>
                <FighterPortrait fighterId={fighter.id} fighterName={fighter.name} className="route-avatar" />
                <div className="route-identity"><b>{fighter.name}</b><span>{fighter.eligible ? (ready ? 'LIVE READY' : 'NEEDS ROUTE') : fighter.rosterTier.toUpperCase()}</span></div>
                <label>Provider<select value={route.provider} onChange={event => setProvider(fighter.id, event.target.value as LiveProviderId)}>{providerOptionsFor(fighter).map(id => <option value={id} key={id}>{LIVE_PROVIDERS.find(provider => provider.id === id)?.label ?? id}</option>)}</select></label>
                <label>Model ID<input value={route.modelId} placeholder="No verified callable ID" onChange={event => updateRoute(fighter.id, { modelId: event.target.value })} /></label>
                <div className="route-meter"><i className={ready ? 'ready' : ''} /><span>{ready ? 'METER ONLINE' : route.modelId ? 'KEY REQUIRED' : 'MODEL REQUIRED'}</span></div>
              </article>;
            })}
          </div>
        </section>
      </div>

      <footer className="live-settings-footer">
        <div className="live-budget"><label htmlFor="live-budget">Spend guard per fight</label><span>$</span><input id="live-budget" type="number" min="0.01" max="10" step="0.01" value={budget} onChange={event => { const next = Math.max(.01, Math.min(10, Number(event.target.value) || .01)); onBudgetChange(next); saveLiveBudget(next); }} /><small>Best-effort for direct providers; OpenRouter cost is authoritative.</small></div>
        <label className="billing-consent"><input type="checkbox" checked={consented} onChange={event => setConsented(event.target.checked)} /><span><AlertTriangle aria-hidden="true" /><b>I understand these calls spend my provider credits.</b></span></label>
        <div className="live-footer-actions"><button className="secondary-action" onClick={onBack}>Back</button><button className="primary-action" disabled={!consented || readyCount < 2} onClick={onEnter}>Enter Live Arena <Zap aria-hidden="true" /></button></div>
      </footer>
    </div>
  );
}
