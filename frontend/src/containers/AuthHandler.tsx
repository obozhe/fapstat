import useAuth from 'hooks/useAuth';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthHandler = () => {
    const { user } = useAuth();

    if (user) return <Navigate to="/home" />;

    return <Outlet />;
};

export default AuthHandler;
