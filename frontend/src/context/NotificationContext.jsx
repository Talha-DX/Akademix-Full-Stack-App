import { createContext, useCallback, useContext, useState } from 'react'

const NotificationContext = createContext(null)

/**
 * Simple toast/notification queue. components/common/Toast.jsx renders
 * whatever is pushed here.
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const notify = useCallback((message, type = 'info') => {
    const id = Date.now()
    setNotifications((list) => [...list, { id, message, type }])
    setTimeout(() => {
      setNotifications((list) => list.filter((n) => n.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id) => {
    setNotifications((list) => list.filter((n) => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotificationContext must be used inside <NotificationProvider>')
  return ctx
}
