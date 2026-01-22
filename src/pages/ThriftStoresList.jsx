import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import ThriftStoreCard from "../components/ThriftStoreCard";

const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

export default function ThriftStoresList() {
    const theme = {
        dark: '#45595a',
        accent: '#c85103',
        mid: '#a2a092',
        light: '#e8e8e0',
        off: '#f6f4ef'
    }
    
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/stores`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch stores");
                }
                return res.json();
            })
            .then((data) => {
                setStores(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: theme.off, color: theme.dark }}>
            <Container className="py-4">
                <h1 className="mb-4">Thrift Stores</h1>
                <Row >
                    {loading && (
                        <div className="d-flex justify-content-center align-items-center py-5 w-100">
                            <Spinner animation="border" variant="secondary" />
                        </div>
                    )}
                    {!loading && error && (
                        <Alert variiant="danger" className="text-center w-100 my-4">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                        </Alert>
                    )}
                    {!loading && !error && (
                        <>
                            {stores.map((store) => (
                                <Col xs={12} md={6} lg={4} className="mb-4" key={store.id}>
                                    <ThriftStoreCard store={store} />
                                </Col>
                            ))} 
                        </>
                    )}
                </Row>
            </Container>
        </div>
    );
}
