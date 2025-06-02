import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: 'buyer' | 'seller' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: 'buyer' | 'seller') => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: 'buyer' | 'seller') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user: foundUser, message } = response.data;
      
      if (token && foundUser) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', foundUser.role);

        setUser(foundUser);
        setIsAuthenticated(true);

        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${foundUser.username}!`,
        });

        return true;
      }

      toast({
        title: "Erreur de connexion",
        description: "Utilisateur ou mot de passe invalide",
        variant: "destructive",
      });
      return false;
    } catch (error: any) {
      console.error('Login error:', error);

      toast({
        title: "Erreur serveur",
        description: error.response?.data?.message || "Impossible de se connecter.",
        variant: "destructive",
      });

      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: 'buyer' | 'seller'
  ) => {
    console.log('Signup attempt:', { email, password, name, role });

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      username: name,
    };

    setUser(newUser);
    setIsAuthenticated(true); // ✅ FIX ICI
    toast({
      title: "Inscription réussie",
      description: `Bienvenue ${name}!`,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false); // ✅ pour être sûr
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    toast({
      title: "Déconnexion",
      description: "À bientôt!",
    });
  };

  const switchRole = (newRole: 'buyer' | 'seller') => {
    if (user && user.role !== 'admin') {
      setUser({ ...user, role: newRole });
      toast({
        title: "Rôle modifié",
        description: `Vous êtes maintenant un ${newRole === 'buyer' ? 'acheteur' : 'vendeur'}`,
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated, // ✅ on utilise la bonne valeur ici
      login,
      signup,
      logout,
      switchRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
