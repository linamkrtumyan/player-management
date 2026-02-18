/**
 * HTTP-клиент для работы с API.
 * Использует axios для запросов к Swagger API.
 */
import axios, { type AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';
import type { ApiErrorBody } from '../types';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Извлекает понятное сообщение об ошибке из ответа API или Axios.
 * Согласно Swagger, ошибки возвращаются в формате { data?: string, err: string }.
 * 
 * Обрабатывает различные типы ошибок:
 * - Ошибки от сервера (недостаточно средств, некорректная сумма и т.д.)
 * - Ошибки валидации
 * - Сетевые ошибки
 * - Ошибки таймаута
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const data = axiosError.response?.data;
    
    // Приоритет: поле err из ответа API (основное поле для ошибок)
    // Это может быть "недостаточно средств", "некорректная сумма" и т.д.
    if (data && typeof data.err === 'string' && data.err.trim()) {
      return data.err;
    }
    
    // Fallback на data, если err пустое
    if (data && typeof data.data === 'string' && data.data.trim()) {
      return data.data;
    }
    
    // Стандартные HTTP статусы с понятными сообщениями для пользователя
    if (axiosError.response?.status === 400) {
      // 400 Bad Request - может быть некорректная сумма, недостаточно средств и т.д.
      return data?.err ?? 'Некорректный запрос. Проверьте введённые данные.';
    }
    if (axiosError.response?.status === 401) {
      return data?.err ?? 'Требуется авторизация. Войдите в систему.';
    }
    if (axiosError.response?.status === 404) {
      return 'Ресурс не найден. Устройство или игрок не существует.';
    }
    if (axiosError.response?.status === 408) {
      return data?.err ?? 'Превышено время ожидания. Проверьте подключение к интернету и попробуйте снова.';
    }
    if (axiosError.response?.status === 422) {
      // 422 Unprocessable Entity - ошибка валидации данных
      return data?.err ?? 'Ошибка валидации данных. Проверьте правильность введённой суммы.';
    }
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      return data?.err ?? 'Ошибка сервера. Попробуйте позже или обратитесь в поддержку.';
    }
    
    // Сетевые ошибки (нет подключения к интернету)
    if (axiosError.code === 'ERR_NETWORK' || axiosError.message.includes('Network Error')) {
      return 'Нет подключения к интернету. Проверьте ваше соединение.';
    }
    
    // Ошибки таймаута
    if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
      return 'Превышено время ожидания ответа от сервера. Попробуйте снова.';
    }
    
    if (axiosError.message) return axiosError.message;
  }
  
  if (error instanceof Error) return error.message;
  return 'Произошла неизвестная ошибка. Попробуйте снова.';
}
