import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	modules: null,
	error: null,
	loading: false,
	
};
const fetchAllModulesSlice = createSlice({
	name: 'fetchAllModules',
	initialState,
	reducers: {
	fetchPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		fetchSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.modules = action.payload;
		},
		fetchFail: (state, action) => {
		state.loading = false;
			state.modules = null;
			state.error = action.payload;
		},
	
	},
});

export const { fetchPending, fetchSuccess, fetchFail} =
fetchAllModulesSlice.actions;
export default fetchAllModulesSlice.reducer;