import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	stations: null,
	error: null,
	loading: false,	
};
const fetchAllStationsSlice = createSlice({
	name: 'fetchAllStations',
	initialState,
	reducers: {
	fetchPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		fetchSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.stations = action.payload;
		},
		fetchFail: (state, action) => {
		state.loading = false;
			state.stations = null;
			state.error = action.payload;
		},
	
	},
});

export const { fetchPending, fetchSuccess, fetchFail} =
    fetchAllStationsSlice.actions;
export default fetchAllStationsSlice.reducer;