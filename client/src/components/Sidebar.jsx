import { Link } from "react-router-dom";

const Sidebar = ({ setSidebarOpen }) => {
  return (
    <nav className="h-full fixed left-0 top-0 text-white [&amp;>*]:!bg-black opacity-95 w-[300px] z-50">
      <div className="h-full overflow-y-auto overflow-x-hidden rounded bg-gray-50 px-3 py-4 dark:bg-black">
        <div
          className="mt-1.5 ml-5 cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        >
          <img
            alt="close icon"
            width="19"
            height="19"
            src="https://portalis.ai/icons/close.svg"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="uppercase mt-28">
          <ul className="mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700 flex flex-col items-start justify-start text-left">
            <li>
              <Link
                className="flex items-center justify-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white font-bold text-[20px] tracking-[5px] leading-8 dark:hover:bg-black hover:opacity-70"
                to="/"
              >
                <span className="flex-1 whitespace-nowrap px-3">Home</span>
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center justify-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white font-bold text-[20px] tracking-[5px] leading-8 dark:hover:bg-black hover:opacity-70"
                to="/avatar"
              >
                <span className="flex-1 whitespace-nowrap px-3">Avatar</span>
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center justify-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white font-bold text-[20px] tracking-[5px] leading-8 dark:hover:bg-black hover:opacity-70"
                to="/upload-doc"
              >
                <span className="flex-1 whitespace-nowrap px-3">Documents</span>
              </Link>
            </li>
            <li>
              <span className="flex items-center justify-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white font-bold text-[20px] tracking-[5px] leading-8 dark:hover:bg-black cursor-default">
                <span className="flex-1 whitespace-nowrap px-3">
                  Who We Are ▾
                </span>
              </span>
            </li>
            <li>
              <Link
                className="flex items-center justify-center rounded-lg p-2 font-normal text-gray-900 hover:bg-gray-100 dark:text-white ml-10 text-[20px] tracking-[5px] leading-8 dark:hover:bg-black hover:opacity-70"
                to="/about"
              >
                <span className="flex-1 whitespace-nowrap px-3">About</span>
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center justify-center rounded-lg p-2 font-normal text-gray-900 hover:bg-gray-100 dark:text-white ml-10 text-[20px] tracking-[5px] leading-8 dark:hover:bg-black hover:opacity-70"
                to="/solutions"
              >
                <span className="flex-1 whitespace-nowrap px-3">Solutions</span>
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center justify-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white font-bold text-[20px] tracking-[5px] leading-8 dark:hover:bg-black hover:opacity-70"
                to="/pricing"
              >
                <span className="flex-1 whitespace-nowrap px-3">Pricing</span>
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center justify-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white font-bold text-[20px] tracking-[5px] leading-8 dark:hover:bg-black hover:opacity-70"
                to="/help"
              >
                <span className="flex-1 whitespace-nowrap px-3">Help</span>
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center justify-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white font-bold text-[20px] tracking-[5px] leading-8 dark:hover:bg-black hover:opacity-70"
                to="/contact"
              >
                <span className="flex-1 whitespace-nowrap px-3">Contact</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
