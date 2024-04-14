import React from 'react';
import { Api } from '../api/Api';

export const RequestContext = React.createContext<Api<unknown>>(
  new Api({
    baseURL: process.env.REACT_APP_BACKEND_URL!,
    withCredentials: true,
  })
);
