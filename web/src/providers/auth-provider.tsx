import React from 'react';
import { AuthContext, LoginInputs } from '../contexts/auth-context';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RequestContext } from '../contexts/request-context';
import { Profile } from '../api/Api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<Profile | null>(null);
  const requestContext = React.useContext(RequestContext);
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  const { refetch, isLoading } = useQuery({
    queryKey: ['auth/profile'],
    queryFn: async () => {
      try {
        const response = await requestContext.auth.authControllerGetProfile();

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
  ): Promise<Profile | null | undefined> => {
    await requestContext.auth.authControllerLogin(data);
    const response = await refetch();

    navigate('/');

    return response.data;
  };

  const logout = async (): Promise<void> => {
    await requestContext.auth.authControllerLogout();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
