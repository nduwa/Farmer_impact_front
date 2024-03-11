import { commissionSuccess, commissionFail,commissionPending } from "../../slices/transactions/addCommissionFees";
import { addCommissionFees } from "../../../api/coffeePurchaseApi";
import { toast } from 'react-toastify';

export const CommisionFees= (token,data) => async (dispatch) => {
    try {
      dispatch(commissionPending());


      const res = await addCommissionFees(token,data);
      console.log("res",res)
      dispatch(commissionSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
      console.log("err",error)

        toast.error(`${error.message} `);
        console.log("errrrr", error.message)
        return dispatch(commissionFail(error.message));
      }
      toast.error(`${error.Error}`);
      console.log("errrr",error)

      return dispatch(commissionFail(error.Error));
     

    }
  };