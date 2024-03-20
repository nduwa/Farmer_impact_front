import { bucketWeighting } from "../../../api/coffeePurchaseApi";
import { toast } from 'react-toastify';
import { weightFail, weightPending, weightSuccess } from "../../slices/transactions/bucketWeightingSlice";

export const addBucketweighting= (data) => async (dispatch) => {
    try {
      dispatch(weightPending());
    

      const res = await bucketWeighting(data);
      console.log("res",res)
      dispatch(weightSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
      console.log("err",error)

        toast.error(`${error.message} `);
        return dispatch(weightFail(error.message));
      }
      toast.error(`${error.Error}`);
      console.log("errrr",error)

      return dispatch(weightFail(error.Error));
    }
  };