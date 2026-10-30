export default function LoadingState({ label = 'Loading...', fullScreen = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-navy-500 ${fullScreen ? 'min-h-screen' : 'py-16'}`}
      role="status"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-primary-600" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
