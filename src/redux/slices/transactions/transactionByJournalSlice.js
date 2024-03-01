import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    journal:null,
	error: null,
	loading: false,
	
};
const transactionByJournalSlice = createSlice({
	name: 'fetchAllTransactionsByJournal',
	initialState,
	reducers: {
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

export const { journalPending, journalSuccess, journalFail} =
transactionByJournalSlice.actions;
export default transactionByJournalSlice.reducer;