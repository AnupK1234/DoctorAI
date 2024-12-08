import { createSlice } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

const userCookie = Cookie.get("userObject") ? JSON.parse(Cookie.get("userObject")) : null;

const initialState = {
  isLoggedIn: !!userCookie,
  user: userCookie,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
