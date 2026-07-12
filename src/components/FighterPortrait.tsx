import { fighterPortraitSrc } from '../lib/portraits';

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
      src={fighterPortraitSrc(fighterId)}
      alt={`${fighterName} arcade fighter portrait`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={event => {
        if (!event.currentTarget.src.endsWith('/art/fighters/gpt-5-5.jpg')) {
          event.currentTarget.src = '/art/fighters/gpt-5-5.jpg';
        }
      }}
    />
  );
}
