import React from 'react';
import { AppContext } from '../../contexts/app-context';

export const Profile = () => {
  const appContext = React.useContext(AppContext);

  console.log('info', appContext?.user);

  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
};

export default Profile;
