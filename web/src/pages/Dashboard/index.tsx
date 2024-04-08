import React from 'react';
import { AuthContext } from '../../contexts/auth-context';

export const Dashboard = () => {
  const authContext = React.useContext(AuthContext);

  console.log('info', authContext?.user);

  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
};

export default Dashboard;
