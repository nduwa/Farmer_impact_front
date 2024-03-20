import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    generalHarvest:null,
	error: null,
	loading: false,
};
const fetchAllGeneralHarvestSlice = createSlice({
	name: 'fetchAllGeneralHarvest',
	initialState,
	reducers: {
        generalHarvestPending: (state) => {
			state.loading = true;
			state.error = null;
		},
		generalHarvestSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.generalHarvest = action.payload;
		},
		generalHarvestFail: (state, action) => {
		state.loading = false;
			state.generalHarvest = null;
			state.error = action.payload;
		},
	
	},
});

export const { generalHarvestPending, generalHarvestSuccess, generalHarvestFail} =
fetchAllGeneralHarvestSlice.actions;
export default fetchAllGeneralHarvestSlice.reducer;