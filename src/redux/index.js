import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/userSlice";
import login from '../redux/slices/AuthSlice'
import users from '../redux/slices/UsersSlice'
import fetchTokenSlice from "./slices/fetchTokenSlice";
import updateUserSlice from "./slices/updateUserSlice";

import getSingleUserSlice from './slices/singleUserSlice'
import fetchAllModulesSlice from '../redux/slices/accessModules/getAllModulesSlice'
import logoutSlice from "./slices/logoutSlice";
import fetchAllStaffSlice from './slices/coffeePurchase/allTransactionSlice'
const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    login,
    users,
    fetchToken:fetchTokenSlice,
    updateUser:updateUserSlice,

    fetchSingleUser:getSingleUserSlice,
    fetchAllModules:fetchAllModulesSlice,
    logout:logoutSlice,
    fetchAllStaff:fetchAllStaffSlice
 
  },
});
export default store;
