import { useContext, useEffect } from 'react';
import { AuthContext  } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  bookings: string[];
  role: string;
}

export const useAuth = (): IUser | null => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    console.log('User in useAuth:', auth?.user);

    if (!auth) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
  
    const { user } = auth;
  
    return user;
  };
  
