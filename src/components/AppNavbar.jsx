import { Navbar, Nav, Container } from 'react-bootstrap'

export default function AppNavbar({ onLoginClick, isLoggedIn }) {
  const theme = {
    accent: '#c85103',
    off: '#f6f4ef',
  }

  return (
    <Navbar
      expand="lg"
      style={{ backgroundColor: theme.accent, height: '80px' }}
      variant="dark"
      className="px-4"
    >
      <Container fluid>
        <Navbar.Brand href="/" style={{ color: theme.off, fontWeight: 600 }}>
          📍ManaNakThrift
        </Navbar.Brand>

        <Nav className="ms-auto">
          <Nav.Item>
            <Nav.Link href="/" className="text-light me-2">
              <i className="bi bi-house me-1" /> Home
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link href="/stores" className="text-light me-2">
              <i className="bi bi-shop me-1" /> Thrift Stores
            </Nav.Link>
          </Nav.Item>

          {/* AUTH ACTION */}
          {!isLoggedIn ? (
            <Nav.Item>
              <Nav.Link
                onClick={onLoginClick}
                className="text-light"
                style={{ cursor: 'pointer' }}
              >
                <i className="bi bi-person-circle me-1" /> Login
              </Nav.Link>
            </Nav.Item>
          ) : (
            <Nav.Item>
              <Nav.Link href="/profile" className="text-light">
                <i className="bi bi-person me-1" /> My Profile
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}
