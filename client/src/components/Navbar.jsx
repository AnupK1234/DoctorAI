import Cookie from "js-cookie";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import ArrowUp from "../../public/assets/svg/ArrowUp";
import { logout } from "../redux/slice/userSlice";
import { svgBasePath } from "../utils/imgConfig";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.user);

  const handleLogout = async () => {
    Cookie.remove("token");
    Cookie.remove("userObject");
    dispatch(logout());
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className="flex h-16 justify-between lg:justify-between items-center px-5 lg:px-8 py-5 bg-black">
        {/* Hamburger Menu */}
        <div
          className="flex cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <img
            alt="menu icon"
            width="19"
            height="19"
            src={`${svgBasePath}/hamburger.svg`}
            style={{ color: "transparent" }}
          />
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-white text-3xl font-bold">DoctorAI</h1>
        </div>

        {/* Login Button or User Avatar */}
        <div className="hidden sm:flex relative">
          {!isLoggedIn ? (
            <Link to="/login">
              <button className="flex uppercase font-bold text-center items-center justify-center bg-white text-black text-[10px] leading-none tracking-[2.35px] px-5 py-[10px] rounded-3xl">
                <span>Login</span>
                <ArrowUp />
              </button>
            </Link>
          ) : (
            <div
              className="relative flex items-center cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={user?.avatar || "https://avatar.iran.liara.run/public/boy"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-48 w-48 bg-gray-950 text-white rounded-lg shadow-lg py-2 border border-gray-500">
                  <Link
                    to="/account"
                    className="block px-4 py-2 hover:bg-gray-800"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-800"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-left w-full hover:bg-gray-800 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {sidebarOpen && <Sidebar setSidebarOpen={setSidebarOpen} />}
    </>
  );
};

export default Navbar;
