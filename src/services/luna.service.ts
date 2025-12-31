import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

class LunaService {
  private axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_LUNA_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  get<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.get<T>(url, config)).pipe(
      map((response: AxiosResponse<T>) => response.data)
    );
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.post<T>(url, data, config)).pipe(
      map((response: AxiosResponse<T>) => response.data)
    );
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.put<T>(url, data, config)).pipe(
      map((response: AxiosResponse<T>) => response.data)
    );
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.delete<T>(url, config)).pipe(
      map((response: AxiosResponse<T>) => response.data)
    );
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.patch<T>(url, data, config)).pipe(
      map((response: AxiosResponse<T>) => response.data)
    );
  }
}

export const lunaService = new LunaService();
