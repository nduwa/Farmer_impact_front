

import { createSlice } from '@reduxjs/toolkit';

const logoutSlice = createSlice({
  name: 'logout',
  initialState: {
    token: null,
    decodedToken: null,
    
  },
  reducers: {
    signOut: (state) => {
      state.token = null;
      state.decodedToken = null;
    },
  },
});

export const { signOut } = logoutSlice.actions;
export default logoutSlice.reducer;