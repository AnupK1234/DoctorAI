import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slice/userSlice";
import axios from "../utils/axiosInstance";

const useAuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/validate-token", {
          withCredentials: true,
        });
        dispatch(loginSuccess(response.data.user));
      } catch (error) {
        // console.log(
        //   "No valid session found, user not logged in",
        //   error.message
        // );
      }
    };

    checkAuth();
  }, [dispatch]);
};

export default useAuthCheck;
