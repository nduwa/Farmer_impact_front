import { signOut } from "../slices/logoutSlice";

export const signOutUser = () => (dispatch) => {
    dispatch(signOut());
  };