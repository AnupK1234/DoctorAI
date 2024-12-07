const About = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-blue-50">
        <div className="max-w-md text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-5xl font-extrabold mb-6 text-blue-600">
            About Us
          </h1>
          <p className="text-lg">
            We are dedicated to revolutionizing healthcare with cutting-edge AI
            technology. Our mission is to make healthcare accessible, efficient,
            and personalized for everyone.
          </p>
        </div>
        <div>
          <img
            src="https://img.freepik.com/premium-vector/vector-illustration-medical-team-hospital-staff-doctors-nurse_549515-489.jpg"
            alt="Our Team"
            className="h-72 rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-10 px-10">
        <h2 className="text-3xl font-bold text-center mb-6">Our Mission</h2>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
          At <span className="font-bold">AI Doctor</span>, we aim to empower
          individuals with tools that provide instant access to healthcare
          solutions. From AI-powered diagnosis to real-time health insights, we
          strive to improve lives through innovation and technology.
        </p>
      </div>

      {/* Our Values Section */}
      <div className="bg-gray-100 py-10 px-10">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-heart text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Compassion</h3>
            <p className="text-gray-600">
              We put people first and ensure care and support in every step.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-lightbulb text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Innovation</h3>
            <p className="text-gray-600">
              Embracing cutting-edge technology to redefine healthcare.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Collaboration</h3>
            <p className="text-gray-600">
              Working together with experts to deliver better outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
