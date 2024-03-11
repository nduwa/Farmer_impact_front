import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    updates:null,
	error: null,
	loading: false,
	
};
const updateTransactionSlice = createSlice({
	name: 'updateTransaction',
	initialState,
	reducers: {
        updatePending: (state) => {
			state.loading = true;
			state.error = null;
		},
		updateSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.updates = action.payload;
		},
		updateFail: (state, action) => {
		state.loading = false;
			state.updates= null;
			state.error = action.payload;
		},
	
	},
});

export const { updatePending, updateSuccess, updateFail} =
updateTransactionSlice.actions;
export default updateTransactionSlice.reducer;