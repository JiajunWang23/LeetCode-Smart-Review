import React from 'react';
import { Difficulty } from '../types';

export const DifficultyBadge: React.FC<{ difficulty: string | Difficulty }> = ({ difficulty }) => {
  const colors = {
    [Difficulty.Easy]: 'text-lc-green bg-lc-green/10 border-lc-green/20',
    [Difficulty.Medium]: 'text-lc-yellow bg-lc-yellow/10 border-lc-yellow/20',
    [Difficulty.Hard]: 'text-lc-red bg-lc-red/10 border-lc-red/20',
  };

  // Normalize string to key
  const key = difficulty as Difficulty;
  const style = colors[key] || colors[Difficulty.Easy];

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${style}`}>
      {difficulty}
    </span>
  );
};