import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import notificationReducer from './slices/notificationSlice'
import themeReducer from './slices/themeSlice'

// Note: the app currently drives auth/theme/notifications via React Context
// (see src/context/). This store is scaffolded per the project structure
// for pages that outgrow context — wire a slice in as it's needed.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    notification: notificationReducer,
    theme: themeReducer,
  },
})
