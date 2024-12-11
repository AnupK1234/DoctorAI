import { useState } from "react";
import { useNavigate } from "react-router";
import AuthLink from "../components/Auth/AuthLink";
import FormInput from "../components/Inputs/FormInput";
import axios from "../utils/axiosInstance";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const referral = localStorage.getItem("ref") || "";
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
        
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be 8-20 characters long and include at least one letter, one number, and one special character"
      );
      return;
    }

    try {
      const response = await axios.post("/auth/signup", {
        email,
        password,
        name,
        referral,
      });
      if (response.status == 201) navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(
          "Password must be 8-20 characters long and include at least one letter, one number, and one special character"
        );
      } else {
        console.error(error);
      }
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
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white rounded-lg py-3 font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
          >
            Sign Up
          </button>
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
