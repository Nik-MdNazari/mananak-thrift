import { Modal, Button } from 'react-bootstrap'

export default function ConfirmModal({
  show,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton className="justify-content-center">
        <Modal.Title className="w-100">
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body >
        <p className="mb-0">{message}</p>
      </Modal.Body>

      <Modal.Footer className="px-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
