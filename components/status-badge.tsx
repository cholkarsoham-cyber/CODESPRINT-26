import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  
  let bgClass = "bg-gray-100 text-gray-700 border-gray-200";
  
  if (["active", "paid", "payment_succeeded"].includes(normalizedStatus)) {
    bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (["past_due", "trialing", "trial"].includes(normalizedStatus)) {
    bgClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (["suspended", "failed", "payment_failed"].includes(normalizedStatus)) {
    bgClass = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (["cancelled", "canceled", "subscription_cancelled"].includes(normalizedStatus)) {
    bgClass = "bg-gray-100 text-gray-700 border-gray-200";
  } else {
    bgClass = "bg-blue-50 text-blue-700 border-blue-200";
  }

  const formatText = (text: string) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgClass}`}>
      {formatText(status)}
    </span>
  );
}
