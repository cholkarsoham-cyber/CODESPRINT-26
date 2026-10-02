import React from 'react';
import { StatusBadge } from './status-badge';
import { CheckCircle, AlertTriangle, XCircle, Info, RefreshCw, CreditCard, Play } from 'lucide-react';

interface Event {
  id: string;
  type: string;
  customerId?: string;
  customerName?: string;
  details?: string;
  createdAt: string;
}

interface EventLogProps {
  events: Event[];
}

  export function EventLog({ events }: EventLogProps) {
  const getEventIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('succeeded') || t.includes('active')) return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (t.includes('failed') || t.includes('past_due')) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    if (t.includes('suspended') || t.includes('cancel')) return <XCircle className="w-4 h-4 text-rose-500" />;
    if (t.includes('renew') || t.includes('retry')) return <RefreshCw className="w-4 h-4 text-blue-500" />;
    if (t.includes('invoice') || t.includes('payment')) return <CreditCard className="w-4 h-4 text-purple-500" />;
    if (t.includes('created') || t.includes('start')) return <Play className="w-4 h-4 text-emerald-500" />;
    return <Info className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No events recorded yet
        </div>
      ) : (
        <div className="relative border-l border-gray-200 ml-3 space-y-6 pb-4">
          {events.map((event) => (
            <div key={event.id} className="relative pl-6">
              <div className="absolute -left-2.5 mt-1.5 bg-white rounded-full border border-gray-300 p-0.5">
                {getEventIcon(event.type)}
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 hover:bg-gray-50 shadow-sm transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={event.type} />
                    {event.customerName && (
                      <span className="text-sm font-medium text-gray-800">
                        {event.customerName}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(event.createdAt).toLocaleString()}
                  </span>
                </div>
                {event.details && (
                  <p className="text-sm text-gray-600 mt-2">
                    {event.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
