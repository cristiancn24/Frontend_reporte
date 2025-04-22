const fetchSoportes = async (filters = {}) => {
  try {
    setLoading(true);
    const params = {};
    
    // Asegurar formato correcto de fechas
    if (filters.range && filters.range[0] && filters.range[1]) {
      params.fechaInicio = filters.range[0].toISOString().split('T')[0]; // Solo fecha
      params.fechaFin = filters.range[1].toISOString().split('T')[0];
    } else if (filters.singleDate) {
      params.fecha = filters.singleDate.toISOString().split('T')[0];
    }

    console.log('Enviando filtros:', params); // Depuración

    const response = await axios.get('http://localhost:4000/api/users/soportes/estadisticas', { 
      params,
      paramsSerializer: params => {
        return Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
      }
    });

    console.log('Datos recibidos:', response.data); // Depuración

    if (!response.data?.success) {
      throw new Error(response.data.message || 'Error en la respuesta del servidor');
    }

    const formattedData = response.data.data.map(item => ({
      id: item.id,
      name: `${item.first_name} ${item.last_name}`.trim(),
      abiertos: item.ticketsAbiertos || 0,
      cerrados: item.ticketsCerrados || 0,
      promedio: item.promedioTiempo ? formatMinutesToTime(item.promedioTiempo) : '0s',
      minutosOriginales: item.promedioTiempo || 0
    }));

    console.log('Datos formateados:', formattedData); // Depuración
    
    setSoportes(formattedData);
    setError(null);
  } catch (error) {
    console.error('Error:', error);
    setError(error.message);
    setSoportes([]);
  } finally {
    setLoading(false);
  }
};