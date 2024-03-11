import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    removeTransactionData:null,
	error: null,
	loading: false,
	
};
const removeTransactionSlice = createSlice({
	name: 'removeTransaction',
	initialState,
	reducers: {
        removePending: (state) => {
			state.loading = true;
			state.error = null;
		},
		removeSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.removeTransactionData = action.payload;
		},
		removeFail: (state, action) => {
		state.loading = false;
			state.removeTransactionData = null;
			state.error = action.payload;
		},
	
	},
});

export const { removePending, removeSuccess, removeFail} =
removeTransactionSlice.actions;
export default removeTransactionSlice.reducer;