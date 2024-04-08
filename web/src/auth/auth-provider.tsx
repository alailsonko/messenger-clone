import React from 'react';
import { useState } from 'react';
import { request } from '../api/request';
import { AuthContext, LoginInputs } from '../contexts/auth-context';
import { UserModel } from '../models/user.model';
import { useQuery } from '@tanstack/react-query';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const isAuthenticated = !!user;

  const { refetch } = useQuery({
    queryKey: ['auth/profile'],
    queryFn: async () => {
      try {
        const user = await request<UserModel>('auth/profile');

        setUser(user);

        return user;
      } catch (error) {
        setUser(null);

        return null;
      }
    },
    enabled: !isAuthenticated,
  });

  const login = async (
    data: LoginInputs
  ): Promise<UserModel | null | undefined> => {
    await request<UserModel>('auth/login', 'POST', data);
    const response = await refetch();

    return response.data;
  };

  const logout = async (): Promise<void> => {
    await request('auth/logout', 'POST');

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
