/* eslint-disable */
import { toast } from 'react-toastify';
import { Userlogin } from '../../api/userApi';
import { loginPending, loginFail, loginSuccess } from '../slices/AuthSlice';

export const login = (userData) => async (dispatch) => {
  try {
    dispatch(loginPending());
    const res = await Userlogin(userData);
    
    if (res.token) {
      // Store token and user data in localStorage
      localStorage.setItem('token', res.token);
      
      dispatch(loginSuccess(res));
      toast.success(res.message);
      
      return res; // Return the response after success
    } else {
      toast.error('Invalid Credentials');
      return dispatch(loginFail('Invalid Credentials.'));
    }
  } catch (error) {
    console.log('error', error);
    toast.error(error.message || 'Invalid Credentials');
    return dispatch(loginFail('Invalid Credentials.'));
  }
};
