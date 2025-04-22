// utils/auth.js (nuevo)
export const getAuthData = () => {
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('authResponse') || 'null');
        return { token, user: userData };
      } catch (error) {
        console.error("Error al leer authData:", error);
        return { token: null, user: null };
      }
    }
    return { token: null, user: null };
  };
  
  export const isAuthenticated = () => {
    return !!getAuthData().token;
  };