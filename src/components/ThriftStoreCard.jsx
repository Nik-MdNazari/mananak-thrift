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
    const stars = (n = 0) => '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n))
    const navigate = useNavigate();

    return (
        <Card style={{ border: `1px solid ${theme.mid}`, backgroundColor: theme.off }}>
            
            {/* Card Image */}
            {store.img ? (
                <Card.Img 
                    variant='top' 
                    src={store.img} 
                    alt={`${store.name}`} 
                    style={{ objectFit: 'cover', height: 180 }} 
                />
            ) : (
                <div style={{ height: 180, backgroundColor: theme.light, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.dark, fontWeight: 600 }}>
                    No image
                </div>
            )}

            <Card.Body>
                <Card.Title style={{ color: theme.dark, fontWeight: 700, fontSize: '1.5rem' }} className='d-flex justify-content-between align-items-start '>
                    <span>{store.name || 'Unknown Store'}</span>

                    {/* Star icons to represent ratings
                        - will be updated to be dynamic depending on the store's review rating
                    */}
                    {typeof store.rating === 'number' && (
                        <Badge bg="light" text="dark" style={{ border: `1px solid ${theme.mid}`, color: theme.accent }}>
                        {stars(store.rating)}
                        </Badge>
                    )}
                </Card.Title>
            

                <Card.Text style={{ color: theme.dark , }}>
                    {store.description || 'No description available for this thrift store.'}                    
                </Card.Text>

                <div className='my-3'>
                    <i className='bi bi-geo-alt me-2' />{store.address || 'Address not available'}
                    <br />
                    <i className='bi bi-clock me-2' />{store.openingHours || 'Opening hours not available'}
                    {store.openingHours && (
                        <Badge bg="success" className='ms-4'>Open Now</Badge>
                    )}
                </div>

                <Button variant="primary" style={{ width: '300px', backgroundColor: theme.dark }} href={store.directionLink} className='me-3'>
                    Show Direction
                </Button>

                <Button variant="secondary" onClick={() => {navigate(`/thriftStore`)}}>
                    View Details
                </Button>
            </Card.Body>
        </Card>
    )
}