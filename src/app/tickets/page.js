"use client";
import React from 'react';
import TicketsTable from "../components/TicketsTable";

export default function Tickets() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Contenedor principal con padding adecuado */}
            <div className="p-4 md:p-6 w-full max-w-[100vw]">
                <div className="bg-white rounded-lg shadow-sm">
                    <TicketsTable />
                </div>
            </div>
        </div>
    );
}