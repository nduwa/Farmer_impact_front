

import { dryWeighting } from "../../../api/coffeePurchaseApi";
import { weightingFail,weightingPending,weightingSuccess } from "../../slices/transactions/dryWeightingSlice";
export const fetchAllDryWeighting = () => async (dispatch) => {
    try {
     
      dispatch(weightingPending());
      const res = await dryWeighting();
      
      dispatch(weightingSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
        toast.error(`${error.message} `);
        return dispatch(weightingFail(error.message));
      }
      toast.error(`${error.Error}`);
      return dispatch(weightingFail(error.Error));
    }
  };