import { useState } from "react";
import FormInput from "../components/Inputs/FormInput";
import GoogleButton from "../components/Auth/GoogleButton";
import AuthLink from "../components/Auth/AuthLink";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <GoogleButton text="Login with Google" />
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
