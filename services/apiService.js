import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  paramsSerializer: {
    encode: (param) => encodeURIComponent(param),
    indexes: false // Para arrays: ?estados=1&estados=2
  }
});


export const TicketService = {
  async getTickets(page = 1, limit = 10, filters = {}) {
    try {
      // Transformación específica para tu backend
      const params = {
        page,
        limit,
        ...(filters.estados?.length > 0 && { 
          estados: filters.estados 
        }),
        ...(filters.asignados?.length > 0 && { 
          asignados: filters.asignados.map(id => 
            id === 'null' ? 'null' : id
          )
        }),
        ...(filters.searchText && { searchText: filters.searchText }),
        ...(filters.fechaExacta && { 
          fechaExacta: new Date(filters.fechaExacta).toISOString() 
        })
      };

      const response = await apiClient.get('/tickets', { params });
      
      return {
        data: response.data?.data || [],
        pagination: response.data?.pagination || { 
          total: 0,
          page,
          limit
        }
      };
    } catch (error) {
      console.error('Error en getTickets:', error);
      return { 
        data: [], 
        pagination: { 
          total: 0,
          page,
          limit
        } 
      };
    }
  },

  async getStatusOptions() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/tickets/status-options`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching status options:', error);
      return [];
    }
  },

  async getAssignedUsers() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/users/tecnicos`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching assigned users:', error);
      return [];
    }
  }
};