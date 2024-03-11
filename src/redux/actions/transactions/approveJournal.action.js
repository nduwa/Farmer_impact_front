import { approveJournal } from "../../../api/coffeePurchaseApi";
import { approveFail, approvePending, approveSuccess } from "../../slices/transactions/approveJournalSlice";


import { toast } from 'react-toastify';



export const approveJoulnal= (token,id) => async (dispatch) => {
    try {
      dispatch(approvePending());
     console.log(token)

      const res = await approveJournal(token,id);
      console.log("res",res)
      dispatch(approveSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
      console.log("err",error)

        toast.error(`${error.message} `);
        return dispatch(approveFail(error.message));
      }
      toast.error(`${error.Error}`);
      console.log("errrr",error)

      return dispatch(approveFail(error.Error));
    }
  };