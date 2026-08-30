const DEFAULT_API_URL = 'http://127.0.0.1:5000'

function normalizeApiUrl(value: string | undefined) {
  const baseUrl = value?.trim() || DEFAULT_API_URL
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

export const apiBaseUrl = normalizeApiUrl(import.meta.env.VITE_API_URL)

export async function fetchApiHealth(signal?: AbortSignal) {
  const response = await fetch(`${apiBaseUrl}/api/v1/health`, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Healthcheck failed with status ${response.status}`)
  }

  return response.json() as Promise<{ status: string }>
}
