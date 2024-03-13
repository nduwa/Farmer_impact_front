import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  result: null,
  error: null,
  loading: false,
};
const journalsByCherryLotSlice = createSlice({
  name: "fetchAllJournalsByCherryLotId",
  initialState,
  reducers: {
    journalPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    journalSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.result = action.payload;
    },
    journalFail: (state, action) => {
      state.loading = false;
      state.result = null;
      state.error = action.payload;
    },
  },
});

export const { journalPending, journalSuccess, journalFail } =
  journalsByCherryLotSlice.actions;
export default journalsByCherryLotSlice.reducer;
