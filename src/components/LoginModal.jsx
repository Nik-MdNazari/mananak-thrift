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

export default function LoginModal({ show, handleClose }) {
    const [key, setKey] = useState('login')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

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
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                email, 
                password
            )
            const user = userCredential.user
            await updateProfile(user, {
                displayName: username,
            })

            await axios.post(`${API_BASE_URL}/users/sync`, {
                firebase_uid: user.uid,
                email: user.email,
                username: username,
            })

            handleClose();
            navigate('/profile');

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

                <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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
