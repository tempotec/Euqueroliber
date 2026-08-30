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
