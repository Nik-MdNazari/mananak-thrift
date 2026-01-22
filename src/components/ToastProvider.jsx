import { createContext, useContext, useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    variant: 'success',
  })

  function showToast(message, variant = 'success') {
    setToast({ show: true, message, variant })
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <ToastContainer position="bottom-end" className="p-5">
        <Toast
          bg={toast.variant}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  )
}
