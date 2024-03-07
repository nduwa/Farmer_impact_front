// fetchTokenSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  commission: null,
  loading:false,
  error: null,
};

const commisionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {
    commissionPending: (state, action) => {
      state.commission= null;
    },
    commissionSuccess: (state, action) => {
      state.commission = action.payload;
    },
    commissionFail: (state) => {
      state.error = action.payload;
    },
  },
});

export const { commissionPending, commissionSuccess, commissionFail } = commisionSlice.actions;
export default commisionSlice.reducer;
