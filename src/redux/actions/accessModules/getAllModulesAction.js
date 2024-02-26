/* eslint-disable */
import { toast } from 'react-toastify';
import { getAllModules } from '../../../api/accessModulesApi';
import { fetchFail, fetchPending, fetchSuccess } from '../../slices/accessModules/getAllModulesSlice';


export const getModules = () => async (dispatch) => {
    try {
     
      dispatch(fetchPending());
      const res = await getAllModules();
      
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