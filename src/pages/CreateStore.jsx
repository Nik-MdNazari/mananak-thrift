import { Container, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import StoreForm from '../components/StoreForm.jsx'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../components/AuthProvider.jsx'
import LoginModal from '../components/LoginModal.jsx'
import { useToast } from '../components/ToastProvider'

const EMPTY_STORE = {
  name: '',
  description: '',
  price_range: '',
  google_maps_link: '',
  added_by: 1,
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
    postal_code: '',
    latitude: 0.0,
    longitude: 0.0
  },
  contacts: {
    phone_number: '',
    instagram_link: '',
    facebook_link: ''
  }
}

const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

export default function CreateStore() {
    const navigate = useNavigate()
    const { currentUser, loading } = useContext(AuthContext)
    const [showLoginModal, setShowLoginModal] =  useState(false);
    const [modalDismissed, setModalDismissed] = useState(false)
    const { showToast } = useToast()

    useEffect(() => {
        if (!loading && !currentUser && !modalDismissed) {
            setShowLoginModal(true)
        }
    }, [currentUser, loading, modalDismissed])

    async function handleCreate(data) {
        // Check if user is logged in
        if (!currentUser) {
            setShowLoginModal(true)
            setModalDismissed(false) // Reset dismissal if they try to submit
            return
        }
        //console.log('Data being sent:', JSON.stringify(data, null, 2))
  
        try {
            const res = await fetch(`${API_BASE_URL}/stores`, {  // ✅ Comma INSIDE fetch()
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                added_by: currentUser.uid
            })
        })
        
            if (!res.ok) {
            const errorData = await res.json()
            console.error('Backend error:', errorData)
            throw new Error('Failed to create store')
            
            }
            
            const result = await res.json()
            showToast('Thrift store added successfully 🎉')
            navigate(`/stores/${result.store_id}`)
            
        } catch (error) {
            console.error('Error creating store:', error)
            showToast('Failed to add store', 'danger')
        }
    }

    const handleLoginClose = () => {
        setShowLoginModal(false)
        setModalDismissed(true)
    } 

    if (loading) {
        return <Container className="py-5">Loading...</Container>
    }
    
    return (
        <>
            <Container className="py-5">
            <h2 className='mb-3'>Create New Store</h2>
            { currentUser ?  (
                <StoreForm
                    initialData={EMPTY_STORE}
                    onSubmit={handleCreate}
                    submitLabel="Create Store"
                />
            ) : (
                    <Card className="text-center py-5" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' , boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '50%', margin: 'auto' }}>
                        <div className='d-flex flex-column align-items-center justify-content-center mb-3'>
                            <Card.Title>You are currently logged out.</Card.Title>
                            <Card.Text>Please log in to create a store.</Card.Text>
                            <Button 
                                variant="primary"
                                onClick={() => {
                                    setModalDismissed(false)
                                    setShowLoginModal(true)
                                }}
                                style={{ marginTop: '5px' , width: '120px' , alignContent: 'center'}}
                            >
                            Log In
                            </Button>
                        </div>
                        
                    </Card>
                )}
            </Container>

            <LoginModal 
                show={showLoginModal} 
                handleClose={handleLoginClose}
            />                            
        </>
    )
}