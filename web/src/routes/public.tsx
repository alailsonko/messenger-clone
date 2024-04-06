import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import Profile from '../pages/Profile';

export const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
];
