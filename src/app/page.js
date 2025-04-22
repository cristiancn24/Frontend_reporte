// app/page.js
"use client";
import Bar from "./components/bar";
import React, { useState } from 'react';
import Table from "./components/table";
import DoughnutChartDemo from "./components/dchart";
import RequireAuth from "./components/RequireAuth";

export default function Home() {

  const [tableKey, setTableKey] = useState(0);
  const [generalStats, setGeneralStats] = useState({ abiertos: 0, cerrados: 0 });

  const handleStatsCalculated = (stats) => {
    setGeneralStats(stats);
};

  const handleFilterApply = (filters) => {
    setTableKey(prev => prev + 1); // Forza recarga del componente Table
};
  const [filters, setFilters] = useState({
    range: null,
    singleDate: null
  });

  const [selectedSoporte, setSelectedSoporte] = useState(null);

  const handleSoporteSelect = (soporte) => {
    setSelectedSoporte(soporte);
};


  return (
    <RequireAuth>
    <div className="min-h-screen">
      <div className="h-screen"> 
        <Bar />

        <div className="flex flex-row gap-4 p-4 h-[calc(100%-7rem)]">
          <div className="w-full md:w-3/5 h-full">
            <Table filters={filters} onSoporteSelect={handleSoporteSelect} onStatsCalculated={handleStatsCalculated}/>
          </div>
          
          <div className="w-full md:w-2/5 h-full flex items-center justify-center bg-white rounded-lg shadow">
            <DoughnutChartDemo abiertos={selectedSoporte?.abiertos} cerrados={selectedSoporte?.cerrados} selectedSoporte={selectedSoporte} generalData={generalStats}/>
          </div>
        </div>
      </div>
    </div>
    </RequireAuth>
  );
}