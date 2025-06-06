"use client";
import React from 'react';
import { BiSolidHome } from "react-icons/bi";
import { IoTicketSharp } from "react-icons/io5";
import { Avatar } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from 'next-auth/react'; // Importa useSession
import LogoutButton from './LogoutButton';
import { getRoleName } from '../utils/roles';

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession(); // Obtiene la sesión
    
    const isActive = (path) => pathname.startsWith(path);

    const handleNavigation = (path) => {
        router.push(path);
    };

     // Lógica para mostrar datos del usuario (igual que en Bar.js)
     const getUserData = () => {
        if (status === 'authenticated' && session?.user) {
          const user = session.user;
          return {
            displayName: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.email?.split('@')[0] || 'Usuario',
            role: user.role_id ? getRoleName(user.role_id) : 'Rol no definido'
          };
        }
        return {
          displayName: 'Invitado',
          role: ' '
        };
      };

    const userData = getUserData();

    return (
        <div className="w-[275px] bg-[#1f7a8c] h-screen flex flex-col fixed z-50">
            {/* Logo y título */}
            <div className="flex items-center p-4 border-b border-[#4da1b9]">
                <img
                    src="/assets/logo_pasaporte.png"
                    className="w-9 h-9"
                    alt="Logo"
                />
                <h3 className="text-xl font-bold text-white ml-3">Reportes</h3>
            </div>
            
            {/* Menú */}
            <div className="flex flex-col flex-grow p-2 space-y-1">
                <button 
                    onClick={() => handleNavigation('/home')}
                    className={`flex items-center p-3 rounded text-white text-sm transition-all ${
                        isActive('/home') ? 'bg-[#4da1b9] font-medium' : 'hover:bg-[#4da1b9]/50'
                    }`}
                >
                    <BiSolidHome className="w-5 h-5" />
                    <span className="ml-3">Inicio</span>
                </button>

                <button 
                    onClick={() => handleNavigation('/tickets')}
                    className={`flex items-center p-3 rounded text-white text-sm transition-all ${
                        isActive('/tickets') ? 'bg-[#4da1b9] font-medium' : 'hover:bg-[#4da1b9]/50'
                    }`}
                >
                    <IoTicketSharp className="w-5 h-5" />
                    <span className="ml-3">Tickets</span>
                </button>
            </div>

            {/* Pie de página */}
            <div className="p-3 border-t border-[#4da1b9]">
                <div className="flex items-center">
                    <Avatar className="!w-8 !h-8" />
                    <div className="ml-3 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{userData.displayName}</p>
                        <p className="text-xs text-gray-200 truncate">{userData.role}</p>
                    </div>
                    <div className="ml-auto">
                        <LogoutButton className="text-white hover:text-gray-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}