import { removeTransactionById } from "../../../api/coffeePurchaseApi";
import { removePending, removeSuccess, removeFail } from "../../slices/transactions/removeTransactionSlice";

import { toast } from 'react-toastify';



export const removeTransaction= (token,id) => async (dispatch) => {
    try {
      dispatch(removePending());
     console.log(token)

      const res = await removeTransactionById(token,id);
      console.log("res",res)
      dispatch(removeSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
      console.log("err",error)

        toast.error(`${error.message} `);
        return dispatch(removeFail(error.message));
      }
      toast.error(`${error.Error}`);
      console.log("errrr",error)

      return dispatch(removeFail(error.Error));
    }
  };