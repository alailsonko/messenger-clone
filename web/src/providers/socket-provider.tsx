import React from 'react';
import { SocketContext } from '../contexts/socket-context';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketContext = React.useContext(SocketContext);

  socketContext.socket.on('connect', () => {
    console.log('Connected to socket');
  });

  socketContext.socket.on('disconnect', () => {
    console.log('Disconnected from socket');
  });

  socketContext.socket.on('connect_error', (error) => {
    console.error('Connection error', error);
  });

  socketContext.socket.on('disconnected', (error) => {
    console.error('Socket error', error);
  });

  React.useEffect(() => {
    socketContext.socket.connect();
    return () => {
      socketContext.socket.off('connect');
      socketContext.socket.off('disconnect');
      socketContext.socket.off('connect_error');
      socketContext.socket.off('disconnected');
      socketContext.socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketContext}>
      {children}
    </SocketContext.Provider>
  );
};
