import React from 'react';
import { socket } from '../ws/socket';

export const SocketContext = React.createContext({
  socket,
});
