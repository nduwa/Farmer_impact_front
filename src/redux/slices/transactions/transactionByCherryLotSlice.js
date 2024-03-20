import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    journal:null,
	error: null,
	loading: false,
	
};
const transactionsByCherryLotSlice = createSlice({
	name: 'fetchAllTransactionsByCherryLot',
	initialState,
	reducers: {
        transactionsPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		transactionsSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.journal = action.payload;
		},
		transactionFail: (state, action) => {
		state.loading = false;
			state.journal = null;
			state.error = action.payload;
		},
	
	},
});

export const { transactionsPending, transactionsSuccess, transactionsFail} =
transactionsByCherryLotSlice.actions;
export default transactionsByCherryLotSlice.reducer;