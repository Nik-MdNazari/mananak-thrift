import { useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function CreateStore() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    opening_hours: '',
    price_range: '',
    google_maps_link: '',
    added_by: '',

    address: {
      address_line: '',
      city: '',
      state: '',
      latitude: '',
      longitude: ''
    },

    contacts: {
      phone: '',
      instagram: ''
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /** 
   * Handles top-level fields
   */
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  /**
   * Handles nested fields (address, contacts)
   */
  function handleNestedChange(section, field, value) {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:3000/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        throw new Error('Failed to create store')
      }

      const data = await res.json()

      navigate(`/stores/${data.store_id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Create New Thrift Store</h2>

      {error && <p className="text-danger">{error}</p>}

      <Form onSubmit={handleSubmit}>
        {/* ================= Store Info ================= */}
        <h5 className="mb-3">Store Information</h5>

        <Form.Group className="mb-3">
          <Form.Label>Store Name *</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Opening Hours</Form.Label>
              <Form.Control
                name="opening_hours"
                value={formData.opening_hours}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Price Range</Form.Label>
              <Form.Control
                name="price_range"
                value={formData.price_range}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-4">
          <Form.Label>Google Maps Link</Form.Label>
          <Form.Control
            name="google_maps_link"
            value={formData.google_maps_link}
            onChange={handleChange}
          />
        </Form.Group>

        {/* ================= Address ================= */}
        <h5 className="mb-3">Address</h5>

        <Form.Group className="mb-3">
          <Form.Label>Address Line</Form.Label>
          <Form.Control
            value={formData.address.address_line}
            onChange={(e) =>
              handleNestedChange('address', 'address_line', e.target.value)
            }
            required
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                value={formData.address.city}
                onChange={(e) =>
                  handleNestedChange('address', 'city', e.target.value)
                }
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control
                value={formData.address.state}
                onChange={(e) =>
                  handleNestedChange('address', 'state', e.target.value)
                }
              />
            </Form.Group>
          </Col>
        </Row>

        {/* ================= Contacts ================= */}
        <h5 className="mb-3">Contacts</h5>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            value={formData.contacts.phone}
            onChange={(e) =>
              handleNestedChange('contacts', 'phone', e.target.value)
            }
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Instagram</Form.Label>
          <Form.Control
            value={formData.contacts.instagram}
            onChange={(e) =>
              handleNestedChange('contacts', 'instagram', e.target.value)
            }
          />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Store'}
        </Button>
      </Form>
    </Container>
  )
}
