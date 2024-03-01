/* eslint-disable */
import { toast } from 'react-toastify';
import { getUser } from '../../../api/userApi';
import { fetchFail, fetchPending,fetchSuccess } from '../../slices/user/singleUserSlice';




export const getSingleUserById = (userId) => async (dispatch) => {
    try {
      dispatch(fetchPending());
      const res = await getUser(userId);
      console.log("Update successful:", res);
      dispatch(fetchSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      console.error("Update failed:", error);
      if (error) {
        toast.error(`${error.message} `);
        return dispatch(fetchFail(error.message));
      }
      toast.error(`${error.Error}`);
      return dispatch(fetchFail(error.Error));
    }
  };