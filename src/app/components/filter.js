"use client";
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const DateFilter = ({ onFilterApply, dt }) => {
    const [dateRange, setDateRange] = useState(null);
    const [date, setDate] = useState(null);

    const handleDateRangeChange = (e) => {
        setDateRange(e.value);
        if (e.value) setDate(null);
    };

    const handleDateChange = (e) => {
        setDate(e.value);
        if (e.value) setDateRange(null);
    };

    const handleApply = () => {
        const filters = {};
        
        if (dateRange && dateRange[0] && dateRange[1]) {
            filters.range = dateRange;
        } else if (date) {
            filters.singleDate = date;
        }

        onFilterApply(filters);
    };

    const handleExport = () => {
        if (dt && dt.current) {
            dt.current.exportCSV({fileName: 'soportes.csv'});
        }
    };

    return (
        <div className="flex justify-between items-center p-4 bg-white shadow-sm rounded-lg">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Tickets</h2>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Filtrar por:</span>
                    <Calendar 
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        selectionMode="range"
                        readOnlyInput
                        placeholder="Seleccione rango"
                        className="p-inputtext-sm"
                        showIcon
                        dateFormat="dd/mm/yy"
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">O por fecha:</span>
                    <Calendar 
                        value={date}
                        onChange={handleDateChange}
                        dateFormat="dd/mm/yy"
                        placeholder="dd/mm/aaaa"
                        className="p-inputtext-sm"
                        showIcon
                    />
                </div>
            </div>
            
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-filter"
                    className="p-button-sm"
                    onClick={handleApply}
                    tooltip='Filtrar'
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