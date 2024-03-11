/* eslint-disable */
import { toast } from 'react-toastify';
import { allUsers } from '../../../api/userApi';
import { allUsersFail, allUsersPending,allUsersSuccess } from '../../slices/user/allUsersSlice';

  export const fetchAllUsers = () => async (dispatch) => {
    try {
        dispatch(allUsersPending());
    
        const users = await allUsers(); 
        dispatch(allUsersSuccess(users));
      } catch (error) {
        dispatch(allUsersFail(error.message));
      }
    };

