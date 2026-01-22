import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Badge, Button, Card } from "react-bootstrap";

const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

export default function ThriftStore() {
    const { id } = useParams();
    
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const theme = {
        dark: '#45595a',
        accent: '#c85103',
        mid: '#a2a092',
        light: '#e8e8e0',
        off: '#f6f4ef'
    }

    useEffect(() => {
        fetch(`${API_BASE_URL}/stores/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Store not found");
                return res.json();
            })
            .then((json) => {
                setStore(json.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    // Loading state - centered
    if (loading) {
        return (
            <Container className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading store details...</p>
                </div>
            </Container>
        );
    }

    // Error state - centered
    if (error) {
        return (
            <Container className="min-vh-100 d-flex align-items-center justify-content-center">
                <Alert variant="danger" className="w-100" style={{ maxWidth: '500px' }}>
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" href="/">
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Home
                    </Button>
                </Alert>
            </Container>
        );
    }

    const {
        name,
        description,
        average_rating,
        total_ratings,
        price_range,
        operating_hours,
        google_maps_link,
        address,
        contacts
    } = store;

    // Convert price_range number → symbols
    const renderPriceRange = (level = 0) => {
        const max = 5;
        return (
            <span className="d-inline-flex align-items-center">
                {[...Array(max)].map((_, i) => (
                    <i
                        style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                        key={i}
                        className={`bi bi-currency-dollar ${
                            i < level ? 'fw-bold text-dark' : 'text-muted'
                        }`}
                    />
                ))}
            </span>
        );
    };

    // Render stars from average_rating
    const renderStars = (rating = 0) => {
        const max = 5;
        return (
            <span className="d-inline-flex align-items-center">
                {[...Array(max)].map((_, i) => (
                    <i
                        style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                        key={i}
                        className={`bi bi-star-fill me-1 ${
                            i < rating ? 'text-warning' : 'text-muted'
                        }`}
                    />
                ))}
            </span>
        );
    };

    const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${address.longitude - 0.01}%2C${address.latitude - 0.01}%2C${address.longitude + 0.01}%2C${address.latitude + 0.01}&layer=mapnik&marker=${address.latitude}%2C${address.longitude}`;
    const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}`;

    return (
        <div className="bg-light min-vh-100" style={{ backgroundColor: theme.off, color: theme.dark }}>
            <Container className="py-3 py-md-4 py-lg-5">

                {/* STORE HEADER */}
                <Card className="border-0 shadow-sm mb-3 mb-md-4">
                    <Card.Body className="p-3 p-md-4">
                        <Row className="align-items-start">
                            <Col xs={12}>
                                <h1 className="fw-bold mb-2 mb-md-3 fs-2 fs-md-1">{name}</h1>

                                <p className="text-muted mb-3 mb-md-4 fs-6 fs-md-5">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-geo-alt me-1" />
                                        {address.city}, {address.state}
                                    </div>
                                    
                                </p>

                                <div className="d-flex flex-column flex-sm-row flex-wrap gap-2 gap-md-3 mb-3 mb-md-4">
                                    <div className="d-flex align-items-center gap-2">    
                                        <Badge bg="light" text="dark" className="p-2">
                                            {renderStars(average_rating)}
                                        </Badge>
                                        <span className="text-muted small">
                                            {total_ratings} reviews
                                        </span>                                    
                                    </div>
                                        
                                    <div className="d-inline-flex">  {/* Changed from just Badge to wrapped in div */}
                                        <Badge bg="light" text="dark" className="p-2">
                                            {renderPriceRange(price_range)}
                                        </Badge>
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                <p className="mb-0 fs-6 fs-md-5 lh-base">{description}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* MAIN CONTENT */}
                <Row className="g-3 g-md-4">

                    {/* LEFT CONTENT */}
                    <Col xs={12} lg={8}>

                        {/* OPENING HOURS */}
                        <Card className="border-0 shadow-sm mb-3 mb-md-4">
                            <Card.Body className="p-3 p-md-4">
                                <h5 className="fw-semibold mb-3 fs-5 fs-md-4">Opening Hours</h5>

                                {Object.entries(operating_hours).map(([day, time]) => (
                                    <div
                                        key={day}
                                        className="d-flex justify-content-between border-bottom py-2 fs-6"
                                    >
                                        <strong className="text-capitalize">{day}</strong>
                                        <span className="text-end">{time || '-'}</span>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>

                        {/* LOCATION & ADDRESS + MAP */}
                        <Card className="border-0 shadow-sm mb-3 mb-md-4">
                            <Card.Body className="p-3 p-md-4">
                                <h5 className="fw-semibold mb-2 mb-md-3 fs-5 fs-md-4">Location & Address</h5>

                                <p className="text-muted fs-6 mb-3">
                                    {address.full_address}
                                </p>

                                <div className="ratio ratio-16x9 rounded overflow-hidden mb-3">
                                    <iframe
                                        title="map"
                                        src={mapEmbedUrl}
                                        style={{ border: 0 }}
                                        loading="lazy"
                                    />
                                </div>

                                <div className="d-flex flex-column flex-sm-row gap-2">
                                    <Button
                                        variant="primary"
                                        href={directionsLink}
                                        target="_blank"
                                        className="btn-sm btn-md-md"
                                        size="sm"
                                    >
                                        <i className="bi bi-map me-1 me-md-2" />
                                        Get Directions
                                    </Button>

                                    <Button
                                        variant="outline-secondary"
                                        href={google_maps_link}
                                        target="_blank"
                                        className="btn-sm btn-md-md"
                                        size="sm"
                                    >
                                        <i className="bi bi-google me-1 me-md-2" />
                                        Open in Google Maps
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* RIGHT SIDEBAR */}
                    <Col xs={12} lg={4}>

                        <div className="sticky-lg-top" style={{ top: '1rem' }}>

                            {/* CONTACT */}
                            <Card className="border-0 shadow-sm mb-3 mb-md-4">
                                <Card.Body className="p-3 p-md-4">
                                    <h5 className="fw-semibold mb-3 fs-5 fs-md-4">Contact</h5>

                                    {contacts.phone_number ? (
                                        <p className="mb-2 fs-6">
                                            <i className="bi bi-telephone me-2" />
                                            <a href={`tel:${contacts.phone_number}`} className="text-decoration-none">
                                                {contacts.phone_number}
                                            </a>
                                        </p>
                                    ) : (
                                        <p className="text-muted fs-6">No phone number</p>
                                    )}

                                    {contacts.facebook_link && (
                                        <p className="mb-2 fs-6">
                                            <i className="bi bi-facebook me-2" />
                                            <a href={contacts.facebook_link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                Facebook
                                            </a>
                                        </p>
                                    )}

                                    {contacts.instagram_link && (
                                        <p className="mb-0 fs-6">
                                            <i className="bi bi-instagram me-2" />
                                            <a href={contacts.instagram_link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                Instagram
                                            </a>
                                        </p>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* QUICK ACTIONS */}
                            <Card className="border-0 shadow-sm">
                                <Card.Body className="p-3 p-md-4">
                                    <h5 className="fw-semibold mb-3 fs-5 fs-md-4">Quick Actions</h5>

                                    <div className="d-grid gap-2">
                                        <Button variant="outline-primary" size="sm" className="btn-md-md">
                                            <i className="bi bi-star me-1 me-md-2" />
                                            Add Review
                                        </Button>

                                        <Button variant="outline-secondary" size="sm" className="btn-md-md">
                                            <i className="bi bi-share me-1 me-md-2" />
                                            Share Store
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>

                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}