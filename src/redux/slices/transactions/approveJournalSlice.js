import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    approveData:null,
	error: null,
	loading: false,
	
};
const approveJournalSlice = createSlice({
	name: 'approveJournal',
	initialState,
	reducers: {
        approvePending: (state) => {
			state.loading = true;
			state.error = null;
		},
		approveSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.approveData = action.payload;
		},
		approveFail: (state, action) => {
		state.loading = false;
			state.approveData = null;
			state.error = action.payload;
		},
	
	},
});

export const { approvePending, approveSuccess, approveFail} =
approveJournalSlice.actions;
export default approveJournalSlice.reducer;