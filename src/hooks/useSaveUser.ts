import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export const useSaveUser = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const saveUser = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          const response = await fetch('/api/save-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to save user data');
          }

          const data = await response.json();
          console.log('User data saved:', data);
        } catch (error) {
          console.error('Error saving user data:', error);
        }
      }
    };

    saveUser();
  }, [isLoaded, isSignedIn, user]);
};