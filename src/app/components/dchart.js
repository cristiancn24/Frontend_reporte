import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function DoughnutChartDemo({ abiertos, cerrados, selectedSoporte, generalData }) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const documentStyle = getComputedStyle(document.documentElement);
        
        const displayData = selectedSoporte 
            ? { abiertos: abiertos || 0, cerrados: cerrados || 0 }
            : generalData || { abiertos: 0, cerrados: 0 };

        const data = {
            labels: ['Abiertos', 'Cerrados'],
            datasets: [{
                data: [displayData.abiertos, displayData.cerrados],
                backgroundColor: [
                    documentStyle.getPropertyValue('--blue-500'), 
                    documentStyle.getPropertyValue('--yellow-500')
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--blue-400'), 
                    documentStyle.getPropertyValue('--yellow-400')
                ]
            }]
        };
        
        const options = {
            cutout: '60%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: selectedSoporte 
                        ? `Estadísticas de ${selectedSoporte.name}` 
                        : 'Estadísticas Generales',
                    font: { size: 16 }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
        setLoading(false);
    }, [abiertos, cerrados, selectedSoporte, generalData]);

    return (
        <div className="card p-4 h-full flex flex-col">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <i className="pi pi-spinner pi-spin text-2xl"></i>
                </div>
            ) : (
                <>
                    <div className="flex-1 min-h-0">
                        <Chart 
                            type="doughnut" 
                            data={chartData} 
                            options={chartOptions}
                            className="w-full h-full"
                        />
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-center">
                            <div>
                                <span className="font-semibold">Abiertos:</span> {selectedSoporte ? (abiertos || 0) : (generalData?.abiertos || 0)}
                            </div>
                            <div>
                                <span className="font-semibold">Cerrados:</span> {selectedSoporte ? (cerrados || 0) : (generalData?.cerrados || 0)}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}