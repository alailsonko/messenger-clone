import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

export const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
];
