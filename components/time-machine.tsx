"use client";

import React, { useState } from 'react';
import { Clock, RotateCcw, FastForward, Play } from 'lucide-react';

interface TimeMachineProps {
  currentTime: string;
  onSkip: (days: number) => Promise<void>;
  onReset: () => Promise<void>;
  isLoading: boolean;
}

export function TimeMachine({ currentTime, onSkip, onReset, isLoading }: TimeMachineProps) {
  const [customDays, setCustomDays] = useState<number>(7);

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "Loading...";
    try {
      const date = new Date(timeStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4 text-emerald-700 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 w-full md:w-auto">
        <Clock className="w-6 h-6" />
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Simulated Time</p>
          <p className="text-lg font-bold">{formatTime(currentTime)}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <button 
            onClick={() => onSkip(1)} 
            disabled={isLoading}
            className="px-3 py-1.5 text-sm font-medium bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> 1 Day
          </button>
          <button 
            onClick={() => onSkip(3)} 
            disabled={isLoading}
            className="px-3 py-1.5 text-sm font-medium bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <FastForward className="w-3.5 h-3.5" /> 3 Days
          </button>
          <button 
            onClick={() => onSkip(31)} 
            disabled={isLoading}
            className="px-3 py-1.5 text-sm font-medium bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <FastForward className="w-4 h-4" /> 31 Days
          </button>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <input 
            type="number" 
            min="1" 
            value={customDays} 
            onChange={(e) => setCustomDays(parseInt(e.target.value) || 0)}
            className="w-16 px-2 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-center focus:outline-none focus:border-emerald-500"
            disabled={isLoading}
          />
          <button 
            onClick={() => onSkip(customDays)} 
            disabled={isLoading || customDays <= 0}
            className="px-3 py-1.5 text-sm font-medium bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-md transition-colors disabled:opacity-50"
          >
            Skip
          </button>
        </div>

        <button 
          onClick={onReset} 
          disabled={isLoading}
          className="ml-auto md:ml-0 p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          title="Reset Clock"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="md:hidden text-sm font-medium">Reset</span>
        </button>
      </div>
    </div>
  );
}
