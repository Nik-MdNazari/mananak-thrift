import { Container, Row, Col, Card, Button, ListGroup, Spinner } from 'react-bootstrap'
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthProvider.jsx'
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider'
import ConfirmModal from '../components/ConfirmModal.jsx';

export default function Profile() {
  const theme = {
        dark: '#45595a',
        accent: '#c85103',
        mid: '#a2a092',
        light: '#e8e8e0',
        off: '#f6f4ef'
  }
  
  const { currentUser, loading } = useContext(AuthContext);
  const [ dbUser, setDbUser ] = useState(null);
  const [ myStores, setMyStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStoreId, setSelectedStoreId] = useState(null)
  const navigate = useNavigate();
  const { showToast } = useToast();

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

    async function confirmDelete() {
      try {
        await axios.delete(`${API_BASE_URL}/stores/${selectedStoreId}`)
        setMyStores(prev => prev.filter(s => s.ts_id !== selectedStoreId))
        showToast('Store deleted successfully', 'success')
      } catch {
        showToast('Failed to delete store', 'danger')
      } finally {
        setShowDeleteModal(false)
      }
    }

   {/* USER INFO */}
  const user = {
    username: dbUser?.username ||'Anonymous',
    email: dbUser?.email,
    joinedAt: new Date(dbUser?.created_at).toLocaleDateString(),
  }

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center py-5 w-100">
      <Spinner animation="border" variant="secondary" />
    </div>
  )

  if (loadingStores) return (
    <div className="d-flex justify-content-center align-items-center py-5 w-100">
      <Spinner animation="border" variant="secondary" />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.off, color: theme.dark }}>
      <Container className="py-5">
        <Row>
          {/* USER INFO */}
          <Col md={4}>
            <Card className="shadow-sm border-0 mb-4">
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
                  <ListGroup variant="flush">
                    {myStores.map((store) => (
                      <ListGroup.Item 
                        key={store.id}
                        className="py-3 d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <h6 className="mb-0">{store.name}</h6>
                          <small className="text-muted">{store.location}</small>
                        </div>

                        <div className="d-flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            onClick={() => navigate(`/stores/${store.ts_id}/edit`)}
                          >
                            Edit
                          </Button>

                          <Button 
                            size="sm" 
                            variant="outline-danger" 
                            onClick={() => {
                              setShowDeleteModal(true)
                              setSelectedStoreId(store.ts_id)
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>

            <Button variant='secondary' className='mt-3 mx-2' onClick={() => navigate('/stores/new')}>
              Add Thrift Store
            </Button>
            <Button variant="dark" className="mt-3 mx-1" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </Col>
        </Row>
        <ConfirmModal
          show={showDeleteModal}
          title="Deleting Thrift Store"
          message={<span>Are you sure you want to delete this thrift store?<br/>This action cannot be undone.</span>}
          confirmText="Delete"
          confirmVariant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </Container>
    </div>
  )
}