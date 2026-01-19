import { useState } from 'react'
import AppNavbar from '../components/AppNavbar'
import Login from '../pages/Login'

export default function AppLayout({ children }) {
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const openLogin = () => setShowLogin(true)
  const closeLogin = () => setShowLogin(false)

  return (
    <>
      <AppNavbar
        onLoginClick={openLogin}
        isLoggedIn={isLoggedIn}
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
