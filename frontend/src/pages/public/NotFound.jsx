import { Link } from 'react-router-dom'
import PublicLayout from '../../components/common/Layout/PublicLayout'

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="flex flex-col items-center justify-center gap-4 px-6 py-32 text-center">
        <p className="font-mono text-sm text-brand-600">404</p>
        <h1 className="text-3xl font-semibold text-ink">Page not found</h1>
        <p className="max-w-sm text-sm text-ink-soft">
          The page you're looking for doesn't exist, or may have moved.
        </p>
        <Link to="/" className="btn-primary mt-2">Back to home</Link>
      </section>
    </PublicLayout>
  )
}
