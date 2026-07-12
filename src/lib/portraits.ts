const PORTRAIT_ALIASES: Record<string, string> = {
  'claude-opus': 'claude-opus-4-8',
  'claude-sonnet': 'claude-sonnet-5',
  'claude-haiku': 'claude-haiku-4-5',
  gpt4o: 'gpt-5-5',
  'gpt4o-mini': 'gpt-5-6',
  o3: 'gpt-5-6',
  'gemini-pro': 'gemini-3-1-pro',
  'gemini-flash': 'gemini-3-5-flash',
  llama: 'llama-4-maverick',
  'deepseek-v3': 'deepseek-v4-flash',
  'deepseek-r1': 'deepseek-v4-pro',
  grok: 'grok-4-3',
  mistral: 'glm-5-2',
  command: 'muse-spark-1-1',
};

export function fighterPortraitSrc(fighterId: string): string {
  return `/art/fighters/${PORTRAIT_ALIASES[fighterId] ?? fighterId}.jpg`;
}
