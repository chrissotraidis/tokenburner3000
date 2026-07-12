import { randomBytes } from 'node:crypto';

const SESSION_COOKIE = 'tb_live_session';
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 96 * 1024;
const REQUEST_TIMEOUT_MS = 45_000;

export const LIVE_PROVIDERS = {
  openrouter: { label: 'OpenRouter', testUrl: 'https://openrouter.ai/api/v1/models', kind: 'openai', baseUrl: 'https://openrouter.ai/api/v1' },
  openai: { label: 'OpenAI', testUrl: 'https://api.openai.com/v1/models', kind: 'openai-responses', baseUrl: 'https://api.openai.com/v1' },
  anthropic: { label: 'Anthropic', testUrl: 'https://api.anthropic.com/v1/models', kind: 'anthropic', baseUrl: 'https://api.anthropic.com/v1' },
  google: { label: 'Google Gemini', testUrl: 'https://generativelanguage.googleapis.com/v1beta/models', kind: 'google', baseUrl: 'https://generativelanguage.googleapis.com/v1beta' },
  xai: { label: 'xAI', testUrl: 'https://api.x.ai/v1/models', kind: 'openai', baseUrl: 'https://api.x.ai/v1' },
  deepseek: { label: 'DeepSeek', testUrl: 'https://api.deepseek.com/models', kind: 'openai', baseUrl: 'https://api.deepseek.com' },
  zai: { label: 'Z.ai', testUrl: 'https://api.z.ai/api/paas/v4/models', kind: 'openai', baseUrl: 'https://api.z.ai/api/paas/v4' },
  moonshot: { label: 'Moonshot', testUrl: 'https://api.moonshot.ai/v1/models', kind: 'openai', baseUrl: 'https://api.moonshot.ai/v1' },
};

const sessions = new Map();

function json(res, status, body, extraHeaders = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders });
  res.end(JSON.stringify(body));
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map(value => value.trim()).filter(Boolean).map(pair => {
    const index = pair.indexOf('=');
    return [decodeURIComponent(pair.slice(0, index)), decodeURIComponent(pair.slice(index + 1))];
  }));
}

function getSession(req, res) {
  const cookies = parseCookies(req.headers.cookie);
  let id = cookies[SESSION_COOKIE];
  let session = id ? sessions.get(id) : undefined;
  if (!session || Date.now() - session.updatedAt > SESSION_TTL_MS) {
    if (id) sessions.delete(id);
    id = randomBytes(24).toString('base64url');
    session = { keys: new Map(), testedAt: new Map(), fightCosts: new Map(), updatedAt: Date.now() };
    sessions.set(id, session);
    res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`);
  }
  session.updatedAt = Date.now();
  return session;
}

async function readJson(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new LiveApiError(413, 'Request body is too large.');
  }
  if (!body) return {};
  try { return JSON.parse(body); }
  catch { throw new LiveApiError(400, 'Invalid JSON body.'); }
}

class LiveApiError extends Error {
  constructor(status, message, code = 'live_api_error', details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function providerHeaders(provider, apiKey) {
  if (provider === 'anthropic') return { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' };
  if (provider === 'google') return { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' };
  return { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
}

async function providerFetch(provider, apiKey, url, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...init,
      headers: { ...providerHeaders(provider, apiKey), ...(init.headers ?? {}) },
      signal: controller.signal,
    });
    const raw = await response.text();
    let payload;
    try { payload = raw ? JSON.parse(raw) : {}; }
    catch { payload = { raw: raw.slice(0, 500) }; }
    if (!response.ok) {
      const message = payload?.error?.message ?? payload?.message ?? `Provider returned HTTP ${response.status}.`;
      const status = response.status === 401 || response.status === 403 ? 401 : response.status === 429 ? 429 : 502;
      throw new LiveApiError(status, message, `provider_${response.status}`, { provider, upstreamStatus: response.status });
    }
    return payload;
  } catch (error) {
    if (error?.name === 'AbortError') throw new LiveApiError(504, `${LIVE_PROVIDERS[provider].label} timed out.`, 'provider_timeout');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function responseText(payload, kind) {
  if (kind === 'openai-responses') {
    if (typeof payload.output_text === 'string') return payload.output_text;
    return (payload.output ?? []).flatMap(item => item.content ?? []).filter(part => part.type === 'output_text').map(part => part.text ?? '').join('');
  }
  if (kind === 'anthropic') return (payload.content ?? []).filter(part => part.type === 'text').map(part => part.text ?? '').join('');
  if (kind === 'google') return (payload.candidates ?? []).flatMap(candidate => candidate.content?.parts ?? []).map(part => part.text ?? '').join('');
  return payload.choices?.[0]?.message?.content ?? '';
}

export function normalizeUsage(payload, provider, route) {
  const kind = LIVE_PROVIDERS[provider]?.kind;
  let inputTokens = 0; let outputTokens = 0; let totalTokens = 0; let cachedTokens = 0; let reasoningTokens = 0; let reportedCost = null;
  if (kind === 'openai-responses') {
    const usage = payload.usage ?? {};
    inputTokens = usage.input_tokens ?? 0; outputTokens = usage.output_tokens ?? 0;
    totalTokens = usage.total_tokens ?? inputTokens + outputTokens;
    cachedTokens = usage.input_tokens_details?.cached_tokens ?? 0;
    reasoningTokens = usage.output_tokens_details?.reasoning_tokens ?? 0;
  } else if (kind === 'anthropic') {
    const usage = payload.usage ?? {};
    inputTokens = (usage.input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0);
    outputTokens = usage.output_tokens ?? 0; totalTokens = inputTokens + outputTokens;
    cachedTokens = usage.cache_read_input_tokens ?? 0;
  } else if (kind === 'google') {
    const usage = payload.usageMetadata ?? {};
    inputTokens = usage.promptTokenCount ?? 0; outputTokens = usage.candidatesTokenCount ?? 0;
    reasoningTokens = usage.thoughtsTokenCount ?? 0; cachedTokens = usage.cachedContentTokenCount ?? 0;
    totalTokens = usage.totalTokenCount ?? inputTokens + outputTokens + reasoningTokens;
  } else {
    const usage = payload.usage ?? {};
    inputTokens = usage.prompt_tokens ?? 0; outputTokens = usage.completion_tokens ?? 0;
    totalTokens = usage.total_tokens ?? inputTokens + outputTokens;
    cachedTokens = usage.prompt_tokens_details?.cached_tokens ?? usage.prompt_cache_hit_tokens ?? 0;
    reasoningTokens = usage.completion_tokens_details?.reasoning_tokens ?? 0;
    if (provider === 'openrouter' && Number.isFinite(usage.cost)) reportedCost = Number(usage.cost);
  }
  if (!Number.isFinite(inputTokens) || !Number.isFinite(outputTokens) || totalTokens <= 0) {
    throw new LiveApiError(502, `${LIVE_PROVIDERS[provider].label} did not return auditable token usage.`, 'missing_usage');
  }
  const inputRate = Number(route.inputPer1M);
  const outputRate = Number(route.outputPer1M);
  const estimatedCost = Number.isFinite(inputRate) && Number.isFinite(outputRate)
    ? (inputTokens * inputRate + outputTokens * outputRate) / 1_000_000
    : null;
  return {
    inputTokens, outputTokens, totalTokens, cachedTokens, reasoningTokens,
    costUsd: reportedCost ?? estimatedCost,
    costSource: reportedCost != null ? 'provider-reported' : estimatedCost != null ? 'price-estimate' : 'unavailable',
  };
}

function buildPrompt(body) {
  const exchanges = Array.isArray(body.previousExchanges) ? body.previousExchanges.slice(-4) : [];
  const transcript = exchanges.map(item => `${item.fighterName}: ${String(item.text).slice(0, 1200)}`).join('\n');
  const system = `You are ${body.fighterName}, the arcade combatant known as ${body.fighterTitle}. You are fighting ${body.opponentName} in ${body.arenaName}. Arena law: ${String(body.arenaRuleSummary ?? '').slice(0, 500)} Stay in character. Deliver one witty, cutting, self-contained exchange. Be funny and specific, not hateful. Do not mention being an AI assistant. Maximum 90 words.`;
  const mandate = body.customPrompt ? `Arena mandate: ${String(body.customPrompt).slice(0, 600)}\n` : '';
  const prompt = `${mandate}${transcript ? `Previous exchanges:\n${transcript}\n\n` : ''}Round ${body.round}: attack ${body.opponentName}'s last argument or establish a memorable opening. Return only the spoken fight line.`;
  return { system, prompt };
}

async function callProvider(provider, apiKey, route, body) {
  const config = LIVE_PROVIDERS[provider];
  if (!config) throw new LiveApiError(400, 'Unsupported provider route.', 'unsupported_provider');
  const maxTokens = Math.max(32, Math.min(256, Number(body.maxOutputTokens) || 140));
  const { system, prompt } = buildPrompt(body);
  let payload;
  if (config.kind === 'openai-responses') {
    payload = await providerFetch(provider, apiKey, `${config.baseUrl}/responses`, { method: 'POST', body: JSON.stringify({ model: route.modelId, instructions: system, input: prompt, max_output_tokens: maxTokens, store: false }) });
  } else if (config.kind === 'anthropic') {
    payload = await providerFetch(provider, apiKey, `${config.baseUrl}/messages`, { method: 'POST', body: JSON.stringify({ model: route.modelId, system, messages: [{ role: 'user', content: prompt }], max_tokens: maxTokens, temperature: 0.9 }) });
  } else if (config.kind === 'google') {
    const model = encodeURIComponent(route.modelId);
    payload = await providerFetch(provider, apiKey, `${config.baseUrl}/models/${model}:generateContent`, { method: 'POST', body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: maxTokens, temperature: 0.9 } }) });
  } else {
    const extraHeaders = provider === 'openrouter' ? { 'HTTP-Referer': 'https://tokenburner3000.local', 'X-Title': 'TokenBurner 3000' } : {};
    payload = await providerFetch(provider, apiKey, `${config.baseUrl}/chat/completions`, { method: 'POST', headers: extraHeaders, body: JSON.stringify({ model: route.modelId, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }], max_tokens: maxTokens, temperature: 0.9 }) });
  }
  const text = responseText(payload, config.kind).trim();
  if (!text) throw new LiveApiError(502, `${config.label} returned no fight text.`, 'empty_response');
  return { text, usage: normalizeUsage(payload, provider, route), requestId: payload.id ?? payload.responseId ?? null, model: payload.model ?? payload.modelVersion ?? route.modelId };
}

async function testProvider(provider, apiKey) {
  const config = LIVE_PROVIDERS[provider];
  const url = provider === 'google' ? `${config.testUrl}?pageSize=1` : config.testUrl;
  await providerFetch(provider, apiKey, url, { method: 'GET' });
}

function statusPayload(session) {
  return {
    expiresInSeconds: Math.max(0, Math.floor((SESSION_TTL_MS - (Date.now() - session.updatedAt)) / 1000)),
    providers: Object.fromEntries(Object.entries(LIVE_PROVIDERS).map(([id, config]) => [id, {
      id, label: config.label, configured: session.keys.has(id), testedAt: session.testedAt.get(id) ?? null,
    }])),
  };
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://tokenburner.local');
  if (!url.pathname.startsWith('/api/live/')) return false;
  const session = getSession(req, res);
  const providerMatch = url.pathname.match(/^\/api\/live\/providers\/([^/]+)$/);
  const testMatch = url.pathname.match(/^\/api\/live\/providers\/([^/]+)\/test$/);

  if (req.method === 'GET' && url.pathname === '/api/live/status') {
    json(res, 200, statusPayload(session)); return true;
  }
  if (providerMatch && req.method === 'PUT') {
    const provider = providerMatch[1];
    if (!LIVE_PROVIDERS[provider]) throw new LiveApiError(404, 'Unknown provider.');
    const body = await readJson(req);
    if (typeof body.apiKey !== 'string' || body.apiKey.trim().length < 8) throw new LiveApiError(400, 'Enter a valid API key.');
    session.keys.set(provider, body.apiKey.trim()); session.testedAt.delete(provider);
    json(res, 200, statusPayload(session)); return true;
  }
  if (providerMatch && req.method === 'DELETE') {
    const provider = providerMatch[1];
    session.keys.delete(provider); session.testedAt.delete(provider);
    json(res, 200, statusPayload(session)); return true;
  }
  if (testMatch && req.method === 'POST') {
    const provider = testMatch[1];
    const apiKey = session.keys.get(provider);
    if (!apiKey) throw new LiveApiError(409, 'Save a key before testing it.', 'missing_key');
    await testProvider(provider, apiKey); session.testedAt.set(provider, Date.now());
    json(res, 200, statusPayload(session)); return true;
  }
  if (req.method === 'POST' && url.pathname === '/api/live/turn') {
    const body = await readJson(req);
    const route = body.route ?? {};
    const provider = route.provider;
    if (!LIVE_PROVIDERS[provider]) throw new LiveApiError(400, 'This fighter has no supported provider route.', 'unsupported_provider');
    if (typeof route.modelId !== 'string' || !route.modelId.trim()) throw new LiveApiError(400, 'This fighter has no API model ID.', 'missing_model');
    const apiKey = session.keys.get(provider);
    if (!apiKey) throw new LiveApiError(409, `${LIVE_PROVIDERS[provider].label} is not connected.`, 'missing_key');
    const fightId = typeof body.fightId === 'string' ? body.fightId : '';
    if (!fightId) throw new LiveApiError(400, 'Missing live fight ID.');
    const budgetUsd = Math.max(0.01, Math.min(10, Number(body.budgetUsd) || 0.25));
    const spent = session.fightCosts.get(fightId) ?? 0;
    if (spent >= budgetUsd) throw new LiveApiError(409, `The $${budgetUsd.toFixed(2)} spend guard is already reached.`, 'budget_reached');
    const startedAt = Date.now();
    const result = await callProvider(provider, apiKey, { ...route, modelId: route.modelId.trim() }, body);
    const reconciledSpent = session.fightCosts.get(fightId) ?? 0;
    const nextSpent = reconciledSpent + (result.usage.costUsd ?? 0);
    session.fightCosts.set(fightId, nextSpent);
    json(res, 200, { ...result, provider, latencyMs: Date.now() - startedAt, fightCostUsd: nextSpent, budgetUsd }); return true;
  }
  json(res, 404, { error: { code: 'not_found', message: 'Unknown Sanctioned Live endpoint.' } });
  return true;
}

export function createLiveMiddleware() {
  return async function liveApiMiddleware(req, res, next) {
    try {
      const handled = await handle(req, res);
      if (!handled && next) next();
    } catch (error) {
      const status = error instanceof LiveApiError ? error.status : 500;
      json(res, status, { error: { code: error.code ?? 'internal_error', message: error.message ?? 'Unexpected Live API error.', details: error.details } });
    }
  };
}

export function liveApiVitePlugin() {
  return { name: 'tokenburner-live-api', configureServer(server) { server.middlewares.use(createLiveMiddleware()); } };
}
