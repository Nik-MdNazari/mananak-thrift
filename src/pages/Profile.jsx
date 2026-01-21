import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap'
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthProvider.jsx'

export default function Profile() {
  const { currentUser, loading } = useContext(AuthContext);
  const [ myStores, setMyStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);

  const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

  useEffect(() => {
    if (!currentUser) return;

    async function fetchMyStores() {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${currentUser.uid}/stores`);
        setMyStores(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingStores(false);
      }
    }
    fetchMyStores();
   }, [currentUser]); 

  // Placeholder user data
  const user = {
    username: currentUser?.displayName ||'Anonymous User',
    email: currentUser?.email,
    joinedAt: new Date(currentUser?.metadata.creationTime).toLocaleDateString(),
  }

  if (loading) return <p className="text-center mt-5">Loading profile...</p>
  if (loadingStores) return <p className="text-center mt-5">Loading your stores...</p>

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
