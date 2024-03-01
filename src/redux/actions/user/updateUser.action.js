/* eslint-disable */
import { toast } from 'react-toastify';
import { updateUser } from '../../../api/userApi';
import { updatePending, updateFail, updateSuccess } from '../../slices/user/updateUserSlice';



export const updateExistingUser = (id, data) => async (dispatch) => {
    try {
      // console.log("Updating user with ID:", id);
      dispatch(updatePending());
      const res = await updateUser(id, data);
      console.log("Update successful:", res);
      dispatch(updateSuccess(res));
      toast.success(res.message);
      return res;
    } catch (error) {
      console.error("Update failed:", error);
      if (error) {
        toast.error(`${error.message} `);
        return dispatch(updateFail(error.message));
      }
      toast.error(`${error.Error}`);
      return dispatch(updateFail(error.Error));
    }
  };