"use client";

import React, { useEffect } from 'react'
import { useAuth } from '@/app/context/AuthProvider'
import { useRouter } from 'next/navigation';

function ProtectedPage() {
    const currentUser = useAuth();
    const router = useRouter();
  
    useEffect(() => {
        // If the user is not logged in, redirect to the home page
        if (!currentUser) {
          router.push('/');
        }
      }, [currentUser, router]);

  return (
    <>
    
  </>
  )
}

export default ProtectedPage