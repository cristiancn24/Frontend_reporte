"use client";
import React from 'react';
import { GeistSans, GeistMono } from 'geist/font'; // Nuevo import correcto
import {SessionProvider} from 'next-auth/react';
import './globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Tema
import 'primereact/resources/primereact.min.css';                 // Core CSS
import 'primeicons/primeicons.css';                               // Íconos
import { PrimeReactProvider } from 'primereact/api';


export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <PrimeReactProvider>
        <SessionProvider>
        {children}
        </SessionProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}