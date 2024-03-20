import { transactionBucket } from "../../../api/coffeePurchaseApi";
import { toast } from 'react-toastify';
import { bucketFail, bucketPending, bucketSuccess } from "../../slices/transactions/transactionBucketSlice";

export const addTransactionBucket= (token,data) => async (dispatch) => {
    try {
      dispatch(bucketPending());
     console.log(token)

      const res = await transactionBucket(token,data);
      console.log("res",res)
      dispatch(bucketSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
      console.log("err",error)

        toast.error(`${error.message} `);
        return dispatch(bucketFail(error.message));
      }
      toast.error(`${error.Error}`);
      console.log("errrr",error)

      return dispatch(bucketFail(error.Error));
    }
  };