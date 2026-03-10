import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" text-gray-300 py-12">
      <div className="max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Clockly</h3>
            <p className="text-gray-400 text-sm">
              Building modern web solutions for a sustainable and inclusive
              world.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link to="" className="hover:text-white">
                <FaFacebookF />
              </Link>
              <Link to="" className="hover:text-white">
                <FaTwitter />
              </Link>
              <Link to="" className="hover:text-white">
                <FaInstagram />
              </Link>
              <Link to="" className="hover:text-white">
                <FaLinkedinIn />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                Email:{" "}
                <Link
                  to="mailto:filip.nikolov1010@gmail.com"
                  className="hover:text-white"
                >
                  filip.nikolov1010@gmail.com
                </Link>
              </li>

              <li>Address: 123 Street Name, City, Country</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-3">
              Subscribe to stay updated with our latest news.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 rounded-md text-gray-900 flex-1"
              />
            </form>
          </div>
        </div>

           <div className="pt-12 text-center mt-10 text-zinc-500 font-medium border-t border-orange-500 bg-black">
        <p>© 2026 Clockly Inc. Built for the modern workforce.</p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
