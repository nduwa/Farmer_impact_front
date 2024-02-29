/* eslint-disable */
import { toast } from 'react-toastify';
import { allStaff, allTransactions, allTransactionsByJournalId } from '../../../api/coffeePurchaseApi';
import { fetchFail, fetchPending, fetchSuccess, journalFail, journalPending, journalSuccess, transactionsFail, transactionsPending, transactionsSuccess } from '../../slices/coffeePurchase/allTransactionSlice';


export const fetchAllStaff = () => async (dispatch) => {
    try {
     
      dispatch(fetchPending());
      const res = await allStaff();
      
      dispatch(fetchSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
        toast.error(`${error.message} `);
        return dispatch(fetchFail(error.message));
      }
      toast.error(`${error.Error}`);
      return dispatch(fetchFail(error.Error));
    }
  };


  export const fetchAllTransactions = (token) => async (dispatch) => {
    try {
     
      dispatch(transactionsPending());
      const res = await allTransactions(token);
      
      dispatch(transactionsSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
        toast.error(`${error.message} `);
        return dispatch(transactionsFail(error.message));
      }
      toast.error(`${error.Error}`);
      return dispatch(transactionsFail(error.Error));
    }
  };


  export const fetchAllTransactionsByJournal= (token,journalId) => async (dispatch) => {
    try {
     
      dispatch(journalPending());
      const res = await allTransactionsByJournalId(token,journalId);
      console.log("res",res)
      dispatch(journalSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
      console.log("err",error)

        toast.error(`${error.message} `);
        return dispatch(journalFail(error.message));
      }
      toast.error(`${error.Error}`);
      console.log("errrr",error)

      return dispatch(journalFail(error.Error));
    }
  };