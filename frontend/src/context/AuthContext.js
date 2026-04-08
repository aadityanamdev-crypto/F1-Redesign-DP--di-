import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = checking, false = not auth, object = auth
  const [loading, setLoading] = useState(true);

  const formatApiErrorDetail = (detail) => {
    if (detail == null) return "Something went wrong. Please try again.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail))
      return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
    if (detail && typeof detail.msg === "string") return detail.msg;
    return String(detail);
  };

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true
      });
      setUser(data);
    } catch (error) {
      // Try to refresh token
      try {
        await axios.post(`${BACKEND_URL}/api/auth/refresh`, {}, { withCredentials: true });
        const { data } = await axios.get(`${BACKEND_URL}/api/auth/me`, { withCredentials: true });
        setUser(data);
      } catch (refreshError) {
        setUser(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: formatApiErrorDetail(error.response?.data?.detail) || error.message 
      };
    }
  };

  const register = async (email, password, name) => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/auth/register`,
        { email, password, name },
        { withCredentials: true }
      );
      setUser(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: formatApiErrorDetail(error.response?.data?.detail) || error.message 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(false);
    }
  };

  const updateProgress = async (sectionId, completed) => {
    if (!user) return;
    try {
      await axios.post(
        `${BACKEND_URL}/api/progress`,
        { section_id: sectionId, completed },
        { withCredentials: true }
      );
      setUser(prev => ({
        ...prev,
        progress: { ...prev.progress, [sectionId]: completed }
      }));
    } catch (error) {
      console.error('Progress update error:', error);
    }
  };

  const addBookmark = async (itemType, itemId) => {
    if (!user) return;
    try {
      await axios.post(
        `${BACKEND_URL}/api/bookmarks`,
        { item_type: itemType, item_id: itemId },
        { withCredentials: true }
      );
      setUser(prev => ({
        ...prev,
        bookmarks: [...(prev.bookmarks || []), { item_type: itemType, item_id: itemId }]
      }));
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const removeBookmark = async (itemType, itemId) => {
    if (!user) return;
    try {
      await axios.delete(
        `${BACKEND_URL}/api/bookmarks/${itemType}/${itemId}`,
        { withCredentials: true }
      );
      setUser(prev => ({
        ...prev,
        bookmarks: (prev.bookmarks || []).filter(
          b => !(b.item_type === itemType && b.item_id === itemId)
        )
      }));
    } catch (error) {
      console.error('Remove bookmark error:', error);
    }
  };

  const isBookmarked = (itemType, itemId) => {
    if (!user || !user.bookmarks) return false;
    return user.bookmarks.some(b => b.item_type === itemType && b.item_id === itemId);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProgress,
      addBookmark,
      removeBookmark,
      isBookmarked,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};
