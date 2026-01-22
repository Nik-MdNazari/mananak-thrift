import { useState, useEffect } from 'react'
import AppNavbar from '../components/AppNavbar'
import Login from '../components/LoginModal'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import ConfirmModal from '../components/ConfirmModal'
import { useToast } from '../components/ToastProvider'

export default function AppLayout({ children }) {
    const [user, setUser] = useState(null)
    const [showLogin, setShowLogin] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const { showToast } = useToast()

    const openLogin = () => setShowLogin(true)
    const closeLogin = () => setShowLogin(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
        })

        return () => unsubscribe()
    }, [])

    const confirmLogout = async () => {
      try {
        await signOut(auth)
        showToast('Logged out successfully', 'secondary')
      } catch (error) {
        console.error(error)
        showToast('Failed to log out', 'danger')
      } finally {
        setShowLogoutModal(false)
      }
    }

  return (
    <>
      <AppNavbar
        onLoginClick={openLogin}
        onLogout={() => setShowLogoutModal(true)}
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

      {/* Logout Confirmation */}
      <ConfirmModal
        show={showLogoutModal}
        title="Logging out"
        message="Are you sure you want to log out?"
        confirmText="Log out"
        confirmVariant="primary"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  )
}
