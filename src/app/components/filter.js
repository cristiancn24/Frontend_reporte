"use client";
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const DateFilter = ({ onFilterApply, dt }) => {
    const [dates, setDates] = useState({
        range: null,
        singleDate: null
    });

    const handleDateRangeChange = (e) => {
        setDates({
            range: e.value,
            singleDate: null
        });
    };

    const handleDateChange = (e) => {
        setDates({
            range: null,
            singleDate: e.value
        });
    };

    const handleApply = () => {
    const filters = {};
    
    if (dates.range?.[0] && dates.range?.[1]) {
        // Asegurarse de que las fechas tengan hora 00:00:00 y 23:59:59 respectivamente
        const startDate = new Date(dates.range[0]);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(dates.range[1]);
        endDate.setHours(23, 59, 59, 999);
        
        filters.range = [startDate, endDate];
    } else if (dates.singleDate) {
        // Para fecha única, usar todo el día
        const startDate = new Date(dates.singleDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(dates.singleDate);
        endDate.setHours(23, 59, 59, 999);
        
        filters.range = [startDate, endDate];
    }

    onFilterApply(filters);
};

    const handleClear = () => {
        setDates({ range: null, singleDate: null });
        onFilterApply({});
    };

    const handleExport = () => {
        if (dt?.current) {
            dt.current.exportCSV({
                fileName: `soportes_${new Date().toISOString().slice(0,10)}.csv`
            });
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white shadow-sm rounded-lg gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                <h2 className="text-xl font-semibold whitespace-nowrap">Tickets</h2>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-sm text-gray-600 whitespace-nowrap">Filtrar por:</span>
                        <Calendar 
                            value={dates.range}
                            onChange={handleDateRangeChange}
                            selectionMode="range"
                            readOnlyInput
                            placeholder="Rango de fechas"
                            className="p-inputtext-sm w-full md:w-auto"
                            showIcon
                            dateFormat="dd/mm/yy"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-sm text-gray-600 whitespace-nowrap">O por fecha:</span>
                        <Calendar 
                            value={dates.singleDate}
                            onChange={handleDateChange}
                            dateFormat="dd/mm/yy"
                            placeholder="Fecha específica"
                            className="p-inputtext-sm w-full md:w-auto"
                            showIcon
                        />
                    </div>
                </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto justify-end">
                
                <Button 
                    icon="pi pi-filter"
                    className="p-button-sm"
                    onClick={handleApply}
                    tooltip='Aplicar filtros'
                    tooltipOptions={{ position: 'bottom' }}
                />

                <Button 
                    icon="pi pi-filter-slash"
                    className="p-button-sm p-button-secondary"
                    onClick={handleClear}
                    tooltip='Limpiar filtros'
                    tooltipOptions={{ position: 'bottom' }}
                />

                <Button 
                    icon="pi pi-file-export"
                    className="p-button-sm p-button-success"
                    onClick={handleExport}
                    tooltip="Exportar a CSV"
                    tooltipOptions={{ position: 'bottom' }}
                    disabled={!dt?.current}
                />
            </div>
        </div>
    );
};

export default DateFilter;