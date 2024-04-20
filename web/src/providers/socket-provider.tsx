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

  socket.socket.on('disconnect', () => {
    console.log('Disconnected from socket');
  });

  socket.socket.on('connect_error', (error) => {
    console.error('Connection error', error);
  });

  socket.socket.on('disconnected', (error) => {
    console.error('Socket error', error);
  });

  React.useEffect(() => {
    socket.socket.connect();
    return () => {
      socket.socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
