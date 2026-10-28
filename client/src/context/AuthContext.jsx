import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [business, setBusiness] = useState(() => {
    const saved = localStorage.getItem('business');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const data = await authService.getMe();
          if (data.success) {
            setUser(data.user);
            setBusiness(data.business);
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.business) {
              localStorage.setItem('business', JSON.stringify(data.business));
            }
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        setBusiness(data.business);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.business) {
          localStorage.setItem('business', JSON.stringify(data.business));
        }

        toast.success(`Welcome back, ${data.user.name}!`);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const data = await authService.register(formData);
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        setBusiness(data.business);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.business) {
          localStorage.setItem('business', JSON.stringify(data.business));
        }

        toast.success('Registration successful!');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setBusiness(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('business');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Profile updated');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Demo login convenience helper
  const demoLogin = async (role = 'Admin') => {
    if (role === 'Admin') {
      return await login('admin@nexora.com', 'Admin@123');
    } else {
      return await login('finance@nexora.com', 'Finance@123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'Admin',
        login,
        register,
        logout,
        updateProfile,
        demoLogin,
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
