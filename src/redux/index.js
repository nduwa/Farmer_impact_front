import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/userSlice";
import login from '../redux/slices/AuthSlice'
import users from '../redux/slices/UsersSlice'

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    login,
    users
  },
});
export default store;
