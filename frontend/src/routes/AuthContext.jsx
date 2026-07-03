import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AUTH_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${AUTH_URL}/checkAuth`,{ withCredentials: true } );
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${AUTH_URL}/login`, { email, password },{ withCredentials: true } );
            setUser(response.data.user);
            // navigate('/login');
            console.log(response.data);
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
        }
    };

    const register = async (name, username, email, password) => {
        try {
            const response = await axios.post(`${AUTH_URL}/register`, { name, username, email, password });
            setUser(response.data.user);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${AUTH_URL}/logout`, {}, { withCredentials: true });
            setUser(null);
            // navigate('/');
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;