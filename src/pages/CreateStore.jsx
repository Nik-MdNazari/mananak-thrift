import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import StoreForm from '../components/StoreForm.jsx'

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
    const { currentUser } = useContext(AuthContext)

    async function handleCreate(data) {
    console.log('Data being sent:', JSON.stringify(data, null, 2))
  
    try {
        const res = await fetch(`${API_BASE_URL}/stores`, {  // ✅ Comma INSIDE fetch()
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...data,
            added_by: 1
        })
    })
    
        if (!res.ok) {
        const errorData = await res.json()
        console.error('Backend error:', errorData)
        throw new Error('Failed to create store')
        }
        
        const result = await res.json()  // Only call once, after checking res.ok
        navigate(`/stores/${result.store_id}`)
        
    } catch (error) {
        console.error('Error creating store:', error)
        alert('Failed to create store. Please try again.')
    }
}

  return (
    <Container className="py-5">
      <h2>Create New Store</h2>
      <StoreForm
        initialData={EMPTY_STORE}
        onSubmit={handleCreate}
        submitLabel="Create Store"
      />
    </Container>
  )
}