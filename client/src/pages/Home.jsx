import Navbar from "../components/Navbar";
const Home = () => {
  return (
    <>
      <div className="bg-black text-white">
        <div className="flex items-center justify-between p-10">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
            <p className="text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div>
            <video
              autoPlay
              loop
              playsInline
              muted
              className="rounded-lg w-[400px]"
            >
              <source
                src="https://portalis.ai/videos/Elena.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
        <div className="bg-white p-10 text-black">
          <h2 className="text-2xl font-bold mb-6 text-center">
            What Clients Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="text-sm mt-4">- Client A</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="text-sm mt-4">- Client B</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="text-sm mt-4">- Client C</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
