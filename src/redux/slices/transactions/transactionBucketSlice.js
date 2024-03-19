import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    bucket:null,
	error: null,
	loading: false,
	
};
const addBucketSlice = createSlice({
	name: 'transactionBucket',
	initialState,
	reducers: {
        bucketPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		bucketSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.bucket = action.payload;
		},
		bucketFail: (state, action) => {
		state.loading = false;
			state.bucket= null;
			state.error = action.payload;
		},
	
	},
});

export const { bucketPending, bucketSuccess, bucketFail} =
addBucketSlice.actions;
export default addBucketSlice.reducer;