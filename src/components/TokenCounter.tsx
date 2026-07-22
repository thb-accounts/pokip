import { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';

interface TokenCounterProps {
  tokens: number;
  className?: string;
}

export const TokenCounter = ({ tokens, className = '' }: TokenCounterProps) => {
  const [displayTokens, setDisplayTokens] = useState(tokens);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (tokens !== displayTokens) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayTokens(tokens);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [tokens, displayTokens]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Coins 
          className={`w-8 h-8 text-neon-cyan transition-all duration-300 ${
            isAnimating ? 'animate-token-bounce' : ''
          }`} 
        />
        <div className="absolute inset-0 w-8 h-8 bg-neon-cyan/20 rounded-full animate-glow-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground uppercase tracking-wider">Tokens</span>
        <span 
          className={`text-2xl font-bold text-neon-cyan transition-all duration-300 ${
            isAnimating ? 'scale-110' : ''
          }`}
        >
          {displayTokens.toLocaleString()}
        </span>
      </div>
    </div>
  );
};