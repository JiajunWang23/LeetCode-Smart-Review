import React from 'react';
import { Problem } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { AlertTriangle, CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  isReview?: boolean;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, isReview = false }) => {
  const searchUrl = `https://leetcode.com/problemset/all/?search=${encodeURIComponent(problem.title)}`;

  return (
    <div className="group relative bg-lc-black border border-lc-gray rounded-xl p-5 hover:border-lc-yellow/50 transition-all duration-300 flex flex-col h-full">
      {/* Status Icon (Top Right) */}
      <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      <div className="flex items-start gap-3 mb-3 pr-8">
        {isReview ? (
            <CheckCircle2 className="w-5 h-5 text-lc-green shrink-0 mt-0.5" />
        ) : (
            <ArrowRight className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        )}
        <div>
            <h3 className="font-semibold text-lg leading-tight mb-1">{problem.title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
                <DifficultyBadge difficulty={problem.difficulty} />
                <span className="text-xs text-gray-400 bg-lc-gray/30 px-2 py-1 rounded">{problem.topic}</span>
            </div>
        </div>
      </div>

      {/* Failure Rate Warning */}
      {problem.highFailureRate && (
        <div className="mt-3 flex items-center gap-2 bg-red-900/20 text-red-400 text-xs px-3 py-2 rounded-lg border border-red-900/30">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>High Failure Rate: Tricky edge cases usually cause bugs here.</span>
        </div>
      )}

      <div className="mt-auto pt-4">
        <p className="text-sm text-gray-400 italic">
            "{problem.reason}"
        </p>
      </div>
    </div>
  );
};