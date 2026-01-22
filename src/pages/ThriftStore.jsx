import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Navbar, Nav, Carousel, Badge, Button, Card } from "react-bootstrap";

const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

export default function ThriftStore() {
    const { id } =  useParams();
    
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

    if (loading) return <Spinner className="m-5" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

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
                style={{ fontSize: '1rem' }}
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
                style={{ fontSize: '1rem' }}
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
        <div className="bg-light min-vh-100">
            <Container className="py-4">

            {/* STOREHEADER */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={8}>
                            <h1 className="fw-bold mb-1">{name}</h1>

                            <p className="text-muted mb-4">
                                <i className="bi bi-geo-alt me-1" />
                                {address.city}, {address.state}
                            </p>

                            <div className="d-flex flex-wrap gap-2 mb-4">
                                <div style={{ marginRight: '1.3rem' }}>    
                                    <Badge bg="light" text="dark">
                                        {renderStars(average_rating)}
                                    </Badge>

                                    <span className="text-muted small">
                                        {total_ratings} reviews
                                    </span>                                    
                                </div>
                                    
                                <Badge bg="light">
                                    {renderPriceRange(price_range)}
                                </Badge>
                            </div>

                            {/* DESCRIPTION MOVED HERE */}
                            <p className="mb-0" style = {{fontSize: '1rem'}}>{description}</p>
                    </Col>
                    </Row>
                </Card.Body>
                </Card>

            {/* MAIN CONTENT */}
            <Row className="g-4">

                {/* LEFT CONTENT */}
                <Col lg={8}>

                    {/* OPENING HOURS */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                        <h5 className="fw-semibold mb-3">Opening Hours</h5>

                        {Object.entries(operating_hours).map(([day, time]) => (
                            <div
                            key={day}
                            className="d-flex justify-content-between border-bottom py-2 small"
                            >
                            <strong className="text-capitalize">{day}</strong>
                            <span>{time || '-'}</span>
                            </div>
                        ))}
                        </Card.Body>
                    </Card>

                    {/* LOCATION & ADDRESS + MAP */}
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                            <h5 className="fw-semibold mb-2">Location & Address</h5>

                            <p className="text-muted small mb-3">
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

                            <div className="d-flex flex-wrap gap-2">
                            <Button
                                variant="primary"
                                href={directionsLink}
                                target="_blank"
                            >
                                <i className="bi bi-map me-1" />
                                Get Directions
                            </Button>

                            <Button
                                variant="outline-secondary"
                                href={google_maps_link}
                                target="_blank"
                            >
                                Open in Google Maps
                            </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* RIGHT SIDEBAR */}
                <Col lg={4}>

                <div className="sticky-top" style={{ top: '1rem' }}>

                    {/* CONTACT */}
                    <Card className="border-0 shadow-sm mb-4">
                    <Card.Body>
                        <h5 className="fw-semibold mb-3">Contact</h5>

                        {contacts.phone_number ? (
                        <p className="mb-2">
                            <i className="bi bi-telephone me-2" />
                            <a href={`tel:${contacts.phone_number}`}>
                            {contacts.phone_number}
                            </a>
                        </p>
                        ) : (
                        <p className="text-muted small">No phone number</p>
                        )}

                        {contacts.facebook_link && (
                        <p className="mb-2">
                            <i className="bi bi-facebook me-2" />
                            <a href={contacts.facebook_link} target="_blank">
                            Facebook
                            </a>
                        </p>
                        )}

                        {contacts.instagram_link && (
                        <p className="mb-0">
                            <i className="bi bi-instagram me-2" />
                            <a href={contacts.instagram_link} target="_blank">
                            Instagram
                            </a>
                        </p>
                        )}
                    </Card.Body>
                    </Card>

                    {/* QUICK ACTIONS */}
                    <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <h5 className="fw-semibold mb-3">Quick Actions</h5>

                        <div className="d-grid gap-2">
                        <Button variant="outline-primary">
                            <i className="bi bi-star me-1" />
                            Add Review
                        </Button>

                        <Button variant="outline-secondary">
                            <i className="bi bi-share me-1" />
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