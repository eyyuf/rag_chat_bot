import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 300000, // 5 minutes timeout for slow AI responses
});

// Add token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials) => API.post('/auth/login', credentials),
    register: (userData) => API.post('/auth/register', userData),
};

export const adminAPI = {
    uploadFile: (formData) => API.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getDocuments: () => API.get('/admin/documents'),
    deleteDocument: (id) => API.delete(`/admin/documents/${id}`),
};

export const chatAPI = {
    sendMessage: (question) => API.post('/chat', { question }),
};

export default API;
