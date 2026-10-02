"use client";

import React, { useState, useEffect } from 'react';
import { MetricCard } from '@/components/metric-card';
import { TimeMachine } from '@/components/time-machine';
import { InvoiceTable } from '@/components/invoice-table';
import { EventLog } from '@/components/event-log';
import { MRRChart } from '@/components/mrr-chart';
import { WebhookSimulator } from '@/components/webhook-simulator';
interface DashboardData {
  mrr: number;
  counts: {
    trial: number;
    active: number;
    past_due: number;
    suspended: number;
    cancelled: number;
  };
  churn: number;
  recentInvoices: any[];
  events: any[];
  simulatedTime: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSkip = async (days: number) => {
    setActionLoading(true);
    try {
      await fetch('/api/time/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days })
      });
      await fetchDashboard();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = async () => {
    setActionLoading(true);
    try {
      await fetch('/api/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true })
      });
      await fetchDashboard();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl text-gray-500 animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  const { mrr = 0, counts = { trial: 0, active: 0, past_due: 0, suspended: 0, cancelled: 0 }, churn = 0, recentInvoices = [], events = [], simulatedTime = new Date().toISOString() } = data || {};

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Revenue Dashboard</h1>
            <p className="text-gray-500 mt-1">Subscription Billing & Dunning Engine</p>
          </div>
          
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{counts.trial} Trial</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{counts.active} Active</span>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{counts.past_due} Past Due</span>
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">{counts.suspended} Suspended</span>
          </div>
        </header>

        <TimeMachine 
          currentTime={simulatedTime} 
          onSkip={handleSkip} 
          onReset={handleReset}
          isLoading={actionLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Monthly Recurring Revenue" 
            value={`$${mrr.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} 
            color="green" 
          />
          <MetricCard 
            title="Active Subscriptions" 
            value={counts.active} 
            subtitle={`+${counts.trial} in trial`}
            color="blue" 
          />
          <MetricCard 
            title="At Risk / Suspended" 
            value={`${counts.past_due} / ${counts.suspended}`}
            color="red" 
          />
          <MetricCard 
            title="Churn Rate" 
            value={`${churn.toFixed(1)}%`}
            color="amber" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MRRChart currentMrr={mrr} churnRate={churn} />
          <WebhookSimulator events={events} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-gray-200 bg-white/50">
                <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
              </div>
              <InvoiceTable invoices={recentInvoices} />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
              <div className="px-6 py-5 border-b border-gray-200 bg-white/50 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-900">Event Log</h2>
                <p className="text-xs text-gray-500 mt-1">System activity and lifecycle events</p>
              </div>
              <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
                <EventLog events={events} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
