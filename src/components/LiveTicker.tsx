import { useState, useEffect } from 'react';

export default function LiveTicker() {
  const [tokens, setTokens] = useState(847291034);
  const [dollars, setDollars] = useState(12847.31);
  const [vc, setVc] = useState(3999187152.69);

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prev => prev + Math.floor(Math.random() * 8000) + 2000);
      setDollars(prev => prev + Math.random() * 12 + 2);
      setVc(prev => prev - (Math.random() * 12 + 2));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const fmt = (num: number, currency = false) =>
    currency
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
      : new Intl.NumberFormat('en-US').format(Math.floor(num));

  return (
    <div className="w-full bg-black border-y-4 border-neon-green py-2 flex overflow-hidden relative z-20 shadow-[0_0_20px_rgba(57,255,20,0.3)]">
      <div className="ticker-scroll flex space-x-12 whitespace-nowrap min-w-max font-mono text-sm md:text-lg font-bold uppercase tracking-wider">
        <div className="text-neon-green">TOTAL BURNED: {fmt(tokens)}</div>
        <div className="text-neon-magenta">TOTAL WASTED: {fmt(dollars, true)}</div>
        <div className="text-neon-cyan">VC FUNDING: {fmt(vc, true)}</div>
        <div className="text-neon-green">TOTAL BURNED: {fmt(tokens)}</div>
        <div className="text-neon-magenta">TOTAL WASTED: {fmt(dollars, true)}</div>
        <div className="text-neon-cyan">VC FUNDING: {fmt(vc, true)}</div>
      </div>
    </div>
  );
}
