import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import ThriftStoreCard from "../components/ThriftStoreCard";

const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

export default function ThriftStoresList() {
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

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <Container className="py-4">
            <h1 className="mb-4">Thrift Stores</h1>
            <Row >
                {stores.map((store) => (
                    <Col xs={12} md={6} lg={4} className="mb-4" key={store.id}>
                        <ThriftStoreCard store={store} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
