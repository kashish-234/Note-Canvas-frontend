import axios, { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

// Add an interceptor to include the token in every request
api.interceptors.request.use(
  (config: AxiosRequestConfig<any>): InternalAxiosRequestConfig<any> => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure headers are initialized
      config.headers = config.headers || {};
      config.headers['x-auth-token'] = token;
    }

    // Cast the config to InternalAxiosRequestConfig to resolve the type issue
    return config as InternalAxiosRequestConfig<any>;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const signup = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data && response.data.token) {
    setAuthToken(response.data.token);
  }
  return response.data;
};

// Add this function to your API file
export const getUserInfo = async () => {
    const response = await api.get('/auth'); // This endpoint returns user info by token
    return response.data; // Assuming the response contains user information
  };
  

export const logout = () => {
  setAuthToken('');
};

export const getNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

export const createNote = async (noteData: any) => {
  try {
    const response = await api.post('/notes', noteData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error; // Re-throw the error for further handling if needed
  }
};

export const updateNote = async (id: string, noteData: any) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

export default api;
