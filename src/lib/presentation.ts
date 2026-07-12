export const ARENA_ART: Record<string, string> = {
  roast: '/art/arena-roast-pit.jpg',
  debate: '/art/arena-debate-ring.jpg',
  explain: '/art/arena-explain-off.jpg',
  filibuster: '/art/arena-filibuster.jpg',
  freestyle: '/art/arena-freestyle.jpg',
};

export function arenaArt(arenaId: string): string {
  return ARENA_ART[arenaId] ?? '/art/datacenter-singularity.jpg';
}
