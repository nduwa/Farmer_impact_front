import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    permissions:null,
	error: null,
	loading: false,
	
};
const addPermissionsSlice = createSlice({
	name: 'addPermissions',
	initialState,
	reducers: {
        permissionsPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		permissionsSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.permissions= action.payload;
		},
		permissionsFail: (state, action) => {
		state.loading = false;
			state.permissions= null;
			state.error = action.payload;
		},
	
	},
});

export const { permissionsPending, permissionsSuccess, permissionsFail} =
addPermissionsSlice.actions;
export default addPermissionsSlice.reducer;