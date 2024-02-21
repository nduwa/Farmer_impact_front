import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	users: [],
	error: null,
	loading: false,
	
};
const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		allUsersPending: (state) => {
			state.loading = true;	
		},
		allUsersSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.users = action.payload;
		},
		allUsersFail: (state, action) => {
			state.loading = false;
			state.users = [];
			state.error = action.payload;
		},
	},
});
export const { allUsersPending, allUsersSuccess, allUsersFail } =
	usersSlice.actions;
export default usersSlice.reducer;


