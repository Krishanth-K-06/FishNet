import React from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <nav className="flex items-center justify-between px-10 py-4 text-white bg-white/10 backdrop-blur-md">
        {/* Logo */}
        <div
          className="text-2xl font-bold tracking-wide flex items-center space-x-1 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-blue-400">⛛</span>
          <span>FISHNET</span>
        </div>

        {/* Navigation Items */}
        <ul className="flex items-center space-x-6 text-sm font-light list-none">
          {/* HOME */}
          <li>
            <button
              className="px-4 py-1 rounded-full bg-white/20 hover:bg-white/30 transition"
              onClick={() => navigate("/")}
            >
              HOME
            </button>
          </li>

          {/* SPECIES */}
          <li
            className="hover:text-blue-300 transition cursor-pointer"
            onClick={() => navigate("/fishmap")}
          >
            UPDATE
          </li>

          {/* MARKET Dropdown */}
          <li className="relative group cursor-pointer"
                      onClick={() => navigate("/visit")}
>
            <span>
              MARKET <span className="ml-1">▾</span>
            </span>
          </li>

          {/* LOGIN Dropdown */}
          <li className="relative group cursor-pointer">
            <span>
              LOGIN <span className="ml-1">▾</span>
            </span>
            <ul className="absolute hidden group-hover:flex flex-col bg-white text-black mt-2 rounded-md shadow-md p-2 w-32 z-50">
              <li
                className="hover:bg-gray-100 p-2 rounded cursor-pointer"
                onClick={() => navigate("/proe")}
              >
                User
              </li>
              <li
                className="hover:bg-gray-100 p-2 rounded cursor-pointer"
                onClick={() => navigate("/admin")}
              >
                Admin
              </li>
            </ul>
          </li>

          {/* PROFILE */}
          <li
            className="hover:text-blue-300 transition cursor-pointer"
            onClick={() => navigate("/proe")}
          >
            PROFILE
          </li>

          {/* Search Icon */}
          <li onClick={() => navigate("/search")}>
            <FaSearch className="text-white hover:text-blue-300 cursor-pointer" />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
