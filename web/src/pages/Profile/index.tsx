import React from 'react';
import { useQuery } from '@tanstack/react-query';

export const Profile = () => {
  const info = useQuery({
    queryKey: ['info'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL!}/auth/profile`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  console.log('info', info);

  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
};

export default Profile;
