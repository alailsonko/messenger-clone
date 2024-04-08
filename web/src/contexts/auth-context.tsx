import React from 'react';
import { UserModel } from '../models/user.model';

export type LoginInputs = {
  email: string;
  password: string;
};

export const AuthContext = React.createContext<
  | {
      user: UserModel | null;
      login: (data: LoginInputs) => Promise<UserModel | null | undefined>;
      logout: () => Promise<void>;
      isAuthenticated: boolean;
    }
  | undefined
>(undefined);
