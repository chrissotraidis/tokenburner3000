import {
  Atom,
  BrainCircuit,
  CircleDot,
  Cpu,
  Eye,
  Gauge,
  Gem,
  Network,
  Orbit,
  Rocket,
  Sparkles,
  Sun,
  Zap,
} from 'lucide-react';

interface FighterMarkProps {
  fighterId: string;
  className?: string;
  title?: string;
}

export default function FighterMark({ fighterId, className = '', title }: FighterMarkProps) {
  const id = fighterId.toLowerCase();
  const Icon = id.includes('fable') ? Gem
    : id.includes('opus') ? Eye
      : id.includes('sonnet') ? Sparkles
        : id.includes('haiku') ? Zap
          : id.includes('gpt-5-6') ? Sun
            : id.includes('gpt') ? Cpu
              : id.includes('gemini') ? Orbit
                : id.includes('grok') ? Rocket
                  : id.includes('muse') ? BrainCircuit
                    : id.includes('deepseek') ? Gauge
                      : id.includes('kimi') ? Network
                        : id.includes('glm') ? Atom
                          : CircleDot;
  return <Icon className={className} aria-hidden={title ? undefined : 'true'} aria-label={title} />;
}
