import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	staffs: null,
	transactions:null,
	error: null,
	loading: false,
	journal:null
	
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
		transactionsPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		transactionsSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.transactions = action.payload;
		},
		transactionsFail: (state, action) => {
		state.loading = false;
			state.transactions = null;
			state.error = action.payload;
		},
		journalPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		journalSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.journal = action.payload;
		},
		journalFail: (state, action) => {
		state.loading = false;
			state.journal = null;
			state.error = action.payload;
		},
	
	},
});

export const { fetchPending, fetchSuccess, fetchFail, transactionsPending,transactionsSuccess,transactionsFail , journalPending,journalSuccess,journalFail} =
fetchAllStaffSlice.actions;
export default fetchAllStaffSlice.reducer;