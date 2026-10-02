"use client";

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface MRRChartProps {
  currentMrr: number;
  churnRate: number;
}

export function MRRChart({ currentMrr, churnRate }: MRRChartProps) {
  // Generate a 6-month forecast based on current MRR and an assumed 10% month-over-month new sales growth, minus the actual churn.
  const forecastData = useMemo(() => {
    const data = [];
    let projectedMrr = currentMrr;
    const months = ['Current', 'Month +1', 'Month +2', 'Month +3', 'Month +4', 'Month +5', 'Month +6'];
    
    for (let i = 0; i < 7; i++) {
      data.push({
        name: months[i],
        MRR: Math.round(projectedMrr * 100) / 100
      });
      // Simple formula: Grow by 10%, shrink by churn rate
      const growth = projectedMrr * 0.10;
      const churnLost = projectedMrr * (churnRate / 100);
      projectedMrr = projectedMrr + growth - churnLost;
      
      // Prevent negative MRR in terrible churn scenarios
      if (projectedMrr < 0) projectedMrr = 0;
    }
    return data;
  }, [currentMrr, churnRate]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full h-[400px] flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">MRR 6-Month Forecast</h2>
        <p className="text-xs text-gray-500">AI-Projected trajectory based on your current {churnRate.toFixed(1)}% churn rate.</p>
      </div>
      <div className="flex-grow w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Projected MRR']}
            />
            <Area type="monotone" dataKey="MRR" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
