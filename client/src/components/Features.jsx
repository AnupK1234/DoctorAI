const Features = () => {
  return (
    <div className="bg-gray-100 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
        {/* Feature 1 */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <img src="/upload.png" alt="upload" className="h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">Upload Documents</h3>
          <p className="text-gray-600">
            Securely upload your medical records for instant analysis.
          </p>
        </div>
        {/* Feature 2 */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <img src="/consulting.png" alt="consultation" className="h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">AI Consultation</h3>
          <p className="text-gray-600">
            Get instant medical advice with our AI-powered doctor.
          </p>
        </div>
        {/* Feature 3 */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
            <img src="/insight.png" alt="consultation" className="h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">Health Insights</h3>
          <p className="text-gray-600">
            Receive detailed and actionable health insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
