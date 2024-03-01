// fetchTokenSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  decodedToken: null,
  error: null,
};

const fetchTokenSlice = createSlice({
  name: 'fetchToken',
  initialState,
  reducers: {
    fetchToken: (state, action) => {
      state.token = action.payload;
    },
    decodeToken: (state, action) => {
      state.decodedToken = action.payload;
    },
    fetchFail: (state) => {
      state.error = 'Failed to fetch token';
    },
  },
});

export const { fetchToken, decodeToken, fetchFail } = fetchTokenSlice.actions;
export default fetchTokenSlice.reducer;
