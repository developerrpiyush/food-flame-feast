import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log('Loading saved user:', parsedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading saved user:', error);
      localStorage.removeItem('currentUser');
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: User) => u.email === email && u.password === password);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        toast({
          title: "Welcome back!",
          description: `Good to see you again, ${foundUser.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong during login",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, securityQuestion: string, securityAnswer: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.find((u: User) => u.email === email)) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists",
          variant: "destructive",
        });
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        password,
        name,
        securityQuestion,
        securityAnswer: securityAnswer.toLowerCase().trim(),
        addresses: [],
        orders: []
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Saved new user to localStorage:', newUser);
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      toast({
        title: "Account created!",
        description: `Welcome to FoodFlame, ${name}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong during signup",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const resetPassword = (email: string, securityAnswer: string): { success: boolean; password?: string } => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.email === email);
      
      if (userIndex !== -1) {
        const user = users[userIndex];
        if (user.securityAnswer === securityAnswer.toLowerCase().trim()) {
          return { success: true, password: user.password };
        } else {
          toast({
            title: "Incorrect answer",
            description: "Security question answer is incorrect",
            variant: "destructive",
          });
          return { success: false };
        }
      } else {
        toast({
          title: "Email not found",
          description: "No account found with this email address",
          variant: "destructive",
        });
        return { success: false };
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong during password reset",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};