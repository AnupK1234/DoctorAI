import Features from "../components/Features";
import Testimonial from "../components/Testimonial";

const Home = () => {
  return (
    <>
      <div className="bg-white text-black">
        {/* Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between p-10">
          <div className="max-w-md text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Your Health, <span className="text-blue-600">Reimagined</span>
            </h1>
            <p className="text-lg mb-6">
              Revolutionize your healthcare journey with our AI-powered medical
              assistant. Upload your medical records, chat with our AI avatar,
              and receive personalized health insights.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition">
                Get Started
              </button>
              <button className="bg-transparent border-2 border-blue-600 text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-blue-600 hover:text-white transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="mb-10 md:mb-0">
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/doctor-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--medical-healthcare-health-avatar-pack-people-illustrations-4715129.png"
              className="h-[25rem] rounded-xl shadow-lg hover:scale-105 transition-transform"
              alt="AI Doctor Avatar"
            />
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
