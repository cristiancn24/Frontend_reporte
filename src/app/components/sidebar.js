"use client";
import React from 'react';
import { BiSolidHome } from "react-icons/bi";
import { IoTicketSharp } from "react-icons/io5";
import { Avatar } from "@mui/material";
import { PiSignOutBold } from "react-icons/pi";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    
    const isActive = (path) => pathname.startsWith(path);

    const handleNavigation = (path) => {
        router.push(path);
    };

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
                        <p className="text-sm font-medium text-white truncate">Usuario</p>
                        <p className="text-xs text-gray-200 truncate">Rol</p>
                    </div>
                    <button 
                        onClick={() => handleNavigation('/login')}
                        className="ml-auto p-1 text-white hover:text-gray-200"
                    >
                        <PiSignOutBold className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}