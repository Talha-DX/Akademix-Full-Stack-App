import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { items: [] },
  reducers: {
    push: (state, action) => {
      state.items.push(action.payload)
    },
    dismiss: (state, action) => {
      state.items = state.items.filter((n) => n.id !== action.payload)
    },
  },
})

export const { push, dismiss } = notificationSlice.actions
export default notificationSlice.reducer
