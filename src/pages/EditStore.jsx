import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import StoreForm from '../components/StoreForm.jsx'

const API_BASE_URL = "https://c8429e85-0cc6-41db-8186-3ad2821bb10b-00-2o2qhf461pb8k.sisko.replit.dev";

export default function EditStore() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
  async function fetchStore() {
    try {
      const res = await fetch(`${API_BASE_URL}/stores/${id}`)

      if (!res.ok) {
        throw new Error('Store not found')
      }

      const json = await res.json()
      setStore(json.data) // or json, depending on your API
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  fetchStore()
}, [id])


  async function handleUpdate(data) {
    const res = await fetch(`${API_BASE_URL}/stores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!res.ok) throw new Error('Failed to update store')

    navigate(`/stores/${id}`)
  }

  if (loading) return <p>Loading...</p>

  return (
    <Container className="py-5">
      <h2>Edit Store</h2>
      <StoreForm
        initialData={store}
        onSubmit={handleUpdate}
        submitLabel="Update Store"
      />
    </Container>
  )
}
