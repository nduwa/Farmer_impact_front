/* eslint-disable */
import { toast } from 'react-toastify';
import { allStaff } from '../../../api/coffeePurchaseApi';
import { fetchFail, fetchPending, fetchSuccess } from '../../slices/coffeePurchase/allTransactionSlice';


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