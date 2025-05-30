import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Skeleton } from 'primereact/skeleton';
import { FilterMatchMode } from 'primereact/api';
import { TicketService } from '../../../services/apiService';

const TicketsTable = () => {
    const dt = useRef(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    
    const [statusOptions, setStatusOptions] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [loadingFilters, setLoadingFilters] = useState(true);
    
    const [filters, setFilters] = useState({
        estados: { value: [], matchMode: FilterMatchMode.IN },
        asignados: { value: [], matchMode: FilterMatchMode.IN },
        searchText: { value: '', matchMode: FilterMatchMode.CONTAINS },
        fechaExacta: { value: null, matchMode: FilterMatchMode.DATE_IS }
    });
    
    const [pagination, setPagination] = useState({
        first: 0,
        page: 1,
        rows: 10,
        totalRecords: 0,
    });

    // Carga inicial de opciones
    useEffect(() => {
        let isMounted = true;
        
        const loadOptions = async () => {
            try {
                const [statuses, technicians] = await Promise.all([
                    TicketService.getStatusOptions(),
                    TicketService.getAssignedUsers()
                ]);

                if (isMounted) {
                    setStatusOptions(
                        (statuses || []).map(s => ({
                            label: s.name,
                            value: s.id.toString()
                        }))
                    );
                    
                    setAssignedUsers([
                        ...(technicians || []).map(t => ({
                            label: `${t.first_name} ${t.last_name}`,
                            value: t.id.toString()
                        })),
                        { label: 'No asignado', value: 'null' }
                    ]);
                    
                    setLoadingFilters(false);
                }
            } catch (error) {
                if (isMounted) {
                    setStatusOptions([]);
                    setAssignedUsers([]);
                    setLoadingFilters(false);
                }
            }
        };

        loadOptions();
        
        return () => { isMounted = false };
    }, []);

    // Fetch de tickets
    const fetchTickets = useCallback(async () => {
        if (loadingFilters) return;
        
        setLoading(true);
        try {
            const { data, pagination: paginationData } = await TicketService.getTickets(
                pagination.page,
                pagination.rows,
                {
                    estados: filters.estados.value,
                    asignados: filters.asignados.value.filter(val => val !== 'null'),
                    searchText: filters.searchText.value,
                    fechaExacta: filters.fechaExacta.value?.toISOString()
                }
            );

            setTickets(data || []);
            setTotalRecords(paginationData?.total || 0);
            setPagination(prev => ({
                ...prev,
                totalRecords: paginationData?.total || 0
            }));
        } catch (error) {
            console.error('Error loading tickets:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.rows, filters, loadingFilters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTickets();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchTickets]);

    // Handlers seguros
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: {
                ...prev[filterName],
                value: value !== undefined ? value : 
                       (Array.isArray(value) ? [] : null)
            }
        }));
        setPagination(prev => ({ ...prev, page: 1, first: 0 }));
    };

    const clearFilters = () => {
        setFilters({
            estados: { value: [], matchMode: FilterMatchMode.IN },
            asignados: { value: [], matchMode: FilterMatchMode.IN },
            searchText: { value: '', matchMode: FilterMatchMode.CONTAINS },
            fechaExacta: { value: null, matchMode: FilterMatchMode.DATE_IS }
        });
    };

    const renderFilters = () => {
        if (loadingFilters) {
            return (
                <>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <Skeleton width="100%" height="1.5rem"/>
                            <Skeleton width="100%" height="2.5rem"/>
                        </div>
                    ))}
                </>
            );
        }

        const filterContainerClass = "flex flex-col gap-1 h-full";
        const inputClass = "w-full p-inputtext-sm h-[2.5rem]";

        return (
            <>
                <div className={filterContainerClass}>
                    <label className="text-sm text-gray-600">Fecha</label>
                    <Calendar
                        value={filters.fechaExacta.value}
                        onChange={(e) => handleFilterChange('fechaExacta', e.value)}
                        selectionMode="single"
                        dateFormat="dd/mm/yy"
                        placeholder="dd/mm/aaaa"
                        showIcon
                        className={`${inputClass} [&>input]:h-[2.5rem]`}
                    />
                </div>

                <div className={filterContainerClass}>
                    <label className="text-sm text-gray-600">Estado</label>
                    <MultiSelect
                        value={filters.estados.value}
                        onChange={(e) => handleFilterChange('estados', e.value)}
                        options={statusOptions}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Todos"
                        className={inputClass}
                        panelClassName="min-w-[250px]"
                        maxSelectedLabels={1}
                        showClear
                    />
                </div>

                <div className={filterContainerClass}>
                    <label className="text-sm text-gray-600">Asignado a</label>
                    <MultiSelect
                        value={filters.asignados.value}
                        onChange={(e) => handleFilterChange('asignados', e.value)}
                        options={assignedUsers}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Todos"
                        className={inputClass}
                        panelClassName="min-w-[250px]"
                        maxSelectedLabels={1}
                        showClear
                    />
                </div>

                <div className={filterContainerClass}>
                    <label className="text-sm text-gray-600">Buscar</label>
                    <InputText
                        value={filters.searchText.value}
                        onChange={(e) => handleFilterChange('searchText', e.target.value)}
                        placeholder="Texto..."
                        className={inputClass}
                    />
                </div>
            </>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white shadow-sm rounded-lg mb-4 gap-4">
                <div className="w-full">
                    <h2 className="text-xl font-semibold mb-3 md:mb-0">Tickets</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                        {renderFilters()}
                    </div>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto justify-end">
                    <Button 
                        icon="pi pi-filter-slash"
                        className="p-button-sm p-button-secondary"
                        onClick={clearFilters}
                        tooltip="Limpiar filtros"
                        tooltipOptions={{ position: 'bottom' }}
                        disabled={loadingFilters}
                    />
                    
                    <Button 
                        icon="pi pi-file-export"
                        className="p-button-sm p-button-success"
                        onClick={() => dt.current?.exportCSV({ fileName: 'tickets.csv' })}
                        tooltip="Exportar a CSV"
                        tooltipOptions={{ position: 'bottom' }}
                        disabled={tickets.length === 0 || loadingFilters}
                    />
                </div>
            </div>
        );
    };

    // Función para limpiar el contenido HTML
    const cleanHtmlContent = (content) => {
        if (!content) return '';
        return String(content)
            .replace(/<[^>]*>?/gm, '') // Elimina tags HTML
            .replace(/&[a-z]+;/gi, ' ') // Reemplaza entidades HTML
            .replace(/\s+/g, ' ') // Reduce múltiples espacios
            .trim();
    };

    return (
        <div className="w-full">
            {renderHeader()}
            <div className="w-full overflow-hidden">
                <DataTable
                    ref={dt}
                    value={tickets}
                    loading={loading}
                    paginator
                    lazy
                    rows={pagination.rows}
                    first={pagination.first}
                    totalRecords={pagination.totalRecords}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    responsiveLayout="stack"
                    scrollable
                    scrollHeight="flex"
                    className="w-full"
                    emptyMessage="No se encontraron tickets"
                    onPage={(e) => setPagination(prev => ({
                        ...prev,
                        first: e.first,
                        rows: e.rows,
                        page: e.page + 1
                    }))}
                >
                    <Column 
                        field="ticket" 
                        header="Ticket" 
                        sortable 
                        body={(rowData) => (
                            <span className="whitespace-nowrap text-sm font-medium">
                                {rowData.ticket}
                            </span>
                        )}
                    />
                    <Column 
                        field="subject" 
                        header="Asunto" 
                        sortable 
                        body={(rowData) => (
                            <div className="line-clamp-2 text-sm">
                                {cleanHtmlContent(rowData.subject)}
                            </div>
                        )}
                    />
                    <Column 
                        field="comment" 
                        header="Descripción" 
                        body={(rowData) => (
                            <div className="text-sm text-gray-600 min-h-[60px]">
                                {cleanHtmlContent(rowData.comment)}
                            </div>
                        )}
                        style={{ width: '25%' }} // Ancho fijo para esta columna
                    />
                    <Column 
                        field="created_by" 
                        header="Creado por" 
                        sortable 
                        body={(rowData) => (
                            <span className="text-sm">
                                {rowData.created_by}
                            </span>
                        )}
                    />
                    <Column 
                        field="assigned_to" 
                        header="Asignado a" 
                        sortable 
                        body={(rowData) => (
                            <span className="text-sm">
                                {rowData.assigned_to || 'No asignado'}
                            </span>
                        )}
                    />
                    <Column 
                        field="status" 
                        header="Estado" 
                        sortable 
                        body={(rowData) => (
                            <Tag 
                                value={rowData.status || 'Desconocido'} 
                                severity={
                                    rowData.status === 'Abierto' ? 'danger' :
                                    rowData.status === 'En progreso' ? 'warning' :
                                    rowData.status === 'Cerrado' ? 'success' : 'info'
                                }
                                className="text-xs py-1"
                            />
                        )} 
                    />
                    <Column 
                        field="created_at" 
                        header="Fecha creación" 
                        sortable 
                        body={(rowData) => (
                            <span className="text-sm whitespace-nowrap">
                                {new Date(rowData.created_at).toLocaleDateString()}
                            </span>
                        )}
                    />
                    <Column 
                        field="resolution_time" 
                        header="Tiempo resolución" 
                        sortable 
                        body={(rowData) => (
                            <span className="text-sm">
                                {rowData.resolution_time || 'N/A'}
                            </span>
                        )}
                    />
                </DataTable>
            </div>
        </div>
    );
};

export default TicketsTable;