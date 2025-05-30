"use client";
import React, { useState } from 'react';
import Table from "../components/table";
import DoughnutChartDemo from "../components/dchart";

export default function Home() {
  const [generalStats, setGeneralStats] = useState({ abiertos: 0, cerrados: 0 });
  const [selectedSoporte, setSelectedSoporte] = useState(null);

  const handleStatsCalculated = (stats) => {
    setGeneralStats(stats);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <main className="flex-1 p-4 md:p-6 w-full max-w-[100vw] overflow-x-hidden">
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-semibold mb-3">Estadísticas Generales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600">Tickets Abiertos</p>
              <p className="text-2xl font-bold">{generalStats.abiertos}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600">Tickets Cerrados</p>
              <p className="text-2xl font-bold">{generalStats.cerrados}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[70%] bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <Table 
              onSoporteSelect={setSelectedSoporte} 
              onStatsCalculated={handleStatsCalculated}
            />
          </div>
          
          <div className="w-full lg:w-[30%] bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <DoughnutChartDemo 
              abiertos={selectedSoporte?.abiertos} 
              cerrados={selectedSoporte?.cerrados} 
              selectedSoporte={selectedSoporte} 
              generalData={generalStats}
            />
          </div>
        </div>
      </main>
    </div>
  );
}