import React from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { publicRoutes } from './public';
import { protectedRoutes } from './protected';
import { AppContext } from '../contexts/app-context';
import LinearIndeterminate from '../components/Loading/LinearIndeterminate';

export const AppRoutes = () => {
  const appContext = React.useContext(AppContext);

  const commonRoutes: RouteObject[] = [
    {
      path: '/landing',
      element: <Landing />,
    },
  ];

  const routes = appContext?.isAuthenticated ? protectedRoutes : publicRoutes;

  const element = useRoutes([
    ...commonRoutes,
    ...routes,
    {
      path: '*',
      element: <div>Not Found</div>,
    },
  ]);

  if (appContext?.isLoading) {
    return <LinearIndeterminate />;
  }

  return <>{element}</>;
};
