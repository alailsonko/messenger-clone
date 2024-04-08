import React from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { publicRoutes } from './public';
import { protectedRoutes } from './protected';
import { AuthContext } from '../contexts/auth-context';

export const AppRoutes = () => {
  const authContext = React.useContext(AuthContext);

  const commonRoutes: RouteObject[] = [
    {
      path: '/landing',
      element: <Landing />,
    },
  ];

  const routes = authContext?.isAuthenticated ? protectedRoutes : publicRoutes;

  const element = useRoutes([...commonRoutes, ...routes]);

  return <>{element}</>;
};
