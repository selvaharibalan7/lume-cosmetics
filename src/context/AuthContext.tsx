import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Automatically log in a dummy user for the static frontend!
    setUser({
      id: 1,
      name: "Guest User",
      email: "guest@lume.com",
      created_at: new Date().toISOString()
    });
    setLoading(false);
  }, []);

  const login = async (data: any) => {
    setUser({
      id: 1,
      name: "Guest User",
      email: data.email || "guest@lume.com",
      created_at: new Date().toISOString()
    });
  };

  const register = async (data: any) => {
    setUser({
      id: 1,
      name: data.name || "Guest User",
      email: data.email || "guest@lume.com",
      created_at: new Date().toISOString()
    });
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
