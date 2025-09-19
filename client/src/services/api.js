import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Notes
export const getNotes = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.status) params.append('status', filters.status);
  if (filters.tag) params.append('tag', filters.tag);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  
  const response = await api.get(`/notes?${params.toString()}`);
  return response.data;
};

export const getNote = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await api.post('/notes', noteData);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

// Métadonnées
export const getCategories = async () => {
  const response = await api.get('/notes/meta/categories');
  return response.data;
};

export const getTags = async () => {
  const response = await api.get('/notes/meta/tags');
  return response.data;
};

export default api;
