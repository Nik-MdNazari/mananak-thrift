import { useState, useEffect } from 'react'
import { Container, Form, Row, Col, Nav, Navbar, InputGroup, Button } from 'react-bootstrap'
import AppNavbar from '../components/AppNavbar.jsx'
import ThriftStoreCard from '../components/ThriftStoreCard.jsx'
import ThriftStoresList from './ThriftStoresList.jsx'
import Login from '../components/LoginModal.jsx'

const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

export default function Home() {
    const theme = {
        dark: '#45595a',
        accent: '#c85103',
        mid: '#a2a092',
        light: '#e8e8e0',
        off: '#f6f4ef'
    }

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    
    useEffect(() => {
        async function fetchStores() {
            try {
                const res = await fetch(`${API_BASE_URL}/stores`)

                if (!res.ok) {
                    throw new Error('Failed to fetch stores')
                }

                const data = await res.json()
                setStores(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchStores()
    }, [])

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.off, color: theme.dark }}>

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
            <Row>
                {stores.map(store => (
                    <Col md={5} className="mb-4" key={store.id}>
                        <ThriftStoreCard store={store} />
                    </Col>
                ))}
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