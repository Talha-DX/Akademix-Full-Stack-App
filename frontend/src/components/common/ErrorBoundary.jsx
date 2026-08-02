import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Akademix UI error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-ink">Something went wrong</p>
          <p className="max-w-sm text-sm text-ink-soft">
            Try refreshing the page. If this keeps happening, let us know what you were doing.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
