import { GoogleIcon } from "../../../public/assets/svg/GoogleIcon";

const GoogleButton = ({ text }) => (
  <button
    type="button"
    className="flex items-center justify-center w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
  >
    <GoogleIcon />
    {text}
  </button>
);

export default GoogleButton;
