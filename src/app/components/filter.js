"use client";
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';

const DateFilter = ({ onFilterApply }) => {
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
            
            <div>
                <button 
                    className="p-button p-button-sm"
                    onClick={handleApply}
                >
                    <i className="pi pi-filter"></i> 
                </button>
            </div>
        </div>
    );
};

export default DateFilter;