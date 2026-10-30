import { useState } from 'react'
import Modal from './Modal'
import Alert from './Alert'

export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onClose }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    setPending(true)
    setError('')
    try {
      await onConfirm()
      onClose()
    } catch (err) {
      setError(err.message)
      setPending(false)
    }
  }

  return (
    <Modal title={title} onClose={onClose} size="sm">
      <p className="text-sm text-navy-600">{message}</p>
      {error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={onClose} disabled={pending}>
          Cancel
        </button>
        <button type="button" className="btn-danger" onClick={handleConfirm} disabled={pending}>
          {pending ? 'Working...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
