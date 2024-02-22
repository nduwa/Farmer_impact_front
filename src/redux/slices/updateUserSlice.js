import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	upUser: null,
	error: null,
	loading: false,
	
};
const updateUserSlice = createSlice({
	name: 'updateUser',
	initialState,
	reducers: {
		updatePending: (state) => {
			state.loading = true;
			state.error = null;
		},
		updateSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.upUser = action.payload;
		},
		updateFail: (state, action) => {
			state.loading = false;
			state.upUser = null;
			state.error = action.payload;
		},
	
	},
});

export const { updatePending, updateSuccess, updateFail} =
updateUserSlice.actions;
export default updateUserSlice.reducer;