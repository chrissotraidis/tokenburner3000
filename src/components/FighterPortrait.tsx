interface FighterPortraitProps {
  fighterId: string;
  fighterName: string;
  className?: string;
  eager?: boolean;
}

export default function FighterPortrait({ fighterId, fighterName, className = '', eager = false }: FighterPortraitProps) {
  return (
    <img
      className={className}
      src={`/art/fighters/${fighterId}.jpg`}
      alt={`${fighterName} arcade fighter portrait`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );
}
