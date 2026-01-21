import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap'
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthProvider.jsx'
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, loading } = useContext(AuthContext);
  const [ dbUser, setDbUser ] = useState(null);
  const [ myStores, setMyStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

  useEffect(() => {
    if (!currentUser) return;

    async function fetchDbUser() {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/me?uid=${currentUser.uid}`);
        console.log(res.data);
        setDbUser(res.data);
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    }

    async function fetchMyStores() {
      try {
        const res = await axios.get(`${API_BASE_URL}/stores/user/${currentUser.uid}`);
        setMyStores(res.data);

      } catch (error) {
        console.error('Error fetching user stores: ', error);
      } finally {
        setLoadingStores(false);
      }
    }
    fetchDbUser();
    fetchMyStores();

   }, [currentUser]); 

   const handleDeleteStore = async (storeId) => {
     const confirmed = window.confirm('Are you sure you want to delete this store? This action cannot be undone.');
     if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/stores/${storeId}`);
      setMyStores(myStores.filter(store => store.ts_id !== storeId));
    } catch (error) {
      console.error('Error deleting store: ', error);
    }
  }

   {/* USER INFO */}
  const user = {
    username: dbUser?.username ||'Anonymous',
    email: dbUser?.email,
    joinedAt: new Date(dbUser?.created_at).toLocaleDateString(),
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
              <p><strong>Name:</strong> {user.username}</p>
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
              <h4 className="mb-3">My Contribution</h4>

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
                        <Button size="sm" variant="outline-primary" onClick={() => navigate(`/stores/${store.ts_id}/edit`)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDeleteStore(store.ts_id)}>
                          Delete
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>

          <Button size='md' variant='secondary' className='mx-2' onClick={() => navigate('/stores/new')}>
            Add Thrift Store
          </Button>
        </Col>
      </Row>
    </Container>
  )
}
