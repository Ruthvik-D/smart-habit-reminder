import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, description, onClose, children, size = 'md' }) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const width = size === 'sm' ? 'max-w-sm' : 'max-w-lg'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-navy-900/40 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`animate-slide-up relative max-h-[90vh] w-full ${width} overflow-y-auto rounded-t-2xl bg-white p-6 shadow-lift sm:rounded-2xl`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
            {description && <p className="mt-1 text-sm text-navy-500">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="btn-ghost -mr-2 -mt-2 px-2" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
