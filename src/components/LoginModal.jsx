import { useState } from 'react'
import { Modal, Button, Form, Tabs, Tab, Alert } from 'react-bootstrap'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { auth } from '../firebase'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/ToastProvider'

export default function LoginModal({ show, handleClose }) {
  const [key, setKey] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { showToast } = useToast()

  const API_BASE_URL = 'https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev'

  const getAuthErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-credential':
        return 'Invalid email or password.'
      case 'auth/invalid-email':
        return 'Please enter a valid email address.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.'
      case 'auth/email-already-in-use':
        return 'Email already in use.'
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.'
      default:
        return 'Something went wrong. Please try again.'
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      showToast('Login successful', 'success')
      handleClose()
    } catch (err) {
      setError(getAuthErrorMessage(err.code))
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await updateProfile(user, { displayName: username })

      await axios.post(`${API_BASE_URL}/users/sync`, {
        firebase_uid: user.uid,
        email: user.email,
        username
      })

      showToast('Account created successfully', 'success')
      handleClose()
      navigate('/profile')
    } catch (err) {
      setError(getAuthErrorMessage(err.code))
    }
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="rounded-4 shadow"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          {key === 'login' ? 'Welcome back' : 'Create your account'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        <p className="text-muted mb-4">
          {key === 'login'
            ? 'Log in to contribute and add more thrift store locations.'
            : 'Join the community and start discovering & sharing thrift stores near you.'}
        </p>

        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        <Tabs
          activeKey={key}
          onSelect={(k) => {
            setKey(k)
            setError('')
          }}
          className="mb-4"
          justify
        >
          {/* LOGIN */}
          <Tab eventKey="login" title="Login">
            <Form onSubmit={handleLogin}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Email address</label>
              </Form.Floating>

              <Form.Floating className="mb-4">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label>Password</label>
              </Form.Floating>

              <Button type="submit" variant="primary" size="md" className="w-100">
                Log In
              </Button>
            </Form>
          </Tab>

          {/* SIGN UP */}
          <Tab eventKey="signup" title="Sign Up">
            <Form onSubmit={handleSignup}>
              <Form.Floating className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label>Username</label>
              </Form.Floating>

              <Form.Floating className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Email address</label>
              </Form.Floating>

              <Form.Floating className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label>Password</label>
              </Form.Floating>

              <Form.Floating className="mb-4">
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label>Confirm Password</label>
              </Form.Floating>

              <Button type="submit" variant="success" size="md" className="w-100">
                Create Account
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  )
}
