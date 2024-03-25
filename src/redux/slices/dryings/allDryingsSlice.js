import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	dryings: null,
	error: null,
	loading: false,	
};
const fetchAllDryingsSlice = createSlice({
	name: 'fetchAllDryings',
	initialState,
	reducers: {
	fetchPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		fetchSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.dryings = action.payload;
		},
		fetchFail: (state, action) => {
		state.loading = false;
			state.dryings = null;
			state.error = action.payload;
		},
	
	},
});

export const { fetchPending, fetchSuccess, fetchFail} =
    fetchAllDryingsSlice.actions;
export default fetchAllDryingsSlice.reducer;