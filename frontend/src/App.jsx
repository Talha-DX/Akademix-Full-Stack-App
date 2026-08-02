import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import Toast from './components/common/Toast'
import { store } from './redux/store'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              <BrowserRouter>
                <AppRoutes />
                <Toast />
              </BrowserRouter>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  )
}
