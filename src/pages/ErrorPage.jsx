//create me an error page component with bootstrap styling that displays a 404 error message and a link to go back to the home page.
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
    return (
        <div
            className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center"
            style={{ backgroundColor: '#f8f9fa' }}>
            <Row className="w-100">
                <Col>
                    <div className='text-muted'> 
                        <h1 className="display-1">404</h1>
                        <h2 className="mb-4">Page Not Found</h2>
                        <p className="mb-4">Sorry, the page you are looking for does not exist.</p>    
                    </div>
                    <Link to="/">
                        <Button variant="primary">Go Back to Home</Button>
                    </Link>
                </Col>
            </Row>
        </div>
    )
}