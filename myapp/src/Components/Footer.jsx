import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub, FaDribbble } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">About</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Brand Center</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Help Center</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">Discord Server</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Licensing</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Download */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Download</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">iOS</a></li>
              <li><a href="#" className="hover:underline">Android</a></li>
              <li><a href="#" className="hover:underline">Windows</a></li>
              <li><a href="#" className="hover:underline">MacOS</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-10 pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2022 Flowbite™</p>
          <div className="flex space-x-5 mt-4 md:mt-0 text-gray-400">
            <a href="#"><FaFacebook className="hover:text-white" /></a>
            <a href="#"><FaTwitter className="hover:text-white" /></a>
            <a href="#"><FaInstagram className="hover:text-white" /></a>
            <a href="#"><FaGithub className="hover:text-white" /></a>
            <a href="#"><FaDribbble className="hover:text-white" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;