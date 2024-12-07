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
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/doctor-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--medical-healthcare-health-avatar-pack-people-illustrations-4715129.png"
              className="h-[25rem]"
            />
          </div>
        </div>
        <div className="bg-white p-10 text-black">
          <h2 className="text-2xl font-bold mb-6 text-center">
            What Clients Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-lg">
                "I was initially skeptical about using an AI-powered doctor
                website, but I was pleasantly surprised. The AI accurately
                diagnosed my symptoms and provided clear treatment
                recommendations. It saved me time and worry, and I'm grateful
                for the convenience."
              </p>
              <p className="text-sm mt-4">- Client A</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-lg">
                "The AI doctor website offered a truly personalized experience.
                It asked detailed questions about my medical history and
                lifestyle to provide tailored advice. The follow-up support and
                reminders were also helpful in managing my health condition."
              </p>
              <p className="text-sm mt-4">- Client B</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-lg">
                "As someone with a busy schedule, I found the AI doctor website
                to be a lifesaver. I could access medical advice anytime,
                anywhere, without having to wait for appointments or visit a
                clinic. The affordable fees made it a great option for regular
                health check-ups."
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
