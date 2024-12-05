const AuthLink = ({ text, linkText, link }) => (
  <div className="text-center mt-4">
    <p className="text-sm text-gray-700">
      {text}{" "}
      <a href={link} className="text-blue-600 hover:underline">
        {linkText}
      </a>
    </p>
  </div>
);

export default AuthLink;
