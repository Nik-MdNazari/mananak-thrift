import { Navbar, Nav, Container } from 'react-bootstrap'
import { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { useLogin } from '../context/LoginContext.jsx'

export default function AppNavbar({ onLogout }) {
  const theme = {
    accent: '#c85103',
    off: '#f6f4ef',
  }

  const { currentUser } = useContext(AuthContext)
  const { openLogin } = useLogin()

  const isLoggedIn = !!currentUser

  return (
    <Navbar
      expand="lg"
      variant="dark"
      style={{ backgroundColor: theme.accent }}
      className="px-3 py-2"
      collapseOnSelect
    >
      <Container fluid>
        <Navbar.Brand
          href="/"
          style={{ color: theme.off, fontWeight: 600 }}
        >
          📍ManaNakThrift
        </Navbar.Brand>

        {/* Hamburger button */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* Collapsible content */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto text-center text-lg-start">
            <Nav.Link href="/" className="text-light">
              <i className="bi bi-house me-1" /> Home
            </Nav.Link>

            <Nav.Link href="/stores" className="text-light">
              <i className="bi bi-shop me-1" /> Thrift Stores
            </Nav.Link>

            <hr className="d-lg-none bg-light opacity-25" />

            {!isLoggedIn ? (
              <Nav.Link
                onClick={openLogin}
                className="text-light fw-semibold"
                style={{ cursor: 'pointer' }}
              >
                <i className="bi bi-person-circle me-1" /> Login
              </Nav.Link>
            ) : (
              <>
                <Nav.Link href="/profile" className="text-light">
                  <i className="bi bi-person me-1" /> My Profile
                </Nav.Link>

                <Nav.Link
                  onClick={onLogout}
                  className="text-light fw-semibold"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="bi bi-box-arrow-right me-1" /> Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
