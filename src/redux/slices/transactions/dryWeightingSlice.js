import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  weight: null,
  error: null,
  loading: false,
};
const dryWeightingSlice = createSlice({
  name: "dryWeighting",
  initialState,
  reducers: {
    weightingPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    weightingSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.weight = action.payload;
    },
    weightingFail: (state, action) => {
      state.loading = false;
      state.weight = null;
      state.error = action.payload;
    },
  },
});

export const { weightingPending, weightingSuccess, weightingFail } =
  dryWeightingSlice.actions;
export default dryWeightingSlice.reducer;
