import React, { useEffect } from 'react';
import { SocketContext } from '../contexts/socket-context';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket = React.useContext(SocketContext);

  socket.socket.on('connect', () => {
    console.log('Connected to socket');
  });

  socket.socket.on('message', (message) => {
    console.log('Received message', message);
  });

  React.useEffect(() => {
    return () => {
      socket.socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
