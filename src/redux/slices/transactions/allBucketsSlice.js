import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  buckets: null,
  error: null,
  loading: false,
};
const allBucketsSlice = createSlice({
  name: "allBuckets",
  initialState,
  reducers: {
    bucketsPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    bucketsSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.buckets = action.payload;
    },
       bucketsFail: (state, action) => {
      state.loading = false;
      state.buckets = null;
      state.error = action.payload;
    },
  },
});

export const { bucketsPending, bucketsSuccess, bucketsFail } =
  allBucketsSlice.actions;
export default allBucketsSlice.reducer;
