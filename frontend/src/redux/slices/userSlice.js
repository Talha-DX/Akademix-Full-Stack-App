import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: { list: [], selected: null },
  reducers: {
    setUsers: (state, action) => {
      state.list = action.payload
    },
    selectUser: (state, action) => {
      state.selected = action.payload
    },
  },
})

export const { setUsers, selectUser } = userSlice.actions
export default userSlice.reducer
