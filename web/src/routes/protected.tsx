import React from 'react';
import { RouteObject } from 'react-router-dom';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import Chat from '../components/Chat/Chat';

export const NoActiveChat = () => {
  return <div>no active chat</div>;
};

export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Dashboard />,
    children: [
      {
        path: '/',
        element: <NoActiveChat />,
      },
      {
        path: ':chatRoomId',
        element: <Chat />,
        shouldRevalidate: () => true,
      },
    ],
  },
  {
    path: '/profile',
    element: <Profile />,
  },
];
