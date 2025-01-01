// @ts-ignore
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from '../utils/auth';
import { Book, BookFormData } from '../types';

const API_URL = 'https://backendbooktrack-production.up.railway.app/api'; // Ganti APInya

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await getAuthToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error: any) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const register = async (username: string, password: string, email: string) => {
  try {
    const response = await api.post('/auth/register', { username, password, email });
    return response.data;
  } catch (error: any) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    // @ts-ignore
    return response.data.data;
  } catch (error: any) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const fetchBooks = async (params?: { genre?: string; author?: string; limit?: number; page?: number }): Promise<Book[]> => {
  try {
    const response = await api.get<{ data: Book[] }>('/books', { params });
    return response.data.data;
  } catch (error: any) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const fetchBookDetail = async (bookId: string): Promise<Book> => {
  try {
    const response = await api.get<{ data: Book }>(`/books/${bookId}`);
    return response.data.data;
  } catch (error: any) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const addBook = async (bookData: { title: string; author: string; genre: string; description: string; totalPages: number }): Promise<Book> => {
  try {
    const response = await api.post<{ data: Book }>('/books', bookData);
    return response.data.data;
  } catch (error: any) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const updateBook = async (bookId: string, bookData: BookFormData): Promise<Book> => {
  try {
    const response = await api.put<{ data: Book }>(`/books/${bookId}`, bookData);
    return response.data.data;
  } catch (error: any) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const deleteBook = async (bookId: string): Promise<void> => {
  try {
    await api.delete(`/books/${bookId}`);
  } catch (error: any) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};

export const createBook = async (bookData: BookFormData): Promise<Book> => {
  try {
    const response = await api.post<{ data: Book }>('/books', bookData);
    return response.data.data;
  } catch (error: any) {
    const apiError = error as any;
    throw apiError.response?.data || { message: 'Network error' };
  }
};