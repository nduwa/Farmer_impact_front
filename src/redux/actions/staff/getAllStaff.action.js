import { fetchPending,fetchFail,fetchSuccess } from "../../slices/staff/fetchAllStaffSlice";
import { allStaff } from "../../../api/coffeePurchaseApi";
export const fetchAllStaff = () => async (dispatch) => {
    try {
     
      dispatch(fetchPending());
      const res = await allStaff();
      
      dispatch(fetchSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      if (error) {
        toast.error(`${error.message} `);
        return dispatch(fetchFail(error.message));
      }
      toast.error(`${error.Error}`);
      return dispatch(fetchFail(error.Error));
    }
  };