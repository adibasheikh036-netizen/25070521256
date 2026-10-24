import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, clearToken, getToken, saveToken } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  // 'checking' while a saved token is verified, then 'authed' or 'guest'
  const [status, setStatus] = useState(() => (getToken() ? 'checking' : 'guest'));
  // 'signup' or 'login' right after the form is sent, so the dashboard can greet
  const [greeting, setGreeting] = useState(null);

  const loadProfile = useCallback(async () => {
    const data = await api('/auth/me', { token: getToken() });
    setUser(data.user);
    setStats(data.stats);
    return data;
  }, []);

  // On page refresh: check the saved token with the server
  useEffect(() => {
    if (!getToken()) return;
    loadProfile()
      .then(() => setStatus('authed'))
      .catch((err) => {
        if (err.status === 401) clearToken();
        setStatus('guest');
      });
  }, [loadProfile]);

  async function authenticate(path, body, remember, kind) {
    const data = await api(path, { method: 'POST', body });
    saveToken(data.token, remember);
    setUser(data.user);
    setGreeting(kind);
    setStatus('authed');
    loadProfile().catch(() => {}); // loads the dashboard numbers
  }

  const value = {
    user,
    stats,
    status,
    greeting,
    clearGreeting: () => setGreeting(null),
    login: (email, password, remember) => authenticate('/auth/login', { email, password }, remember, 'login'),
    signup: (details) => authenticate('/auth/signup', details, true, 'signup'),
    logout: () => {
      clearToken();
      setUser(null);
      setStats(null);
      setStatus('guest');
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
