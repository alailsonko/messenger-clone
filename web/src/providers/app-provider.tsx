import React from 'react';
import { AppContext, LoginInputs } from '../contexts/app-context';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ProfileResponseObject } from '../api/Api';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<ProfileResponseObject | null>(null);
  const appContext = React.useContext(AppContext);
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  const { refetch, isLoading } = useQuery({
    queryKey: ['auth/profile'],
    queryFn: async () => {
      try {
        const response = await appContext.api.auth.authControllerGetProfile();

        setUser(response.data);

        return response.data;
      } catch (error) {
        setUser(null);

        return null;
      }
    },
    enabled: !isAuthenticated,
  });

  const login = async (
    data: LoginInputs
  ): Promise<ProfileResponseObject | null | undefined> => {
    await appContext.api.auth.authControllerLogin(data);
    const response = await refetch();

    navigate('/');

    return response.data;
  };

  const logout = async (): Promise<void> => {
    await appContext.api.auth.authControllerLogout();

    setUser(null);
  };

  React.useEffect(() => {
    appContext.socket.connect();

    appContext.socket.on('connect', () => {
      console.log('Connected to socket');
    });

    appContext.socket.on('disconnect', () => {
      console.log('Disconnected from socket');
    });

    appContext.socket.on('connect_error', (error) => {
      console.error('Connection error', error);
    });

    appContext.socket.on('disconnected', (error) => {
      console.error('Socket error', error);
    });

    return () => {
      appContext.socket.off('connect');
      appContext.socket.off('disconnect');
      appContext.socket.off('connect_error');
      appContext.socket.off('disconnected');
      appContext.socket.disconnect();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        api: appContext.api,
        socket: appContext.socket,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
