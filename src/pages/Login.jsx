import { useState } from 'react'
import { Modal, Button, Form, Tabs, Tab, Alert } from 'react-bootstrap'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../firebase'

export default function Login({ show, handleClose }) {
    const [key, setKey] = useState('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const getAuthErrorMessage = (code) => {
        switch (code) {
        case 'auth/invalid-credential':
            return 'Invalid email or password.'
        case 'auth/invalid-email':
            return 'Please enter a valid email address.'
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.'
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.'
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.'
        default:
            return 'Something went wrong. Please try again.'
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')

        try {
        await signInWithEmailAndPassword(auth, email, password)
        handleClose()
        } catch (err) {
            console.log('Firebase auth error:', err)
            console.log('Error code:', err.code)
            console.log('Error message:', err.message)
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
        await createUserWithEmailAndPassword(auth, email, password)
        handleClose()
        } catch (err) {
        setError(getAuthErrorMessage(err.code))
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>
            {key === 'login' ? 'Login' : 'Sign Up'}
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <Tabs
            activeKey={key}
            onSelect={(k) => {
                setKey(k)
                setError('')
            }}
            className="mb-3"
            justify
            >
            {/* LOGIN TAB */}
            <Tab eventKey="login" title="Login">
                <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                    Login
                </Button>
                </Form>
            </Tab>

            {/* SIGNUP TAB */}
            <Tab eventKey="signup" title="Sign Up">
                <Form onSubmit={handleSignup}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />
                </Form.Group>

                <Button type="submit" variant="success" className="w-100">
                    Create Account
                </Button>
                </Form>
            </Tab>
            </Tabs>
        </Modal.Body>
        </Modal>
    )
}
