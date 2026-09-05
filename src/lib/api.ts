const DEFAULT_API_URL = 'http://127.0.0.1:5000'

export type AdminUser = {
  id: number
  email: string
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export class ApiError extends Error {
  status?: number
  code: string

  constructor(message: string, code: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

function normalizeApiUrl(value: string | undefined) {
  const baseUrl = value?.trim() || DEFAULT_API_URL
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

export const apiBaseUrl = normalizeApiUrl(import.meta.env.VITE_API_URL)

async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const { body, ...requestOptions } = options
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  const init: RequestInit = {
    ...requestOptions,
    credentials: 'include',
    headers,
  }

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
    init.body = JSON.stringify(body)
  }

  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, init)
  } catch {
    throw new ApiError(
      'Nao foi possivel conectar ao servidor.',
      'server_unavailable',
    )
  }

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await response.json() : null

  if (!response.ok) {
    const code = typeof payload?.error === 'string' ? payload.error : 'request_failed'
    throw new ApiError('Request failed.', code, response.status)
  }

  return payload as T
}

export async function fetchApiHealth(signal?: AbortSignal) {
  return apiRequest<{ status: string }>('/api/v1/health', {
    method: 'GET',
    signal,
  })
}

export async function loginAdmin(email: string, password: string) {
  return apiRequest<{
    authenticated: true
    user: AdminUser
  }>('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export async function logoutAdmin() {
  return apiRequest<{ authenticated: false }>('/api/v1/auth/logout', {
    method: 'POST',
  })
}

export async function fetchCurrentAdminUser() {
  return apiRequest<{
    authenticated: true
    user: AdminUser
  }>('/api/v1/auth/me', {
    method: 'GET',
  })
}

export async function fetchProtectedAdminSession() {
  return apiRequest<{
    authenticated: true
    user: AdminUser
  }>('/api/v1/admin/session', {
    method: 'GET',
  })
}

export type PublicationStatus = 'draft' | 'published'

export type Publication = {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  cover_image: string | null
  status: PublicationStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export type PublicPublication = {
  id: number
  title: string
  slug: string
  summary: string
  cover_image: string | null
  published_at: string | null
}

export type PublicationPayload = {
  title: string
  slug?: string
  summary?: string
  content: string
  cover_image?: string
  status?: PublicationStatus
}

export async function getAdminPublications() {
  return apiRequest<{ items: Publication[] }>('/api/v1/admin/publications', {
    method: 'GET',
  })
}

export async function getAdminPublication(id: number | string) {
  return apiRequest<Publication>(`/api/v1/admin/publications/${id}`, {
    method: 'GET',
  })
}

export async function createPublication(data: PublicationPayload) {
  return apiRequest<Publication>('/api/v1/admin/publications', {
    method: 'POST',
    body: data,
  })
}

export async function updatePublication(id: number | string, data: PublicationPayload) {
  return apiRequest<Publication>(`/api/v1/admin/publications/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deletePublication(id: number | string) {
  return apiRequest<{ deleted: boolean }>(`/api/v1/admin/publications/${id}`, {
    method: 'DELETE',
  })
}

export async function getPublicPublications() {
  return apiRequest<{ items: PublicPublication[] }>('/api/v1/publications', {
    method: 'GET',
  })
}

export async function getPublicPublication(slug: string) {
  return apiRequest<Publication>(`/api/v1/publications/${slug}`, {
    method: 'GET',
  })
}

export type ContactPayload = {
  name: string
  email: string
  organization?: string
  phone?: string
  subject: string
  message: string
  website?: string
}

export async function sendContactMessage(data: ContactPayload) {
  return apiRequest<{ sent: boolean; message: string }>('/api/v1/contact', {
    method: 'POST',
    body: data,
  })
}
