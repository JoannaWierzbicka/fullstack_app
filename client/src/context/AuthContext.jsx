import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { logoutUser } from '../api/auth.js';
import { AUTH_EVENTS } from '../api/client.js';
import { authStorage } from './authStorage.js';

const initialState = {
  user: null,
  session: null,
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [{ user, session }, setAuthState] = useState(() => ({
    user: authStorage.getUser(),
    session: authStorage.getSession(),
  }));
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      authStorage.clear();
      setAuthState(initialState);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
      }
    };
  }, []);

  useEffect(() => {
    authStorage.setUser(user);
  }, [user]);

  useEffect(() => {
    authStorage.setSession(session);
  }, [session]);

  const login = useCallback(({ user: nextUser, session: nextSession }) => {
    const normalizedUser = nextUser ?? null;
    const normalizedSession = nextSession ?? null;

    authStorage.setUser(normalizedUser);
    authStorage.setSession(normalizedSession);

    setAuthState({
      user: normalizedUser,
      session: normalizedSession,
    });
  }, []);

  const logout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const accessToken = session?.access_token;
      if (accessToken) {
        await logoutUser({ token: accessToken });
      }
    } catch (error) {
      console.error('Failed to log out user', error);
    } finally {
      authStorage.clear();
      setAuthState(initialState);
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, session]);

  const value = useMemo(
    () => ({
      user,
      session,
      login,
      logout,
      isLoggingOut,
      isAuthenticated: Boolean(user),
    }),
    [user, session, isLoggingOut, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
