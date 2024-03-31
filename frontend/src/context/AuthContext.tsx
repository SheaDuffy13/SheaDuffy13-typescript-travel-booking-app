import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  bookings: string[];
  role: string;
}

interface IAuthContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user/me');
        console.log('API response:', response);  // Log the API response
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);  // Log any errors
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
