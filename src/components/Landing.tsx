interface LandingProps {
  onEnterArena: () => void;
  onViewLeaderboard: () => void;
}

export default function Landing({ onEnterArena, onViewLeaderboard }: LandingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4 relative">
      <div className="matrix-bg" />

      <div className="absolute top-6 left-6 flex items-center space-x-2 bg-red-600/20 px-4 py-2 rounded-full border border-red-500 z-20">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
        <span className="text-red-500 font-black tracking-widest animate-pulse">LIVE</span>
      </div>

      <div className="relative z-20">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter flicker hue-rotate neon-text-magenta mb-4">
          TokenBurner <span className="text-neon-cyan block md:inline">3000</span>
        </h1>
        <p className="text-xl md:text-2xl font-bold text-gray-300 max-w-3xl mx-auto uppercase tracking-widest leading-relaxed mb-12">
          Competitive AI Token Wastage. <br className="hidden md:block" />
          <span className="text-neon-orange">Live.</span>{' '}
          <span className="text-neon-green">Unhinged.</span>{' '}
          <span className="text-neon-magenta">Probably Unnecessary.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onEnterArena}
            className="bg-neon-magenta hover:bg-[#d900d9] text-white font-black text-3xl md:text-5xl px-12 py-6 border-4 border-white uppercase tracking-tighter transition-all duration-100 transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,0,255,0.8)] animate-pulse cursor-pointer"
          >
            Enter The Arena
          </button>
          <button
            onClick={onViewLeaderboard}
            className="border-2 border-neon-cyan text-neon-cyan font-black text-lg px-8 py-3 uppercase tracking-wider hover:bg-neon-cyan hover:text-black transition-colors cursor-pointer"
          >
            Hall of Shame
          </button>
        </div>
      </div>
    </div>
  );
}
