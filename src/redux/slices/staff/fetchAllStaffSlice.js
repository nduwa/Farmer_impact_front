import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	staffs: null,
	error: null,
	loading: false,
	
};
const fetchAllStaffSlice = createSlice({
	name: 'fetchAllStaff',
	initialState,
	reducers: {
	fetchPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		fetchSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.staffs = action.payload;
		},
		fetchFail: (state, action) => {
		state.loading = false;
			state.staffs = null;
			state.error = action.payload;
		},
	
	},
});

export const { fetchPending, fetchSuccess, fetchFail} =
fetchAllStaffSlice.actions;
export default fetchAllStaffSlice.reducer;