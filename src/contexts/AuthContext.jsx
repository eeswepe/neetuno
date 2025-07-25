// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const usersCollectionRef = collection(db, "users");

  // Check if user is logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('neetuno_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Simple hash function for password (in production, use proper hashing)
  const hashPassword = (password) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  };

  const register = async (username, password) => {
    try {
      // Check if username already exists
      const q = query(usersCollectionRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error('Username sudah digunakan');
      }

      // Create new user
      const hashedPassword = hashPassword(password);
      const newUser = {
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(usersCollectionRef, newUser);

      const userData = {
        id: docRef.id,
        username,
        createdAt: newUser.createdAt
      };

      setUser(userData);
      localStorage.setItem('neetuno_user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (username, password) => {
    try {
      const hashedPassword = hashPassword(password);
      const q = query(
        usersCollectionRef,
        where("username", "==", username),
        where("password", "==", hashedPassword)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Username atau password salah');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = {
        id: userDoc.id,
        username: userDoc.data().username,
        createdAt: userDoc.data().createdAt
      };

      setUser(userData);
      localStorage.setItem('neetuno_user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('neetuno_user');
  };

  const value = {
    user,
    isLoading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
