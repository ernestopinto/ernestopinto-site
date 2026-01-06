import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { from, Observable, of } from 'rxjs'
import { map, delay } from 'rxjs/operators'

import type { SingleBlogPostResponse } from '../types/blog'
import type { ApiResponse } from '../types/api'
import type { Project } from '../types/projects'
import { PROJECTS } from '../data/projects'

class LunaService {
  private axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_LUNA_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // ------------------------
  // Generic HTTP helpers
  // ------------------------

  get<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.get<T>(url, config)).pipe(
        map((response: AxiosResponse<T>) => response.data)
    )
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.post<T>(url, data, config)).pipe(
        map((response: AxiosResponse<T>) => response.data)
    )
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.put<T>(url, data, config)).pipe(
        map((response: AxiosResponse<T>) => response.data)
    )
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.delete<T>(url, config)).pipe(
        map((response: AxiosResponse<T>) => response.data)
    )
  }

  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axiosInstance.patch<T>(url, data, config)).pipe(
        map((response: AxiosResponse<T>) => response.data)
    )
  }

  // ------------------------
  // Blog
  // ------------------------

  getPostById(id: number | string): Observable<SingleBlogPostResponse> {
    return this.get<SingleBlogPostResponse>(`/blog/${id}`)
  }

  // ------------------------
  // Projects (DUMMY for now)
  // ------------------------

  getProjects(): Observable<ApiResponse<Project[]>> {
    return of({
      error: 0,
      data: PROJECTS,
      message: '',
    }).pipe(delay(250))
  }

  getProjectById(id: string): Observable<ApiResponse<Project | null>> {
    const project = PROJECTS.find((p) => p.id === id) ?? null

    return of({
      error: project ? 0 : 1,
      data: project,
      message: project ? '' : 'Project not found',
    }).pipe(delay(150))
  }
}

export const lunaService = new LunaService()
