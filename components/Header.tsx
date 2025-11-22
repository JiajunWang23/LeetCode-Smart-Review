import React from 'react';
import { Code2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full p-6 border-b border-lc-gray flex items-center justify-between bg-lc-dark sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-lc-yellow/10 p-2 rounded-lg">
          <Code2 className="w-6 h-6 text-lc-yellow" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">LeetCode <span className="text-lc-yellow">Smart Review</span></h1>
      </div>
      <a 
        href="https://leetcode.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        Go to LeetCode ->
      </a>
    </header>
  );
};