import {toast} from 'react-toastify'
import { transactionsPending, transactionsSuccess,transactionsFail } from '../../slices/transactions/allTransactionsSlice'
import { allTransactions } from '../../../api/coffeePurchaseApi';


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