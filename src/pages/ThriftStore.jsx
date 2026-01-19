import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert, Navbar, Nav, Carousel, Badge, Button, Card } from "react-bootstrap";
import AppNavbar from '../components/AppNavbar';

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
  const renderPriceRange = (level) => "₱".repeat(level);

  // Render stars from average_rating
  const renderStars = (rating) =>
    "★".repeat(rating) + "☆".repeat(5 - rating);

  // OpenStreetMap iframe URL
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${address.longitude - 0.01}%2C${address.latitude - 0.01}%2C${address.longitude + 0.01}%2C${address.latitude + 0.01}&layer=mapnik&marker=${address.latitude}%2C${address.longitude}`;

  // Directions (current location → store)
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}`;

  return (
    <Container className="py-4">
      {/* Title */}
      <h1 className="fw-bold">{name}</h1>
      <p className="text-muted">
        📍 {address.city}, {address.state}
      </p>

      {/* Rating & Price */}
      <div className="mb-3">
        <Badge bg="warning" text="dark" className="me-2">
          {renderStars(average_rating)}
        </Badge>
        <small className="text-muted me-3">
          ({total_ratings} reviews)
        </small>
        <Badge bg="secondary">
          {renderPriceRange(price_range)}
        </Badge>
      </div>

      <p>{description}</p>

      <Row className="g-4 mt-2">
        {/* LEFT COLUMN */}
        <Col md={8}>
          {/* Opening Hours */}
          <Card className="mb-3">
            <Card.Body>
              <h5>Opening Hours</h5>
              {Object.entries(operating_hours).map(
                ([day, time]) => (
                  <div key={day}>
                    <strong>
                      {day.charAt(0).toUpperCase() + day.slice(1)}:
                    </strong>{" "}
                    {time}
                  </div>
                )
              )}
            </Card.Body>
          </Card>

          {/* Location & Address */}
          <Card>
            <Card.Body>
              <h5>Location & Address</h5>
              <p>{address.full_address}</p>

              <iframe
                title="OpenStreetMap"
                src={mapEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
              />

              <div className="d-flex gap-2 mt-3">
                <Button
                  variant="primary"
                  href={directionsLink}
                  target="_blank"
                >
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

        {/* RIGHT COLUMN */}
        <Col md={4}>
          {/* Contact */}
          <Card>
            <Card.Body>
              <h5>Contact</h5>

              {contacts.phone_number ? (
                <p>
                  📞{" "}
                  <a href={`tel:${contacts.phone_number}`}>
                    {contacts.phone_number}
                  </a>
                </p>
              ) : (
                <p className="text-muted">No phone number</p>
              )}

              {contacts.facebook_link && (
                <p>
                  📘{" "}
                  <a href={contacts.facebook_link} target="_blank">
                    Facebook
                  </a>
                </p>
              )}

              {contacts.instagram_link && (
                <p>
                  📸{" "}
                  <a href={contacts.instagram_link} target="_blank">
                    Instagram
                  </a>
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}