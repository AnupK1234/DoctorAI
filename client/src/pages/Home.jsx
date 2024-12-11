import { Link } from "react-router";
import Features from "../components/Features";
import Testimonial from "../components/Testimonial";
import Avatar from "./Avatar";
import { useSearchParams } from "react-router";
import { useEffect } from "react";

const Home = () => {
  const [searchParams] = useSearchParams();
  const referredBy = searchParams.get("ref");

  useEffect(() => {
    if (referredBy && !localStorage.getItem("ref")) {
      localStorage.setItem("ref", referredBy);
    }
  }, []);

  return (
    <>
      <div className="bg-white text-black">
        {/* Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between p-10">
          <div className="lg:h-full lg:mb-52 lg:ml-14 max-w-md text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Your Health, <span className="text-blue-600">Reimagined</span>
            </h1>
            <p className="text-lg mb-6">
              Revolutionize your healthcare journey with our AI-powered medical
              assistant. Upload your medical records, chat with our AI avatar,
              and receive personalized health insights.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <Link
                to="/avatar"
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
              <button className="bg-transparent border-2 border-blue-600 text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-blue-600 hover:text-white transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="">
            <Avatar />
          </div>
        </div>

        {/* Why Choose Us Section */}
        <Features />

        {/* Testimonial Section */}
        <Testimonial />
      </div>
    </>
  );
};

export default Home;
