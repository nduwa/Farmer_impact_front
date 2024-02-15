import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/userSlice";
import login from '../redux/slices/AuthSlice'

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    login
  },
});
export default store;
