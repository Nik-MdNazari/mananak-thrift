import { Container, Navbar, Nav, Row, Col, Card, Badge, Button, Carousel, ListGroup } from 'react-bootstrap';

export default function ThriftStore(props) {
    
    const theme = {
        dark: '#45595a',
        accent: '#c85103',
        mid: '#a2a092',
        light: '#e8e8e0',
        off: '#f6f4ef'
    }

    // Sample store object (used when no `store` prop is provided)
    const sampleStore = {
        id: 1,
        name: '2nd Street TTDI',
        description:
            'A trendy thrift store with a wide selection of vintage and contemporary clothing, accessories and homeware. Friendly staff and frequent new drops.',
        address: '2nd Street, TTDI, Kuala Lumpur',
        openingHours: 'Mon–Sat: 10:00 AM – 8:00 PM; Sun: 11:00 AM – 6:00 PM',
        logo: 'https://images.unsplash.com/photo-1520975911372-6c0d6f0d5f39?auto=format&fit=crop&w=200&q=60',
        imgs: [
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=60',
            'https://images.unsplash.com/photo-1520975911372-6c0d6f0d5f39?auto=format&fit=crop&w=900&q=60',
            'https://images.unsplash.com/photo-1503342452485-86f7b3d9a0f6?auto=format&fit=crop&w=900&q=60',
        ],
        directionLink:
            'https://www.google.com/maps/dir/?api=1&destination=2nd+Street,+TTDI,+Kuala+Lumpur',
        rating: 4,
        reviewsCount: 128,
        phone: '+60 12-345 6789',
        createdBy: 'ManaNak Team',
        lastEdited: '13 January 2025',
        tags: ['vintage', 'affordable', 'women', 'men', 'home'],
        priceRange: '₱ - ₱₱',
    };

    const store = props?.store ?? sampleStore;

    const renderStars = (n = 0) => {
        const full = '★'.repeat(Math.max(0, Math.min(5, n)));
        const empty = '☆'.repeat(5 - Math.max(0, Math.min(5, n)));
        return full + empty;
    };

    return (
        <div>
            {/* Navigation Bar */}
            <Navbar style={{ backgroundColor: theme.accent,  height: '80px' }} expand="lg" className="mb-3">
                <Container>
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
                </Container>
            </Navbar>

            {/* Back to home page button */}
            <Container>
                <Button variant="link" href="/stores" className="mb-3 p-0">
                    <i className="bi bi-arrow-left me-1" /> Back to Stores
                </Button>

                <Row className="g-4">
                    <Col md={8}>
                        <Card>
                            {/* Image carousel: grouped 4-image layout (large, two small stacked, large) */}
                            {store.imgs && store.imgs.length > 0 && (() => {
                                const imgs = store.imgs;
                                const chunkSize = 4;
                                const chunks = [];
                                for (let i = 0; i < imgs.length; i += chunkSize) chunks.push(imgs.slice(i, i + chunkSize));
                                if (chunks.length === 0) chunks.push([store.logo]);

                                return (
                                    <Carousel variant="dark">
                                        {chunks.map((group, idx) => {
                                            const fallback = imgs[0] || store.logo;
                                            const g = [...group];
                                            while (g.length < 4) g.push(fallback);

                                            return (
                                                <Carousel.Item key={idx}>
                                                    <div className="carousel-container d-flex gap-2 align-items-stretch" style={{ height: 420 }}>
                                                        <div className="carousel-item-large flex-fill">
                                                            <img
                                                                src={g[0]}
                                                                alt={`${store.name} photo ${idx}-left`}
                                                                className="img-fluid w-100 h-100 rounded"
                                                                style={{ objectFit: 'cover', height: '100%' }}
                                                            />
                                                        </div>

                                                        <div className="d-flex flex-column justify-content-between carousel-item-small" style={{ width: '33%' }}>
                                                            <img
                                                                src={g[1]}
                                                                alt={`${store.name} photo ${idx}-mid-top`}
                                                                className="img-fluid w-100 rounded mb-2"
                                                                style={{ objectFit: 'cover', height: '50%' }}
                                                            />
                                                            <img
                                                                src={g[2]}
                                                                alt={`${store.name} photo ${idx}-mid-bottom`}
                                                                className="img-fluid w-100 rounded mt-2"
                                                                style={{ objectFit: 'cover', height: '50%' }}
                                                            />
                                                        </div>

                                                        <div className="carousel-item-large flex-fill">
                                                            <img
                                                                src={g[3]}
                                                                alt={`${store.name} photo ${idx}-right`}
                                                                className="img-fluid w-100 h-100 rounded"
                                                                style={{ objectFit: 'cover', height: '100%' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Carousel.Item>
                                            );
                                        })}
                                    </Carousel>
                                );
                            })()}

                            {/* Store details sectio - name, description, logo, rating, status */}
                            <Card.Body>
                                <div className="d-flex align-items-start">
                                    <img
                                        src={store.logo}
                                        alt={`${store.name} logo`}
                                        className="rounded me-3"
                                        style={{ width: 90, height: 90, objectFit: 'cover' }}
                                    />
                                    <div className="flex-grow-1">
                                        <h3 className="mb-1">{store.name}</h3>
                                        <div className="mb-2">
                                            <Badge bg="warning" text="dark" className="me-2">
                                                {renderStars(store.rating)}
                                            </Badge>
                                            <small className="text-muted">{store.reviewsCount} reviews</small>
                                            <span className="badge bg-success ms-3">Open Now</span>
                                        </div>
                                        <p className="mb-1">{store.description}</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="mt-3">
                            <Card.Body>
                                <h5>About {store.name}</h5>
                                <p>{store.description}</p>
                            </Card.Body>
                        </Card>

                        <Card className="mt-3">  
                            <Card.Body>
                                <h5>Location & Address </h5>
                                <h6>Full Address</h6>
                                <p className="mb-2">{store.address}</p>

                                <div className="d-flex gap-2">
                                    <Button variant="primary" href={store.directionLink} target="_blank">
                                        Get Directions
                                    </Button>
                                    <Button variant="outline-secondary">Open In Google Maps</Button>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className='mt-3 mb-4'>
                            <Card.Body>
                                <h5>Opening Hours</h5>
                                <p className="mb-2">{store.openingHours}</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>

                        <Card className='mb-3'>
                            <Card.Body>
                                <h5 className='mb-3'>Contacts</h5>
                                <p><strong>Phone:</strong> {store.phone}</p>
                                <p><strong>Email:</strong> {store.email}</p>
                                <p><strong>Instagram:</strong> {store.instagram}</p>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Body>
                                <h5 className='mb-3'>Actions</h5>
                                <div className="d-grid gap-2">
                                    <Button variant="primary" href={store.directionLink} target="_blank">
                                        Get Direction
                                    </Button>
                                    <Button variant="outline-primary">Add a review</Button>
                                    <Button variant="outline-secondary">Edit Info</Button>
                                    <Button variant="outline-secondary">Share</Button>
                                </div>

                                <hr />

                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <strong>Phone:</strong> {store.phone}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Price:</strong> {store.priceRange}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Created by:</strong> {store.createdBy}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Last edited:</strong> {store.lastEdited}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}