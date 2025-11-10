import { FaBell } from "react-icons/fa";
import Logo from '../assets/logo.png';

export default function Navbar() {
  return (
    <nav className="bg-[#1e293b] px-6 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <div className="text-indigo-400 text-2xl font-bold">
            <img src={Logo} width={"55px"}/>
        </div>

        {/* Menu Links */}
        <div className="flex space-x-2 text-sm font-medium text-gray-300">
          {/* Active link */}
          <a
            href="#"
            className="bg-[#0f172a] text-white px-3 py-2 rounded-md transition-all"
          >
            Dashboard
          </a>

          {/* Other links */}
          <a
            href="#"
            className="px-3 py-2 rounded-md hover:bg-[#334155] hover:text-white transition-all"
          >
            Team
          </a>
          <a
            href="#"
            className="px-3 py-2 rounded-md hover:bg-[#334155] hover:text-white transition-all"
          >
            Projects
          </a>
          <a
            href="#"
            className="px-3 py-2 rounded-md hover:bg-[#334155] hover:text-white transition-all"
          >
            Calendar
          </a>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <FaBell className="text-gray-400 text-lg hover:text-white cursor-pointer transition" />
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="user avatar"
          className="w-8 h-8 rounded-full border border-gray-600"
        />
      </div>
    </nav>
  );
}
