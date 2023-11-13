'use client';
// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from '@/lib/firebase/auth'; // Import your Firebase auth instance
import { useRouter } from "next/navigation";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const router = useRouter()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged((authUser) => {
			setCurrentUser(authUser)
		})
    
		return () => unsubscribe()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		onAuthStateChanged((authUser) => {
			if (currentUser === undefined) return
			// refresh when user changed to ease testing
			if (currentUser?.email !== authUser?.email) {
				router.refresh()
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser])

  return (
    <AuthContext.Provider value={currentUser}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
