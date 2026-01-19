import { useState } from 'react'
import { Modal, Button, Form, Tabs, Tab } from 'react-bootstrap'

export default function Login({ show, handleClose }) {
  const [key, setKey] = useState('login')

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {key === 'login' ? 'Login' : 'Sign Up'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Tabs
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
          justify
        >
          {/* LOGIN TAB */}
          <Tab eventKey="login" title="Login">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>

              <Button variant="primary" className="w-100">
                Login
              </Button>
            </Form>
          </Tab>

          {/* SIGNUP TAB */}
          <Tab eventKey="signup" title="Sign Up">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                />
              </Form.Group>

              <Button variant="success" className="w-100">
                Create Account
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  )
}
