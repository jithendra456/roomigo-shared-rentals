import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, Role, User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isPoster: boolean;
  isRenter: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  quickLogin: (accountType: 'admin' | 'poster' | 'renter') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('roomigo_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('roomigo_token'));
  const [isLoading, setIsLoading] = useState<boolean>(!user);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('roomigo_token');
      if (storedToken) {
        try {
          const u = await authService.getCurrentUser();
          const userData: User = {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            occupation: u.occupation,
            companyOrCollege: u.companyOrCollege,
            avatarUrl: u.avatarUrl,
            phoneVerified: u.phoneVerified,
            idVerified: u.idVerified,
            verificationStatus: u.verificationStatus,
          };
          setUser(userData);
          localStorage.setItem('roomigo_user', JSON.stringify(userData));
        } catch (err) {
          localStorage.removeItem('roomigo_token');
          localStorage.removeItem('roomigo_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const saveAuth = (authRes: AuthResponse) => {
    localStorage.setItem('roomigo_token', authRes.token);
    setToken(authRes.token);
    const userData: User = {
      id: authRes.id,
      name: authRes.name,
      email: authRes.email,
      phone: authRes.phone,
      role: authRes.role,
      occupation: authRes.occupation,
      companyOrCollege: authRes.companyOrCollege,
      avatarUrl: authRes.avatarUrl,
      phoneVerified: authRes.phoneVerified,
      idVerified: authRes.idVerified,
      verificationStatus: authRes.verificationStatus,
    };
    setUser(userData);
    localStorage.setItem('roomigo_user', JSON.stringify(userData));
    closeAuthModal();
  };

  const login = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    saveAuth(res);
  };

  const register = async (data: any) => {
    const res = await authService.register(data);
    saveAuth(res);
  };

  const logout = () => {
    localStorage.removeItem('roomigo_token');
    localStorage.removeItem('roomigo_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const u = await authService.getCurrentUser();
      const userData: User = {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        occupation: u.occupation,
        companyOrCollege: u.companyOrCollege,
        avatarUrl: u.avatarUrl,
        phoneVerified: u.phoneVerified,
        idVerified: u.idVerified,
        verificationStatus: u.verificationStatus,
      };
      setUser(userData);
      localStorage.setItem('roomigo_user', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
  };

  const quickLogin = async (type: 'admin' | 'poster' | 'renter') => {
    if (type === 'admin') {
      await login('admin@roomigo.in', 'admin123');
    } else if (type === 'poster') {
      await login('rahul.sharma@roomigo.in', 'poster123');
    } else {
      await login('ananya.sen@roomigo.in', 'renter123');
    }
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isPoster = user?.role === 'ROLE_POSTER' || isAdmin;
  const isRenter = user?.role === 'ROLE_RENTER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isPoster,
        isRenter,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        login,
        register,
        logout,
        refreshUser,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
