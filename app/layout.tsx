import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Billing Engine — Subscription Billing & Dunning",
  description: "Subscription Billing & Dunning Engine Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
