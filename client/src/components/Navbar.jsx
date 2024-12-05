import { useState } from "react";
import Sidebar from "./sidebar";
import { Link } from "react-router";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="flex h-16 justify-between lg:justify-between items-center px-5 lg:px-8 py-5 bg-black">
        <div
          className="flex cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <img
            alt="menu icon"
            width="19"
            height="19"
            src="https://portalis.ai/icons/hamburger.svg"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <a href="/">
            <img
              width="110"
              height="25"
              className="relative"
              src="https://portalis.ai/portalis-white.svg"
              style={{ color: "transparent" }}
            />
          </a>
        </div>
        <div className="hidden sm:flex">
          <Link to="/login">
            <button className="flex uppercase font-bold text-center items-center justify-center bg-white text-black text-[10px] leading-none tracking-[2.35px] px-5 py-[10px] rounded-3xl">
              <span>Login</span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 10 11"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="ml-2"
                alt="Go Arrow"
              >
                <g clipPath="url(#clip0_2080_1104)">
                  <path
                    d="M8.62208 9.90083L8.62208 1.64897L0.532606 1.64894"
                    stroke="#9183CA"
                    strokeWidth="1.36608"
                  ></path>
                  <rect
                    x="1.47559"
                    y="9.62427"
                    width="1.36496"
                    height="10.0621"
                    transform="rotate(-135 1.47559 9.62427)"
                    fill="#9183CA"
                  ></rect>
                </g>
              </svg>
            </button>
          </Link>
        </div>
      </nav>

      {sidebarOpen && <Sidebar setSidebarOpen={setSidebarOpen} />}
    </>
  );
};

export default Navbar;
