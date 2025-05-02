"use client";
import React, { useState, useEffect, use } from 'react';
import Table from "../components/table";
import DoughnutChartDemo from "../components/dchart";

export default function Home() {
  const [tableKey, setTableKey] = useState(0);
  const [generalStats, setGeneralStats] = useState({ abiertos: 0, cerrados: 0 });
  const [filters, setFilters] = useState({
    range: null,
    singleDate: null
  });
  const [selectedSoporte, setSelectedSoporte] = useState(null);
  const [loading, setLoading] = useState(null);

  const handleStatsCalculated = (stats) => {
    setGeneralStats(stats);
    setLoading(false);
  };

  const handleFilterApply = (filters) => {
    setLoading(true);
    setTableKey(prev => prev + 1);
    setFilters(filters);
  };

  const handleSoporteSelect = (soporte) => {
    setSelectedSoporte(soporte);
  };

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Contenido principal */}
      <main className="flex-1 p-4 md:p-6 w-full max-w-[100vw] overflow-x-hidden">
        {/* Encabezado y estadísticas */}
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

        {/* Contenedor flexible para tabla y gráfico */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabla - Ocupa todo el ancho en móvil */}
          <div className="w-full lg:w-[70%] bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="overflow-x-auto">
              <Table 
                filters={filters} 
                onSoporteSelect={handleSoporteSelect} 
                onStatsCalculated={handleStatsCalculated}
                key={tableKey}
              />
            </div>
          </div>
          
          {/* Gráfico - Ocupa todo el ancho en móvil (debajo de la tabla) */}
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