import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: null,
	error: null,
	loading: false,
	
};
const fetchSingleUserSlice = createSlice({
	name: 'fetchSingleUser',
	initialState,
	reducers: {
	fetchPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		fetchSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.user = action.payload;
		},
		fetchFail: (state, action) => {
		state.loading = false;
			state.user = null;
			state.error = action.payload;
		},
	
	},
});

export const { fetchPending, fetchSuccess, fetchFail} =
fetchSingleUserSlice.actions;
export default fetchSingleUserSlice.reducer;