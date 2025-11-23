import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    isInitialized: false,
  },
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isInitialized = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      Cookies.remove("token");
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
});

export const { setAuth, logout, setUser, setInitialized } = authSlice.actions;

export const login = (credentials) => async (dispatch) => {

  try {
    console.log("Login", credentials, "dispatcher called!");
    const { data } = await axios.post(`${`https://task-manager-be-seven.vercel.app`}/api/users/login`, credentials);
    const { _id, name, email, token } = data;
    if (data) {
      Cookies.set("token", token, { expires: 2 });

      dispatch(setAuth({ user: { _id, name, email }, token }));
      console.log("Login Successful!");
    }
  } catch (error) {
    console.error(error.response?.data?.message || "Authentication failed.");
    dispatch(logout());
  }
};

export default authSlice.reducer;
