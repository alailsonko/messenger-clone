import React from 'react';
import { RequestContext } from '../contexts/request-context';

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const api = React.useContext(RequestContext);

  return (
    <RequestContext.Provider value={api}>{children}</RequestContext.Provider>
  );
};
