import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { fetchUser as fetchUserService } from "../services/authService";
import { AuthContextType, AuthUser } from '../types/item';

const TOKEN_KEY = 'auth_token';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: preact.ComponentChildren }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  // Load token from storage and fetch user
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken).finally(() => setIsLoading(false)); 
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to login');
    }

    const { access_token } = await response.json();
    localStorage.setItem(TOKEN_KEY, access_token);
    setToken(access_token);
    await fetchUser(access_token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const fetchUser = async (token: string) => {
    try {
      const userData = await fetchUserService(token);
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image || '',
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      logout(); // Invalid token? log out
    }
  };

  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
