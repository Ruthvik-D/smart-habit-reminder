export default function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-rose-700" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-navy-500">{hint}</p>
      )}
    </div>
  )
}
