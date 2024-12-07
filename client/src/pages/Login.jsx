import { useState } from "react";
import AuthLink from "../components/Auth/AuthLink";
import GoogleButton from "../components/Auth/GoogleButton";
import FormInput from "../components/Inputs/FormInput";
import axios from "../utils/axiosInstance";
import { loginSuccess } from "../redux/slice/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });
      const userData = response.data.user;
      dispatch(loginSuccess(userData));
      if(response.status == 200) navigate("/");
    } catch (error) {
      // console.log("Login Error response : ", error);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <FormInput
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white rounded-lg py-3 font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
          >
            Login
          </button>
          <AuthLink
            text="New to the platform?"
            linkText="Register here"
            link="/signup"
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
