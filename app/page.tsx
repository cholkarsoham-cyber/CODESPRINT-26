"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New customer form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('tok_success');

  const fetchData = async () => {
    try {
      const [plansRes, customersRes] = await Promise.all([
        fetch('/api/plans').then(r => r.json()),
        fetch('/api/customers').then(r => r.json())
      ]);
      if (plansRes.success) setPlans(plansRes.data || []);
      if (customersRes.success) setCustomers(customersRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeed = async () => {
    setLoading(true);
    await fetch('/api/seed', { method: 'POST' });
    await fetchData();
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    
    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, paymentToken: token })
    });
    
    setName('');
    setEmail('');
    await fetchData();
  };

  const handleSubscribe = async (customerId: string, planId: string) => {
    await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, planId })
    });
    alert('Subscribed successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 space-y-16">
      
      <header className="text-center space-y-4 max-w-3xl mt-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
          Subscription Billing Engine
        </h1>
        <p className="text-xl text-gray-600">
          A powerful sandbox for testing subscription lifecycle, billing, and automated dunning.
        </p>
        <div className="flex gap-4 justify-center pt-6">
          <Link href="/dashboard" className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition">
            Go to Dashboard
          </Link>
          <button onClick={handleSeed} className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition border border-gray-200 shadow-sm">
            Seed Demo Data
          </button>
        </div>
      </header>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading data...</div>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Available Plans</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map(plan => (
                <div key={plan.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="text-2xl font-bold text-emerald-600 mt-2">${(plan.price / 100).toFixed(2)}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide mt-1">/ {plan.interval}</div>
                </div>
              ))}
              {plans.length === 0 && <p className="text-gray-500">No plans found. Try seeding demo data.</p>}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-8">
              <h2 className="text-xl font-bold mb-4">Create Customer</h2>
              <form onSubmit={handleCreateCustomer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Payment Token</label>
                  <select value={token} onChange={e => setToken(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500">
                    <option value="tok_success">tok_success (Always Succeeds)</option>
                    <option value="tok_fail">tok_fail (Always Fails)</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors">
                  Add Customer
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">Customers & Subscriptions</h2>
            <div className="space-y-4">
              {customers.map(customer => (
                <div key={customer.id} className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${customer.paymentToken === 'tok_success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        {customer.paymentToken}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select 
                      id={`plan-${customer.id}`}
                      className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                    >
                      {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <button 
                      onClick={() => {
                        const planId = (document.getElementById(`plan-${customer.id}`) as HTMLSelectElement).value;
                        if(planId) handleSubscribe(customer.id, planId);
                      }}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md text-sm font-medium transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              ))}
              {customers.length === 0 && <p className="text-gray-500">No customers found.</p>}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
