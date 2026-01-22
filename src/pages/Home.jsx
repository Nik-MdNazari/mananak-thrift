import { useState, useEffect, useContext } from 'react'
import { Container, Form, Row, Col, InputGroup, Button, Card, Spinner, Alert } from 'react-bootstrap'
import { AuthContext } from '../components/AuthProvider.jsx'
import { useLogin } from '../context/LoginContext.jsx'
import ThriftStoreCard from '../components/ThriftStoreCard.jsx'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

export default function Home() {
    const theme = {
        dark: '#45595a',
        accent: '#c85103',
        mid: '#a2a092',
        light: '#e8e8e0',
        off: '#f6f4ef'
    }

    const { currentUser } = useContext(AuthContext);
    const { openLogin } = useLogin();

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        async function fetchStores() {
            try {
                setLoading(true)
                setError(null)

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

    // Filter stores based on search query
    const filteredStores = stores.filter(store => {
        const searchLower = search.toLowerCase();
        
        return (
            store.name?.toLowerCase().includes(searchLower) ||
            store.description?.toLowerCase().includes(searchLower) ||
            store.address?.city?.toLowerCase().includes(searchLower) ||
            store.address?.state?.toLowerCase().includes(searchLower) ||
            store.address?.full_address?.toLowerCase().includes(searchLower) ||
            store.address?.address_line_1?.toLowerCase().includes(searchLower)
        );
    });

    // Handler for Add Store button
    const handleAddStoreClick = () => {
        if (!currentUser) {
            // If user is not logged in...  show login modal
            openLogin();
        } else {
            // If user is logged in... navigate to add store page
            navigate("/stores/new")  // or use React Router's navigate
        }
    }

    {/* LOADING STATE */}
    {loading && (
    <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" role="status" variant="secondary">
        <span className="visually-hidden">Loading...</span>
        </Spinner>
    </div>
    )}

    {/* ERROR STATE */}
    {!loading && error && (
        <Alert variant="danger" className="text-center my-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
        </Alert>
    )}
    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.off, color: theme.dark }}>
            <Container className="py-3 mb-3">
                <Row className="mb-4">
                    <Col className='text-center'>
                        <div className="my-5 text-center">
                            <h1 className="fw-bold display-5 display-md-3 mb-3" style={{ color: theme.accent }}>
                                Find Your Nearest Thrift Store
                            </h1>
                            <p className="lead fs-6 fs-md-5 text-muted mx-auto" style={{ maxWidth: 700 }}>
                                Explore thrift stores in Malaysia with locations, hours, and contact info.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <Form className="mb-4 align-items-center justify-content-center d-flex">
                            <Col xs={12} md={10} lg={8} xl={6}>    
                                <InputGroup className="w-100 w-md-75 w-lg-50 shadow-sm">
                                    <Form.Control
                                        placeholder={'Search for thrift stores, locations, or address...'}
                                        value={search}
                                        onChange={(e) => {setSearch(e.target.value)}}
                                        aria-label="Search"
                                        style={{ borderColor: theme.off, backgroundColor: '#ffffff', fontSize: '1.2rem' }}
                                        className='py-3 px-3 fs-6 fs-md-3'
                                    />
                                </InputGroup>
                            </Col>
                        </Form>
                    </Col>
                </Row>

                {/* Featured Thrift Store Section */}
                <Card className="p-3 border-0 shadow-sm" style={{ backgroundColor: theme.light }}>
                    <Row className="align-items-center g-3">
                        <Col xs={12} md={6} className="text-center text-md-start">
                            <h3 className="fw-bold mb-0 fs-4 fs-md-3" style={{ color: theme.accent }}>
                                {search ? `Search Results (${filteredStores.length})` : "Featured Thrift Stores"}
                            </h3>
                        </Col>

                        <Col
                            xs={12}
                            md={6}
                            className="d-flex flex-column flex-sm-row gap-2 justify-content-center justify-content-md-end"
                        >
                            <Button
                                className="w-20 w-sm-auto"
                                style={{ backgroundColor: theme.dark, color: theme.off }}
                            >
                                <i className="bi bi-geo-alt-fill me-2"></i>
                                Find Nearest
                            </Button>

                            <Button
                                className="w-20 w-sm-auto"
                                style={{ backgroundColor: theme.dark, color: theme.off }}
                                onClick={handleAddStoreClick}
                            >
                                Add or update stores
                            </Button>
                        </Col>
                    </Row>
                </Card>

                <div className="pt-1 pb-3">
                        <Button 
                            variant="link" 
                            style={{ color: theme.dark, textDecoration: 'none' }}
                            className="fw-semibold"
                            onClick={() => navigate('/stores')}
                        >
                            View All Stores <i className="bi bi-arrow-right ms-1"></i>
                        </Button>
                </div>

                {/* Thrift Store Cards */}
                <Row>
                    {loading && (
                        <div className="d-flex justify-content-center align-items-center py-5 w-100">
                        <Spinner animation="border" variant="secondary" />
                        </div>
                    )}

                    {!loading && error && (
                        <Alert variant="danger" className="text-center w-100 my-4">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                        </Alert>
                    )}

                    {!loading && !error && (
                        <>
                            {filteredStores.length === 0 ? (
                                <div className="text-center py-5 text-muted w-100">
                                <i className="bi bi-search fs-1 d-block mb-3"></i>
                                No thrift stores found.
                                </div>
                            ) : (
                                filteredStores.map(store => (
                                <Col xs={12} md={6} lg={4} className="mb-4" key={store.ts_id}>
                                    <ThriftStoreCard store={store} />
                                </Col>
                                ))
                            )}
                        </>
                    )}
                </Row>
            </Container>

            <footer className="py-3 text-center mt-auto" style={{ backgroundColor: theme.dark, color: theme.off }}>
                <Container>
                    <small>&copy; {new Date().getFullYear()} manaNakThrift</small>
                </Container>
            </footer>
        </div>
    )
}