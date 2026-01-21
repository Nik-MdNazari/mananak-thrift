import { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import axios from 'axios';
import firebase from 'firebase/compat/app';

const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

export const AuthContext = createContext({
  currentUser: null,
  loading: true,
})

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() =>  {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])
  
  const value = { currentUser, loading }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
