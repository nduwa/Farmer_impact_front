// fetchTokenSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  commission: null,
  loading:false,
  error: null,
};

const commisionFeesSlice = createSlice({
  name: 'commissionFees',
  initialState,
  reducers: {
    commissionPending: (state, action) => {
      state.loading = true;
			state.error = null;
    },
    commissionSuccess: (state, action) => {
      state.commission = action.payload;
      state.loading = true;
			state.error = null;
    },
    commissionFail: (state,action) => {
      state.loading = false;
			state.commission= null;
      state.error = action.payload;
    },
  },
});

export const { commissionPending, commissionSuccess, commissionFail } = commisionFeesSlice.actions;
export default commisionFeesSlice.reducer;
