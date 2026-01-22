import { Card, Button, Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const theme = {
  dark: '#45595a',
  accent: '#c85103',
  mid: '#a2a092',
  light: '#e8e8e0',
  off: '#f6f4ef'
}

export default function ThriftStoreCard({ store = {} }) {
  const navigate = useNavigate()

  const stars = (n = 0) =>
    '★'.repeat(Math.max(0, Math.min(5, n))) +
    '☆'.repeat(5 - Math.max(0, Math.min(5, n)))

  return (
    <Card className="h-100 shadow-sm border-0 rounded-3">
      {/* Card Body as flex column for height control */}
      <Card.Body className="d-flex flex-column">

        {/* Header */}
        <div className="mb-2 d-flex justify-content-between align-items-start">
          <Card.Title
            as={'h3'}
            className="fw-bold mb-0 fs-6 fs-md-5 fs-lg-4"
            style={{ color: theme.dark }}
          >
            {store.name || 'Unknown Store'}
          </Card.Title>

          {typeof store.rating === 'number' && (
            <Badge
              bg="light"
              text="dark"
              className="ms-2 fs-6"
              style={{ border: `1px solid ${theme.mid}`, color: theme.accent }}
            >
              {stars(store.rating)}
            </Badge>
          )}
        </div>

        {/* Description (clamped) */}
        <Card.Text
          className="fs-6 mb-3"
        >
          {store.description || 'No description available for this thrift store.'}
        </Card.Text>

        {/* Address */}
        <div className="d-flex align-items-start mb-2 fs-6 text-muted">
          <i className="bi bi-geo-alt me-2 mt-1" />
          <span>
            {store.address?.full_address || 'Address not available'}
          </span>
        </div>

        {/* Opening hours */}
        <div className="d-flex align-items-center mb-3 fs-6 text-muted">
          <i className="bi bi-clock me-2" />
          <span>{store.openingHours || 'Opening hours not available'}</span>
        </div>

        {/* Spacer to push buttons to bottom */}
        <div className="mt-auto" />

        {/* Actions */}
        <div className="d-grid gap-2 d-md-flex">
          <Button
            className="w-100 w-md-auto fs-6"
            variant="outline-dark"
            href={store.google_maps_link}
            target="_blank"
          >
            Show Direction
          </Button>

          <Button
            className="w-100 w-md-auto fs-6"
            variant="secondary"
            onClick={() => navigate(`/stores/${store.ts_id}`)}
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
