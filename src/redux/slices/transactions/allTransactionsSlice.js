import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    transactions:null,
	error: null,
	loading: false,
	
};
const fetchAllTransactionsSlice = createSlice({
	name: 'fetchAllTransactions',
	initialState,
	reducers: {
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
	
	},
});

export const { transactionsPending, transactionsSuccess, transactionsFail} =
fetchAllTransactionsSlice.actions;
export default fetchAllTransactionsSlice.reducer;