import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function DoughnutChartDemo({ abiertos, cerrados, selectedSoporte, generalData }) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        
        // Datos a mostrar (específicos o generales)
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
                plugins: {
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
    }, [abiertos, cerrados, selectedSoporte, generalData]);

    return (
        <div className="card flex flex-col justify-content-center items-center">
            <Chart 
                type="doughnut" 
                data={chartData} 
                options={chartOptions} 
                width='50vh' 
                height='50vh' 
                className="w-full md:w-30rem" 
            />
            <div className="p-4 text-center">
                {selectedSoporte ? (
                    <>
                        <p>Tickets abiertos: {abiertos || 0}</p>
                        <p>Tickets cerrados: {cerrados || 0}</p>
                    </>
                ) : (
                    <>
                        <p>Tickets abiertos totales: {generalData?.abiertos || 0}</p>
                        <p>Tickets cerrados totales: {generalData?.cerrados || 0}</p>
                    </>
                )}
            </div>
        </div>
    );
}