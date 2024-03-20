
import { bucketsFail, bucketsPending, bucketsSuccess } from "../../slices/transactions/allBucketsSlice";
import { allBuckets } from "../../../api/coffeePurchaseApi";
export const fetchAllBuckets = () => async (dispatch) => {
    try {
     
      dispatch(bucketsPending());
      const res = await allBuckets();
      
      dispatch(bucketsSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
        toast.error(`${error.message} `);
        return dispatch(bucketsFail(error.message));
      }
      toast.error(`${error.Error}`);
      return dispatch(bucketsFail(error.Error));
    }
  };