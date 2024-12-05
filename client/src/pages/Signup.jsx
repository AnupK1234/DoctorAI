import { useState } from "react";
import FormInput from "../components/Inputs/FormInput";
import GoogleButton from "../components/Auth/GoogleButton";
import AuthLink from "../components/Auth/AuthLink";
import axios from "../utils/axiosInstance";
import {useNavigate} from "react-router"

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/signup", {
        email,
        password,
        name
      });

      //console.log("SignUp response : ", response);
      if(response.status == 201) navigate("/login");
      
    } catch (error) {
      // console.log("SignUp Error response : ", error);
      console.error("Error is : ",error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sign Up
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
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
            Sign Up
          </button>
          <GoogleButton text="Sign Up with Google" />
          <AuthLink
            text="Already a user?"
            linkText="Login here"
            link="/login"
          />
        </form>
      </div>
    </div>
  );
};

export default Signup;
