import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

export const fetchData = async () => {
    try {
      const response = await api.get('/api/data');
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos:', error);
      throw error; // Puedes manejar esto en el componente
    }
  };

  export const saveData = async (data) => {
    try {
      const response = await api.post('/api/save', { data });
      return response.data;
    } catch (error) {
      console.error('Error al guardar datos:', error);
      throw error;
    }
  };