import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  seasons: null,
  error: null,
  loading: false,
};
const fetchAllSeasonsSlice = createSlice({
  name: "fetchAllSeasons",
  initialState,
  reducers: {
    seasonsPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    seasonsSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.seasons = action.payload;
    },
    seasonsFail: (state, action) => {
      state.loading = false;
      state.seasons = null;
      state.error = action.payload;
    },
  },
});

export const { seasonsPending, seasonsSuccess, seasonsFail } =
  fetchAllSeasonsSlice.actions;
export default fetchAllSeasonsSlice.reducer;
