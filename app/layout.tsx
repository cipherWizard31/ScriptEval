import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScriptEval",
  description: "Secure theatrical script management portal.",
};
import { Toaster } from 'react-hot-toast';
import UserBadge from "@/app/components/UserBadge";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1e1e2e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.10)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
            },
          }}
        />
        <UserBadge />
      </body>
    </html>
  );
}
