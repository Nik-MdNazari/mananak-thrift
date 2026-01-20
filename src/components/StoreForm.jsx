import { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'

export default function StoreForm({
  initialData,
  onSubmit,
  submitLabel = 'Save',
  loading = false
}) {
  const [formData, setFormData] = useState(initialData)

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  function handleNestedChange(section, field, value) {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    })
  }

  function handleOpeningHoursChange(day, value) {
    setFormData(prev => ({
      ...prev,
      operating_hours: {
        ...prev.operating_hours,
        [day]: value
      }
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      ...formData,
      address: {
        ...formData.address,
        latitude: Number(formData.address.latitude) || null,
        longitude: Number(formData.address.longitude) || null
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>

      {/* ===== Store Info ===== */}
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
          <Form.Control
            placeholder="Price Range"
            name="price_range"
            value={formData.price_range}
            onChange={handleChange}
            className="mb-3"
          />
        </Col>
        <Col>
          <Form.Control
            placeholder="Google Maps Link"
            name="google_maps_link"
            value={formData.google_maps_link}
            onChange={handleChange}
            className="mb-3"
          />
        </Col>
      </Row>

      {/* ===== Opening Hours (JSONB) ===== */}
      <h5 className="mb-3">Opening Hours</h5>

      {Object.keys(formData.operating_hours).map(day => (
        <Form.Group key={day} className="mb-2">
          <Form.Label className="text-capitalize">{day}</Form.Label>
          <Form.Control
            placeholder="e.g. 10:00 AM - 10:00 PM"
            value={formData.operating_hours[day]}
            onChange={(e) =>
              handleOpeningHoursChange(day, e.target.value)
            }
          />
        </Form.Group>
      ))}

      {/* ===== Address ===== */}
      <h5 className="mt-4 mb-3">Address</h5>

      <Form.Control
        placeholder="Unit Number"
        className="mb-2"
        value={formData.address.unit_number}
        onChange={(e) =>
          handleNestedChange('address', 'unit_number', e.target.value)
        }
      />

      <Form.Control
        placeholder="Address Line 1"
        className="mb-2"
        value={formData.address.address_line_1}
        onChange={(e) =>
          handleNestedChange('address', 'address_line_1', e.target.value)
        }
        required
      />

      <Form.Control
        placeholder="Address Line 2"
        className="mb-2"
        value={formData.address.address_line_2}
        onChange={(e) =>
          handleNestedChange('address', 'address_line_2', e.target.value)
        }
      />

      <Row>
        <Col>
          <Form.Control
            placeholder="City"
            className="mb-2"
            value={formData.address.city}
            onChange={(e) =>
              handleNestedChange('address', 'city', e.target.value)
            }
          />
        </Col>
        <Col>
          <Form.Control
            placeholder="State"
            className="mb-2"
            value={formData.address.state}
            onChange={(e) =>
              handleNestedChange('address', 'state', e.target.value)
            }
          />
        </Col>
        <Col>
          <Form.Control
            placeholder="Postal Code"
            className="mb-2"
            value={formData.address.postal_code}
            onChange={(e) =>
              handleNestedChange('address', 'postal_code', e.target.value)
            }
          />
        </Col>
      </Row>

      {/* ===== Contacts ===== */}
      <h5 className="mt-4 mb-3">Contacts</h5>

      <Form.Control
        placeholder="Phone Number"
        className="mb-2"
        value={formData.contacts.phone_number}
        onChange={(e) =>
          handleNestedChange('contacts', 'phone_number', e.target.value)
        }
      />

      <Form.Control
        placeholder="Instagram Link"
        className="mb-2"
        value={formData.contacts.instagram_link}
        onChange={(e) =>
          handleNestedChange('contacts', 'instagram_link', e.target.value)
        }
      />

      <Form.Control
        placeholder="Facebook Link"
        className="mb-4"
        value={formData.contacts.facebook_link}
        onChange={(e) =>
          handleNestedChange('contacts', 'facebook_link', e.target.value)
        }
      />

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : submitLabel}
      </Button>
    </Form>
  )
}
