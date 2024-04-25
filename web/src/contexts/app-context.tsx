import React from 'react';
import { Api, ProfileResponseObject } from '../api/Api';
import { Socket } from 'socket.io-client';
import { EventsMap, ListenEventsMap, socket } from '../ws/socket';

export type LoginInputs = {
  email: string;
  password: string;
};

export const AppContext = React.createContext<{
  user: ProfileResponseObject | null;
  login: (
    data: LoginInputs
  ) => Promise<ProfileResponseObject | null | undefined>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  api: Api<unknown>;
  socket: Socket<EventsMap, ListenEventsMap>;
}>({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  login: async () => null,
  logout: async () => {},
  api: new Api({
    baseURL: process.env.REACT_APP_BACKEND_URL!,
    withCredentials: true,
  }),
  socket,
});
