"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface UserProfile {
  _id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useUserProfile = () => {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
      } else {
        // If no profile exists, create a default one from Clerk data
        setProfile(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    } else if (isLoaded && !user) {
      setLoading(false);
      setProfile(null);
    }

    // Listen for profile update events
    const handleProfileUpdate = () => {
      if (user) {
        fetchProfile();
      }
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, [isLoaded, user]);

  // Helper function to get display name
  const getDisplayName = () => {
    if (profile && (profile.firstName || profile.lastName)) {
      return `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
    }
    
    // Fallback to Clerk data
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    
    return 'Account';
  };

  // Helper function to get first name
  const getFirstName = () => {
    if (profile?.firstName) {
      return profile.firstName;
    }
    
    return user?.firstName || 'Account';
  };

  return {
    profile,
    loading,
    error,
    getDisplayName,
    getFirstName,
    refetch: fetchProfile,
  };
};
