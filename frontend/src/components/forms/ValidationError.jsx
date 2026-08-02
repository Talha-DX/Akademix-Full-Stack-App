export default function ValidationError({ message }) {
  if (!message) return null
  return <p className="text-xs text-coral-600">{message}</p>
}
