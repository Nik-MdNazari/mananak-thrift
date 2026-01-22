// components/LoginContext.jsx
import { createContext, useContext, useState } from 'react'

const LoginContext = createContext()

export function LoginProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false)
  
  const openLogin = () => setShowLogin(true)
  const closeLogin = () => setShowLogin(false)
  
  return (
    <LoginContext.Provider value={{ showLogin, openLogin, closeLogin }}>
      {children}
    </LoginContext.Provider>
  )
}

// Custom hook for easy access
export function useLogin() {
  const context = useContext(LoginContext)
  if (!context) {
    throw new Error('useLogin must be used within LoginProvider')
  }
  return context
}