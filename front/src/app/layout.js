import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { FinanceProvider } from '../context/FinanceContext';
import Navigation from '../components/Navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gestor Financeiro Pessoal",
  description: "Aplicativo para gerenciar suas finanças pessoais",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <FinanceProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position="top-right" />
        </FinanceProvider>
      </body>
    </html>
  );
}
