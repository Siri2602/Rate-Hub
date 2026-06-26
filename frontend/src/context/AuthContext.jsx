import { createContext, useContext, useEffect, useReducer } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: localStorage.getItem('ratehub-token'),
  loading: true,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGOUT':
      return { ...initialState, token: null, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('ratehub-token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/auth/me');
      dispatch({ type: 'SET_USER', payload: data.user });
    } catch {
      localStorage.removeItem('ratehub-token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('ratehub-token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    dispatch({ type: 'SET_USER', payload: data.user });
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('ratehub-token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    dispatch({ type: 'SET_USER', payload: data.user });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('ratehub-token');
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    dispatch({ type: 'SET_USER', payload: { ...state.user, ...userData } });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
