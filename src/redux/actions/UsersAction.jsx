/* eslint-disable */
import { toast } from 'react-toastify';
import { allUsers } from '../../api/userApi';
import { allUsersPending, allUsersSuccess, allUsersFail } from '../slices/UsersSlice';


  export const fetchAllUsers = () => async (dispatch) => {
    try {
        dispatch(allUsersPending());
    
        const users = await allUsers(); 
        dispatch(allUsersSuccess(users));
      } catch (error) {
        dispatch(allUsersFail(error.message));
      }
    };

