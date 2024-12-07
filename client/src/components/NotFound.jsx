import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [seconds, navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-black">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Oops! Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-gray-700 font-medium mb-4">
          Redirecting to the homepage in{" "}
          <span className="font-bold">{seconds}</span> seconds...
        </p>
        <button
          className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={() => navigate("/")}
        >
          Go to Homepage Now
        </button>
      </div>
    </div>
  );
};

export default NotFound;
