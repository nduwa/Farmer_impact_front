import { updatePending, updateSuccess, updateFail } from "../../slices/transactions/updateTransaction";
import { updateTransactionById } from "../../../api/coffeePurchaseApi";
import { toast } from 'react-toastify';

export const updateTransaction= (token,id,data) => async (dispatch) => {
    try {
      dispatch(updatePending());
     console.log(token)

      const res = await updateTransactionById(token,id,data);
      console.log("res",res)
      dispatch(updateSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
      console.log("err",error)

        toast.error(`${error.message} `);
        return dispatch(updateFail(error.message));
      }
      toast.error(`${error.Error}`);
      console.log("errrr",error)

      return dispatch(updateFail(error.Error));
    }
  };