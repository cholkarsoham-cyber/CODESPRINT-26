import React from 'react';

type ColorType = "green" | "red" | "amber" | "blue" | "purple" | "default";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: ColorType;
}

const colorMap = {
  green: "text-emerald-600",
  red: "text-rose-600",
  amber: "text-amber-600",
  blue: "text-blue-600",
  purple: "text-purple-600",
  default: "text-gray-900",
};

export function MetricCard({ title, value, subtitle, color = "default" }: MetricCardProps) {
  const valueColor = colorMap[color] || colorMap.default;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">
      <h3 className="text-gray-600 font-medium text-sm mb-2">{title}</h3>
      <div className="mt-auto">
        <div className={`text-3xl font-bold tracking-tight ${valueColor}`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
