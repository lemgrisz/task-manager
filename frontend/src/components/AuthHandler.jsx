import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth, logout, setInitialized } from "../redux/authSlice";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

const AuthHandler = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");
    console.log(token, "token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken, "decoded token");
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          Cookies.remove("token");
          dispatch(logout());
        } else {
          dispatch(
            setAuth({
              user: {
                _id: decodedToken.id,
                name: decodedToken.name,
                email: decodedToken.email,
              },
              token,
            })
          );
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        dispatch(logout());
        Cookies.remove("token");
      }
    } else {
      dispatch(logout());
    }
    dispatch(setInitialized());
  }, [dispatch]);

  return null;
};

export default AuthHandler;
