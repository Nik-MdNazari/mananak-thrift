import { useState, useEffect } from 'react'
import AppNavbar from '../components/AppNavbar'
import Login from '../pages/Login'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'

export default function AppLayout({ children }) {
    const [user, setUser] = useState(null)
    const [showLogin, setShowLogin] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const openLogin = () => setShowLogin(true)
    const closeLogin = () => setShowLogin(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
        })

        return () => unsubscribe()
    }, [])

    const handleLogout = async () => {
        await signOut(auth)
    }

  return (
    <>
      <AppNavbar
        onLoginClick={openLogin}
        onLogout={handleLogout}
        isLoggedIn={!!user}
      />

      {/* Page Content */}
      <main>
        {children}
      </main>

      {/* Global Login Modal */}
      <Login
        show={showLogin}
        handleClose={closeLogin}
      />
    </>
  )
}
