'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

const UserDataSaver: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const saveUserData = async () => {
      console.log('UserDataSaver: Checking user status');
      if (isLoaded && isSignedIn && user) {
        console.log('UserDataSaver: User is signed in, attempting to save data');
        try {
          const response = await fetch('/api/save-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save user data');
          }

          console.log('UserDataSaver: User data saved successfully');
        } catch (error) {
          console.error('UserDataSaver: Error saving user data:', error);
        }
      } else {
        console.log('UserDataSaver: User not ready yet');
      }
    };

    saveUserData();
  }, [isLoaded, isSignedIn, user]);

  return null;
};

export default UserDataSaver;