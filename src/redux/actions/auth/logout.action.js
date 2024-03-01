import { signOut } from "../../slices/auth/logoutSlice";

export const signOutUser = () => (dispatch) => {
    dispatch(signOut());
  };