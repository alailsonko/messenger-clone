import React from 'react';
import { RouteObject } from 'react-router-dom';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';

export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
];
