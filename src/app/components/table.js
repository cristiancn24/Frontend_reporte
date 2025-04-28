"use client";
import React, { useState, useEffect, useRef } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import DateFilter from './filter'; // Asegúrate de que la ruta sea correcta

const formatMinutesToTime = (minutes) => {
    const totalSeconds = Math.round(minutes * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    const days = Math.floor(hours / 24);
    const hoursInDay = hours % 24;

    return [days > 0 ? `${days}d` : '',
            hoursInDay > 0 ? `${hoursInDay}h` : '',
            mins > 0 ? `${mins}m` : '', 
            `${secs}s`].join(' ').trim();
};

export default function Table({onSoporteSelect, onStatsCalculated}) {
    const dt = useRef(null);
    const [soportes, setSoportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSoporte, setSelectedSoporte] = useState(null);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});

    const fetchSoportes = async (filters = {}) => {
        try {
            setLoading(true);
            const params = {};
            
            // Si no hay filtros específicos, aplica el de últimos 30 días
            if (!filters.range && !filters.singleDate) {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 30);
                params.fechaInicio = startDate.toISOString();
                params.fechaFin = endDate.toISOString();
            } else {
                // Usa los filtros proporcionados si existen
                if (filters.range && filters.range[0] && filters.range[1]) {
                    params.fechaInicio = filters.range[0].toISOString();
                    params.fechaFin = filters.range[1].toISOString();
                } else if (filters.singleDate) {
                    params.fecha = filters.singleDate.toISOString();
                }
            }

            const response = await axios.get('http://localhost:4000/api/users/soportes/estadisticas', { params });

            if (!response.data?.success || !Array.isArray(response.data.data)) {
                throw new Error('Formato de respuesta inválido');
            }
            
            const formattedData = response.data.data.map(item => ({
                id: item.id,
                name: `${item.first_name} ${item.last_name}`.trim(),
                abiertos: item.ticketsAbiertos || 0,
                cerrados: item.ticketsCerrados || 0,
                promedio: item.promedioTiempo ? formatMinutesToTime(item.promedioTiempo) : '00:00:00',
                minutosOriginales: item.promedioTiempo || 0
            }));
            
            setSoportes(formattedData);
            setError(null);

            const totalAbiertos = formattedData.reduce((sum, item) => sum + item.abiertos, 0);
            const totalCerrados = formattedData.reduce((sum, item) => sum + item.cerrados, 0);
            
            if (onStatsCalculated) {
                onStatsCalculated({
                    abiertos: totalAbiertos,
                    cerrados: totalCerrados
                });
            }

        } catch (error) {
            console.error('Error cargando soportes:', error);
            setError(error.message);
            setSoportes([]);

            if (onStatsCalculated) {
                onStatsCalculated({
                    abiertos: 0,
                    cerrados: 0
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Carga inicial sin filtros
    useEffect(() => {
        fetchSoportes(filters);
    }, [filters]);

    const handleSelectionChange = (e) => {
        setSelectedSoporte(e.value);
        if (onSoporteSelect) {
            onSoporteSelect(e.value);
        }
    };

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <PrimeReactProvider>
            <div className="flex flex-col gap-4">
                <DateFilter onFilterApply={handleFilterApply}  dt={dt}/>
                
                <div className="card justify-center mt-4">
                    {error && (
                        <div className="p-2 mb-2 bg-yellow-100 text-yellow-800 rounded">
                            Advertencia: {error}
                        </div>
                    )}
                    
                    <DataTable 
                        value={soportes}
                        key={JSON.stringify(soportes)} // Forzar recarga al cambiar filtros
                        loading={loading}
                        selectionMode="single"
                        selection={selectedSoporte}
                        onSelectionChange={handleSelectionChange}
                        dataKey="id"
                        scrollable
                        scrollHeight="70vh"
                        tableStyle={{ minWidth: '50rem' }}
                        emptyMessage="No se encontraron registros"
                        ref={dt}
                    >
                        <Column field="name" header="Nombre" sortable></Column>
                        <Column field="abiertos" header="Tickets Abiertos" sortable></Column>
                        <Column field="cerrados" header="Tickets Cerrados" sortable></Column>
                        <Column 
                            field="promedio" 
                            header="Tiempo promedio" 
                            sortable
                            sortField="minutosOriginales"
                            body={(rowData) => rowData.promedio}
                        ></Column>
                    </DataTable>
                </div>
            </div>
        </PrimeReactProvider>
    );
}