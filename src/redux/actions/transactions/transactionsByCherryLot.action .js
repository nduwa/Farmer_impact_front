import { allJournalsByCherryLotId, allTransactionsByJournalId } from "../../../api/coffeePurchaseApi";
import { toast } from 'react-toastify';
import { transactionsPending, transactionsSuccess, transactionsFail } from "../../slices/transactions/transactionByCherryLotSlice";


export const fetchAllTransactionsByCherryLot= (token,cherryLotId) => async (dispatch) => {
    try {
     
      dispatch(transactionsPending());
      const res = await allJournalsByCherryLotId(token,cherryLotId);
      console.log("res",res)
      dispatch(transactionsSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
      console.log("err",error)

        toast.error(`${error.message} `);
        return dispatch(transactionsFail(error.message));
      }
      toast.error(`${error.Error}`);
      console.log("errrr",error)

      return dispatch(transactionsFail(error.Error));
    }
  };
