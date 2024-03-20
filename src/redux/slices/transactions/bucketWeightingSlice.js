import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    weight:null,
	error: null,
	loading: false,
	
};
console.log(initialState)
const bucketWeightingSlice = createSlice({
	name: 'bucketWeighting',
	initialState,
	reducers: {
        weightPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		weightSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.weight = action.payload;
		},
		weightFail: (state, action) => {
		state.loading = false;
			state.weight= null;
			state.error = action.payload;
		},
	
	},
});

export const { weightPending, weightSuccess, weightFail} =
bucketWeightingSlice.actions;
export default bucketWeightingSlice.reducer;