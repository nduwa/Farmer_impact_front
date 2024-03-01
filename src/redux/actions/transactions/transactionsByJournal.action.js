import { journalPending, journalSuccess,journalFail } from "../../slices/transactions/transactionByJournalSlice";
import { allTransactionsByJournalId } from "../../../api/coffeePurchaseApi";
import { toast } from 'react-toastify';

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
