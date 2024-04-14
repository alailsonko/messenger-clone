import React from 'react';
import { Profile } from '../api/Api';

export type LoginInputs = {
  email: string;
  password: string;
};

export const AuthContext = React.createContext<{
  user: Profile | null;
  login: (data: LoginInputs) => Promise<Profile | null | undefined>;
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
