import axios from 'axios';
const url_api = import.meta.env.VITE_API_URL;
// Crear una instancia de Axios con la URL base
const axiosInstance = axios.create({
  baseURL: url_api,  // URL base definida en la variable de entorno
  timeout: 30000,  // Tiempo de espera para la solicitud
});

// Puedes agregar interceptores, configurar headers, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // Por ejemplo, agregar un token de autenticación si es necesario
    // config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
