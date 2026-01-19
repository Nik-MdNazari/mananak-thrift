import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useContext(AuthContext)

  // Still checking auth state
  if (loading) {
    return null // or spinner later
  }

  // Not logged in → redirect
  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  // Logged in → allow access
  return children
}
