import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './providers/auth-provider';
import { SocketProvider } from './providers/socket-provider';
import { RequestProvider } from './providers/request-provider';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RequestProvider>
          <AuthProvider>
            <SocketProvider>
              <AppRoutes />
            </SocketProvider>
          </AuthProvider>
        </RequestProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
