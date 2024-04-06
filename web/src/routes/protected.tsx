import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Login } from '../pages/Login';

export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
];
