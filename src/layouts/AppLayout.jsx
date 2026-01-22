import { useState, useEffect } from 'react'
import AppNavbar from '../components/AppNavbar'
import LoginModal from '../components/LoginModal'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import ConfirmModal from '../components/ConfirmModal'
import { useToast } from '../components/ToastProvider'
import { useLogin } from '../context/LoginContext'

export default function AppLayout({ children }) {
    const [user, setUser] = useState(null)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const { showToast } = useToast()

    const { showLogin, openLogin, closeLogin } = useLogin();

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
        onLogout={() => setShowLogoutModal(true)}
      />

      {/* Page Content */}
      <main>
        {children}
      </main>

      {/* Global Login Modal */}
      <LoginModal
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
