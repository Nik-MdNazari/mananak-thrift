import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap'

export default function Profile() {
  // Placeholder user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    joinedAt: 'January 2025',
  }

  // Placeholder thrift stores added by user
  const myStores = [
    {
      id: 1,
      name: 'Vintage Vault',
      location: 'Petaling Jaya',
    },
    {
      id: 2,
      name: 'Retro Lane',
      location: 'Kuala Lumpur',
    },
  ]

  return (
    <Container className="py-5">
      <Row>
        {/* USER INFO */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-3">My Profile</h4>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Member since:</strong> {user.joinedAt}</p>

              <Button variant="outline-secondary" className="w-100 mt-2">
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* USER'S STORES */}
        <Col md={8}>
          <Card className='mb-3'>
            <Card.Body>
              <h4 className="mb-3">My Thrift Stores</h4>

              {myStores.length === 0 ? (
                <p className="text-muted">
                  You haven’t added any thrift stores yet.
                </p>
              ) : (
                <ListGroup>
                  {myStores.map((store) => (
                    <ListGroup.Item
                      key={store.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-0">{store.name}</h6>
                        <small className="text-muted">{store.location}</small>
                      </div>

                      <div className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline-danger">
                          Delete
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>

          <Button size='md' variant='secondary' className='mx-2'>Add Thrift Store</Button>
        </Col>
      </Row>
    </Container>
  )
}
