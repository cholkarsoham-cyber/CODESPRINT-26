import React from 'react';
import { StatusBadge } from './status-badge';

interface Invoice {
  id: string;
  customerId: string;
  customerName?: string;
  planName?: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium">Customer</th>
            <th scope="col" className="px-6 py-4 font-medium">Plan</th>
            <th scope="col" className="px-6 py-4 font-medium">Amount</th>
            <th scope="col" className="px-6 py-4 font-medium">Date</th>
            <th scope="col" className="px-6 py-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                No invoices found
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {invoice.customerName || invoice.customerId || 'Unknown Customer'}
                </td>
                <td className="px-6 py-4">
                  {invoice.planName || '-'}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  ${(invoice.amount / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={invoice.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
