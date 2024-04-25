import React from 'react';
import { ProfileResponseObject } from '../api/Api';

export type LoginInputs = {
  email: string;
  password: string;
};

export const AuthContext = React.createContext<{
  user: ProfileResponseObject | null;
  login: (
    data: LoginInputs
  ) => Promise<ProfileResponseObject | null | undefined>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}>({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  login: async () => null,
  logout: async () => {},
});
