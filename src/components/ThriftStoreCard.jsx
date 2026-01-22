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

  // Get Friday's hours from operating_hours
  const fridayHours = store.operating_hours?.friday || 'Closed'

  return (
    <Card className="h-100 shadow-sm border-0 rounded-3">
      {/* Card Body as flex column for height control */}
      <Card.Body className="d-flex flex-column p-3 p-md-4">

        {/* Status Badges */}
        <div className="mb-2 mb-md-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Badge bg="warning" text="dark" className="px-2 py-1 fs-6 fs-md-7">
            {store.address?.state || 'N/A'}
          </Badge>
          <Badge bg="success" className="px-2 py-1 fs-6 fs-md-7">
            Open now
          </Badge>
        </div>

        {/* Store Title */}
        <Card.Title
          as={'h2'}
          className="fw-bold mb-2 mb-md-3 fs-5 fs-md-4"
          style={{ color: theme.dark }}
        >
          {store.name || 'Unknown Store'}
        </Card.Title>

        {/* Location */}
        <div className="d-flex align-items-center mb-2 mb-md-3">
          <i className="bi bi-geo-alt-fill me-2 fs-6 fs-md-5" style={{ color: theme.accent }} />
          <span className="text-muted fs-6 fs-md-7">
            {store.address?.city && store.address?.state
              ? `${store.address.city}, ${store.address.state}`
              : 'Location not available'}
          </span>
        </div>

        {/* Operating Hours Card */}
        <Card className="mb-2 mb-md-3 border" style={{ backgroundColor: theme.off }}>
          <Card.Body className="py-2 px-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar-day me-2 fs-6" />
                <span className="fw-medium fs-6">Friday</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-clock me-2 fs-6" />
                <span className="fs-6">{fridayHours}</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Spacer to push buttons to bottom */}
        <div className="mt-auto" />

        {/* Actions */}
        <div className="d-grid gap-2 d-sm-flex">
          <Button
            className="w-100 w-sm-auto fs-6"
            variant="outline-dark"
            href={store.google_maps_link}
            target="_blank"
          >
            Show Direction
          </Button>

          <Button
            className="w-100 w-sm-auto fs-6"
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