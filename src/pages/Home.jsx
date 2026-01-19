import { useState } from 'react'
import { Container, Form, Row, Col, Nav, Navbar, InputGroup, Button } from 'react-bootstrap'
import ThriftStoreCard from '../components/ThriftStoreCard.jsx'

export default function Home() {
    const theme = {
        dark: '#45595a',
        accent: '#c85103',
        mid: '#a2a092',
        light: '#e8e8e0',
        off: '#f6f4ef'
    }

    const thriftStore1 = {
        name: "2nd Street TTDI",
        description: "A trendy thrift store with a wide selection of clothing and accessories.",
        address: "2nd Street, TTDI, Kuala Lumpur",
        openingHours: "10:00 AM - 8:00 PM",
        img: "",
        directionLink: "https://www.google.com/maps/dir/?api=1&destination=2nd+Street,+TTDI,+Kuala+Lumpur",
        rating: 4,
    }

    const thriftStore2 = {
        name: 'Jalan Jalan Japan Thrift Store',
        description: "",
        address: '',
    }

    const [search, setSearch] = useState('');

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.off, color: theme.dark }}>

            {/* Navigation Bar */}
            <Navbar expand="lg" style={{ backgroundColor: theme.accent, height: '80px' }} variant="dark" className="px-4">
                <Navbar.Brand href="/" style={{ color: theme.off, fontWeight: 600 }}>📍ManaNakThrift</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Item>
                        <Nav.Link href="/" className="text-light me-2" style={{ fontSize: '1.2rem' }}><i className="bi bi-house me-1"></i> Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/stores" className="text-light me-2" style={{ fontSize: '1.2rem' }}><i className="bi bi-shop me-1"></i> Thrift Stores</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/about" className="text-light me-2" style={{ fontSize: '1.2rem' }}><i className="bi bi-info-circle me-1"></i> About</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>

            <Container className="py-5">
                <Row className="mb-4">
                    <Col className='text-center'>
                        <div className='my-5'>
                            <h1 style={{ color: theme.accent, fontWeight: 700, fontSize: '4rem' }}>Find Your Nearest Thrift Store</h1>
                            <p className="lead" style={{ color: theme.dark, fontWeight: 300 }}>Explore thrift stores in Malaysia along with their locations, operating hours, contact, information, etc.</p>    
                        </div>

                        {/* Search Bar */}
                        <Form className="mb-4 align-items-center justify-content-center d-flex">
                            <InputGroup style={{ width: '920px' }}>
                                <Form.Control
                                    placeholder={'Search for thrift stores, locations, or address...'}
                                    value={search}
                                    onChange={(e) => {setSearch(e.target.value)}}
                                    aria-label="Search"
                                    style={{ borderColor: theme.off, backgroundColor: '#ffffff', fontSize: '1.2rem' }}
                                    className='px-3 py-3'
                                />
                                <Button
                                    onClick={() => {}}
                                    style={{ backgroundColor: theme.dark, borderColor: theme.dark, color: theme.off }}
                                >
                                    <i className="bi bi-search me-1"></i>Search
                                </Button>
                            </InputGroup>
                        </Form>
                    </Col>
                </Row>

                {/* Featured Thrift Store Section */}
                <Row className="align-items-center mb-3">
                    <Col>
                    <div className=''>
                        <h2 style={{ color: theme.dark, fontWeight: 600 }}>Featured Thrift Stores</h2>
                        <p className="text-muted" style={{ color: theme.mid, fontSize: '1.2rem' }}>Hand-picked thrift stores near you</p>
                    </div>
                        
                    </Col>
                </Row>

                <Row>
                    <Col md={5} className="mb-4">
                        <ThriftStoreCard store={thriftStore1}/>
                    </Col>
                    <Col md={5} className="mb-4">
                        <ThriftStoreCard store={thriftStore2}/>
                    </Col>
                    <Col md={5} className="mb-4">
                        <ThriftStoreCard store={thriftStore1}/>
                    </Col>
                </Row>
            </Container>

            <footer className="py-4 text-center mt-auto" style={{ backgroundColor: theme.dark, color: theme.off }}>
                <Container>
                    <small>&copy; {new Date().getFullYear()} ThriftFinder</small>
                </Container>
            </footer>
        </div>
    )
}