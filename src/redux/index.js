import { configureStore } from "@reduxjs/toolkit";
// import UserSlice from "./slices/userSlice";
import login from '../redux/slices/auth/loginSlice'
import users from '../redux/slices/user/allUsersSlice'
import fetchTokenSlice from "../redux/slices/auth/fetchTokenSlice";
import updateUserSlice from "../redux/slices/user/updateUserSlice";
import getSingleUserSlice from '../redux/slices/user/singleUserSlice'
import fetchAllModulesSlice from '../redux/slices/accessModules/getAllModulesSlice'
import logoutSlice from '../redux/slices/auth/logoutSlice'
import fetchAllStaffSlice from "./slices/staff/fetchAllStaffSlice";
import allTransactionsSlice from "./slices/transactions/allTransactionsSlice";
import removeTransactionSlice from "./slices/transactions/removeTransactionSlice";
import transactionByJournalSlice from "./slices/transactions/transactionByJournalSlice";
import updateTransactionSlice from "./slices/transactions/updateTransaction";
import commisionSlice from './slices/transactions/commission'
const store = configureStore({
  reducer: {
    // user: UserSlice.reducer,
    login,
    users,
    fetchToken:fetchTokenSlice,
    updateUser:updateUserSlice,
    fetchSingleUser:getSingleUserSlice,
    fetchAllModules:fetchAllModulesSlice,
    logout:logoutSlice,
    fetchAllStaff:fetchAllStaffSlice,
    fetchAllTransactions:allTransactionsSlice,
    removeTransaction:removeTransactionSlice,
    fetchAllTransactionsByJournal:transactionByJournalSlice,
    updateTransaction:updateTransactionSlice,
    commission:commisionSlice
    


 
  },
});
export default store;
