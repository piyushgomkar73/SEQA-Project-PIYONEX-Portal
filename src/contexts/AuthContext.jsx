import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const DEFAULT_ADMIN = {
  id: 'USR-001',
  name: 'Piyush Gomkar',
  email: 'piyush23@gmail.com',
  role: 'Super Admin',
  tenant: 'All Tenants',
  avatar: 'PG',
  avatarColor: '#3b82f6',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    const loggedUser = userData || DEFAULT_ADMIN;
    setUser(loggedUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, defaultAdmin: DEFAULT_ADMIN }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
