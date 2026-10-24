const TOKEN_KEY = 'portal.token';

const OFFLINE_MESSAGE = 'Cannot reach the server. Make sure the server is running (npm run dev in the server folder).';

// "Remember me" keeps the token after the browser is closed (localStorage);
// otherwise it lasts only for this tab (sessionStorage).
export const getToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

export function saveToken(token, remember) {
  clearToken();
  (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, status, fields = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

// All requests go to /api, which Vite forwards to the Express server
export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError(OFFLINE_MESSAGE, 0);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.error || OFFLINE_MESSAGE, res.status, data?.fields);
  return data;
}
