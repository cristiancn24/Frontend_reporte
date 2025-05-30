"use client";
import React from 'react';
import { GeistSans, GeistMono } from 'geist/font';
import { SessionProvider } from 'next-auth/react';
import './globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import Sidebar from '../app/components/sidebar';
import RequireAuth from '../app/components/RequireAuth';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/register'].includes(pathname);

  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`antialiased ${isAuthPage ? 'bg-gray-50' : ''}`}>
        <PrimeReactProvider>
          <SessionProvider>
            {isAuthPage ? (
              <div className="min-h-screen flex items-center justify-center">
                {children}
              </div>
            ) : (
              //<RequireAuth>
                <div className="min-h-screen bg-gray-50 flex">
                  <Sidebar />
                  <main className="flex-1 p-4 md:p-6 ml-0 md:ml-[275px] mt-0 w-[calc(100%-250px)]">
                    {children}
                  </main>
                </div>
              //</RequireAuth>
            )}
          </SessionProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}