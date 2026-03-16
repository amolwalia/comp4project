import { createContext, useEffect, useState } from 'react';
import * as api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        const data = await api.getCurrentUser();
        if (isMounted) {
          setUser(data.user);
        }
      } catch (_error) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  async function signup(payload) {
    const data = await api.signup(payload);
    setUser(data.user);
    return data.user;
  }

  async function login(payload) {
    const data = await api.login(payload);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await api.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        signup,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

