export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem("session_token")

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  })
}
