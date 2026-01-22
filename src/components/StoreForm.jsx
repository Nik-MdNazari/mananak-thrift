import { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap'

const EMPTY_STORE = {
  name: '',
  description: '',
  price_range: '',
  google_maps_link: '',
  operating_hours: {
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: ''
  },
  address: {
    unit_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: ''
  },
  contacts: {
    phone_number: '',
    instagram_link: '',
    facebook_link: ''
  }
}

export default function StoreForm({
  initialData,
  onSubmit,
  submitLabel = 'Save',
  loading = false
}) {
  const [formData, setFormData] = useState(initialData || EMPTY_STORE)

  useEffect(() => {
    if (initialData) setFormData(initialData)
  }, [initialData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNestedChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    })
  }

  const handleOpeningHoursChange = (day, value) => {
    setFormData(prev => ({
      ...prev,
      operating_hours: {
        ...prev.operating_hours,
        [day]: value
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Form onSubmit={handleSubmit}>

        {/* ===== STORE INFO ===== */}
        <Card className="mb-4 shadow-sm border-0 rounded-4">
            <Card.Body className="p-4">
                <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2">
                    <i className="bi bi-shop fs-5 text-primary"></i>
                    Store Information
                </h5>


            <Form.Floating className="mb-3">
                <Form.Control
                    name="name"
                    placeholder="Store Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    />
                    <label>Store Name *</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control
                    as="textarea"
                    name="description"
                    placeholder="Description"
                    style={{ height: '120px' }}
                    value={formData.description}
                    onChange={handleChange}
                />
                <label>Description</label>
            </Form.Floating>

            <Row className="g-3">
                <Col md={6}>
                    <Form.Floating>
                        <Form.Control
                            placeholder="Price Range (1-5)"
                            type='number'
                            min={1}
                            max={5}
                            step={1}
                            value={formData.price_range}
                            onChange={handleChange}
                            name="price_range"
                        />
                        <label>Price Range (1-5)</label>
                    </Form.Floating>
                 </Col>

                <Col md={6}>
                    <Form.Floating>
                        <Form.Control
                            placeholder="Google Maps Link"
                            required
                            value={formData.google_maps_link}
                            onChange={handleChange}
                            name="google_maps_link"
                        />
                        <label>Google Maps Link *</label>
                    </Form.Floating>
                </Col>
            </Row>
        </Card.Body>
      </Card>

        {/* ===== ADDRESS ===== */}
        <Card className="mb-4 shadow-sm border-0 rounded-4">
            <Card.Body className="p-4">
                <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2">
                    <i className="bi bi-geo-alt fs-5 text-primary"></i>
                    Address
                </h5>


                <Row className="g-3">
                    <Col md={4}>
                        <Form.Floating>
                            <Form.Control
                                placeholder="Unit Number"
                                value={formData.address.unit_number}
                                onChange={(e) =>
                                    handleNestedChange('address', 'unit_number', e.target.value)
                                }
                            />
                            <label>Unit Number</label>
                        </Form.Floating>
                    </Col>

                    <Col md={8}>
                        <Form.Floating>
                            <Form.Control
                                placeholder="Address Line 1"
                                required
                                value={formData.address.address_line_1}
                                onChange={(e) =>
                                    handleNestedChange('address', 'address_line_1', e.target.value)
                                }
                            />
                            <label>Address Line 1 *</label>
                        </Form.Floating>
                    </Col>

                    <Col md={12}>
                        <Form.Floating>
                            <Form.Control
                                placeholder="Address Line 2"
                                required
                                value={formData.address.address_line_2}
                                onChange={(e) =>
                                    handleNestedChange('address', 'address_line_2', e.target.value)
                                }
                            />
                        <label>Address Line 2 *</label>
                        </Form.Floating>
                    </Col>

                    <Col md={4}>
                        <Form.Floating>
                            <Form.Control
                                placeholder="City"
                                required
                                value={formData.address.city}
                                onChange={(e) =>
                                    handleNestedChange('address', 'city', e.target.value)
                                }
                            />
                            <label>City *</label>
                        </Form.Floating>
                    </Col>

                    <Col md={4}>
                        <Form.Floating>
                            <Form.Control
                                placeholder="State"
                                required
                                value={formData.address.state}
                                onChange={(e) =>
                                    handleNestedChange('address', 'state', e.target.value)
                                }
                            />
                            <label>State *</label>
                        </Form.Floating>
                    </Col>

                    <Col md={4}>
                        <Form.Floating>
                            <Form.Control
                                placeholder="Postal Code"
                                required
                                value={formData.address.postal_code}
                                onChange={(e) =>
                                    handleNestedChange('address', 'postal_code', e.target.value)
                                }
                            />
                            <label>Postal Code *</label>
                        </Form.Floating>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

        {/* ===== OPERATING HOURS ===== */}
        <Card className="mb-4 shadow-sm border-0 rounded-4">
            <Card.Body className="p-4">
                <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2">
                    <i className="bi bi-clock fs-5 text-primary"></i>
                    Operating Hours
                </h5>

                <Row className="g-3">
                    {Object.entries(formData.operating_hours).map(([day, value]) => (
                    <Col md={6} lg={4} key={day}>
                        <Form.Floating>
                            <Form.Control
                                placeholder="10:00 AM - 8:00 PM"
                                value={value}
                                onChange={(e) =>
                                handleOpeningHoursChange(day, e.target.value)
                                }
                            />
                            <label className="text-capitalize">{day}</label>
                        </Form.Floating>
                    </Col>
                    ))}
                </Row>
            </Card.Body>
        </Card>

        {/* ===== CONTACTS ===== */}
        <Card className="mb-4 shadow-sm border-0 rounded-4">
            <Card.Body className="p-4">
                <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2">
                    <i className="bi bi-telephone fs-5 text-primary"></i>
                    Contacts
                </h5>

                <Row className="g-3">
                    <Col md={4}>
                    <Form.Floating>
                        <Form.Control
                        placeholder="Phone Number"
                        value={formData.contacts.phone_number}
                        onChange={(e) =>
                            handleNestedChange('contacts', 'phone_number', e.target.value)
                        }
                        />
                        <label>Phone Number</label>
                    </Form.Floating>
                    </Col>

                    <Col md={4}>
                    <Form.Floating>
                        <Form.Control
                        placeholder="Instagram"
                        value={formData.contacts.instagram_link}
                        onChange={(e) =>
                            handleNestedChange('contacts', 'instagram_link', e.target.value)
                        }
                        />
                        <label>Instagram</label>
                    </Form.Floating>
                    </Col>

                    <Col md={4}>
                    <Form.Floating>
                        <Form.Control
                        placeholder="Facebook"
                        value={formData.contacts.facebook_link}
                        onChange={(e) =>
                            handleNestedChange('contacts', 'facebook_link', e.target.value)
                        }
                        />
                        <label>Facebook</label>
                    </Form.Floating>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

      {/* ===== SUBMIT ===== */}
      <div className="d-grid d-md-flex justify-content-md-end gap-2">
        <Button
            type="submit"
            size="md"
            className="px-5 d-flex align-items-center gap-2"
            disabled={loading}
        >
        {loading ? (
            <>
                <Spinner size="sm" />
                Saving...
            </>
            ) : (
            <>
                {submitLabel}
            </>
            )}
            </Button>
      </div>
    </Form>
  )
}
