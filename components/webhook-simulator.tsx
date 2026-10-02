"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface WebhookSimulatorProps {
  events: any[];
}

export function WebhookSimulator({ events }: WebhookSimulatorProps) {
  const [displayedLogs, setDisplayedLogs] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // When new events arrive (after a Time Machine skip), we want to "animate" them into the terminal
  // one by one to simulate live network traffic.
  useEffect(() => {
    if (!events || events.length === 0) return;
    
    // Just take the top 10 most recent events to prevent massive floods
    const recentEvents = [...events].slice(0, 10).reverse(); 
    
    setDisplayedLogs([]); // Clear for the new animation batch
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < recentEvents.length) {
        setDisplayedLogs(prev => [...prev, recentEvents[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 400); // 400ms delay between each webhook firing

    return () => clearInterval(interval);
  }, [events]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLogs]);

  return (
    <div className="bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[400px] font-mono w-full">
      
      {/* Mac-style Terminal Header */}
      <div className="bg-[#161b22] px-4 py-3 flex items-center border-b border-gray-800 flex-shrink-0">
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        </div>
        <Terminal className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-xs text-gray-400">Live Webhook Firehose — (POST /api/webhooks)</span>
      </div>

      {/* Terminal Output */}
      <div ref={scrollRef} className="p-4 overflow-y-auto flex-grow text-xs space-y-3 custom-scrollbar">
        {displayedLogs.length === 0 && (
          <div className="text-gray-600 italic">Waiting for events... Try skipping time.</div>
        )}
        
        {displayedLogs.map((evt, idx) => (
          <div key={`${evt.id}-${idx}`} className="animate-fade-in-up">
            <div className="flex items-center text-gray-400 mb-1">
              <span className="text-emerald-400 mr-2">POST</span>
              <span>/api/webhooks/stripe</span>
              <span className="ml-auto text-gray-600">{new Date(evt.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="bg-[#161b22] p-3 rounded border border-gray-800 text-gray-300">
              <div className="text-blue-400 mb-1">Event: {evt.type}</div>
              <div className="text-gray-500">{`{`}</div>
              <div className="pl-4">
                <span className="text-rose-300">"subscription_id"</span>: <span className="text-amber-300">"{evt.subscriptionId}"</span>,<br/>
                <span className="text-rose-300">"status"</span>: <span className="text-emerald-300">"{evt.details}"</span>
              </div>
              <div className="text-gray-500">{`}`}</div>
            </div>
            <div className="mt-1 text-emerald-500">↳ 200 OK</div>
          </div>
        ))}
      </div>

    </div>
  );
}
