import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate()

    // form state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // toggle login / signup
    const [isSignup, setIsSignup] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isSignup) {
                // Sign up
                await createUserWithEmailAndPassword(auth, email, password)
            } else {
                // Login
                await signInWithEmailAndPassword(auth, email, password)
            }

            navigate('/') // redirect after success
        } catch (err) {
            setError(err.message)
        }

        setLoading(false)
    }

    function handleGuest() {
        navigate('/') // guest = no auth
    }

    return (
        <Container
            fluid
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: '#f6f4ef' }}
        >
            <Row className="w-100 justify-content-center">
                <Col md={5} lg={4}>
                    <Card className="shadow">
                        <Card.Body>
                            <h2 className="text-center mb-4">
                                {isSignup ? 'Create Account' : 'Login'}
                            </h2>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="w-100 mb-3"
                                    disabled={loading}
                                >
                                    {isSignup ? 'Sign Up' : 'Login'}
                                </Button>
                            </Form>

                            <div className="text-center mb-3">
                                <Button
                                    variant="link"
                                    onClick={() => setIsSignup(!isSignup)}
                                >
                                    {isSignup
                                        ? 'Already have an account? Login'
                                        : "Don't have an account? Sign up"}
                                </Button>
                            </div>

                            <hr />

                            <Button
                                variant="outline-secondary"
                                className="w-100"
                                onClick={handleGuest}
                            >
                                Continue as Guest
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
