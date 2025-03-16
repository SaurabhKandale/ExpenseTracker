import apiClient from "./apiClient";

export const apiService = {
  get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return apiClient.get(url, { params }).then((response) => response.data);
  },
  post<T>(url: string, data?: T): Promise<T> {
    return apiClient.post(url, data).then((response) => response.data);
  },
  put<T>(url: string, data?: unknown): Promise<T> {
    return apiClient.put(url, data).then((response) => response.data);
  },
  delete<T>(url: string): Promise<T> {
    return apiClient.delete(url).then((response) => response.data);
  },
};
