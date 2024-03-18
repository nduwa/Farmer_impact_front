import { configureStore } from "@reduxjs/toolkit";
import login from "../redux/slices/auth/loginSlice";
import users from "../redux/slices/user/allUsersSlice";
import fetchTokenSlice from "../redux/slices/auth/fetchTokenSlice";
import updateUserSlice from "../redux/slices/user/updateUserSlice";
import getSingleUserSlice from "../redux/slices/user/singleUserSlice";
import fetchAllModulesSlice from "../redux/slices/accessModules/getAllModulesSlice";
import logoutSlice from "../redux/slices/auth/logoutSlice";
import fetchAllStaffSlice from "./slices/staff/fetchAllStaffSlice";
import allTransactionsSlice from "./slices/transactions/allTransactionsSlice";
import removeTransactionSlice from "./slices/transactions/removeTransactionSlice";
import transactionByJournalSlice from "./slices/transactions/transactionByJournalSlice";
import updateTransactionSlice from "./slices/transactions/updateTransaction";
import commissionPriceSlice from "./slices/transactions/addCommisionPrice";
import commissionFeesSlice from "./slices/transactions/addCommissionFees";
import commissionSlice from "./slices/transactions/addCommisionPrice";
import approveJournalSlice from "./slices/transactions/approveJournalSlice";
import allStationSlice from "./slices/station/allStationsSlice";
import journalsByCherryLotSlice from "./slices/transactions/journalsByCherryLotSlice";
import addPermissionsSlice from "./slices/accessModules/addPermissionsSlice";
import transactionByCherryLotSlice from "./slices/transactions/transactionByCherryLotSlice";
const store = configureStore({
  reducer: {
    login,
    users,
    fetchToken: fetchTokenSlice,
    updateUser: updateUserSlice,
    fetchSingleUser: getSingleUserSlice,
    fetchAllModules: fetchAllModulesSlice,
    logout: logoutSlice,
    fetchAllStaff: fetchAllStaffSlice,
    fetchAllTransactions: allTransactionsSlice,
    removeTransaction: removeTransactionSlice,
    fetchAllTransactionsByJournal: transactionByJournalSlice,
    updateTransaction: updateTransactionSlice,
    commission: commissionSlice,
    addCommissionPrice: commissionPriceSlice,
    commissionFees: commissionFeesSlice,
    approveJournal: approveJournalSlice,
    fetchAllStations: allStationSlice,
    fetchAllJournalsByCherryLotId: journalsByCherryLotSlice,
    addPermissions:addPermissionsSlice,
    fetchAllTransactionsByCherryLot: transactionByCherryLotSlice,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
export default store;
