import logo from "../assets/logo.png";
import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mt-4 md:mt-6 overflow-hidden">
      <div className="px-4 md:px-16 lg:px-24 xl:px-40 py-4 md:py-16 bg-transparent border-t border-white/10 text-gray-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-10 border-b border-white/10 pb-10">
          <div className="flex flex-col items-center md:items-start md:flex-row md:gap-8 md:max-w-md">
            {/* Responsive logo */}
            <img
              src={logo}
              alt="EasyBook Logo"
              className="w-24 sm:w-40 md:w-44 lg:w-52 h-auto object-contain flex-shrink-0 mx-auto md:mx-0"
            />

            <div className="mt-1 md:mt-0 text-center md:text-left">
              <p className="text-sm text-gray-300 max-w-sm leading-7">
                EasyBook is a modern movie ticket booking platform that lets you
                discover movies, select your favorite seats, and book tickets
                securely with a fast and seamless experience.
              </p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <a
                  href="https://github.com/ankushyadav18"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-primary hover:border-primary hover:-translate-y-1 transition-all duration-300"
                >
                  <Github size={18} />
                </a>

                <a
                  href="https://www.linkedin.com/in/ankush-yadav-a71418330"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-primary hover:border-primary hover:-translate-y-1 transition-all duration-300"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-8 text-center sm:grid-cols-2 sm:text-left md:w-auto md:min-w-[420px] md:gap-12 lg:min-w-[520px] lg:gap-20">
            <div>
              <h2 className="mb-4 font-semibold text-white sm:mb-5">
                Company
              </h2>

              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-300 transition hover:text-white">
                    Home
                  </Link>
                </li>

                <li>
                  <Link to="/movies" className="text-gray-300 transition hover:text-white">
                    Movies
                  </Link>
                </li>

                <li>
                  <Link to="/favorites" className="text-gray-300 transition hover:text-white">
                    Favorites
                  </Link>
                </li>

                <li>
                  <Link to="/my-bookings" className="text-gray-300 transition hover:text-white">
                    My Bookings
                  </Link>
                </li>
              </ul>
            </div>

            <div className="min-w-0">
              <h2 className="mb-4 font-semibold text-white sm:mb-5">
                Contact
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex min-w-0 items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-primary/40 sm:justify-start">
                  <Phone size={18} className="shrink-0 text-primary" />
                  <p className="text-sm text-gray-300">+91 75700 18889</p>
                </div>

                <div className="flex min-w-0 items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-primary/40 sm:justify-start">
                  <Mail size={18} className="shrink-0 text-primary" />
                  <p className="min-w-0 break-all text-sm text-gray-300">
                    yadavankusho45@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs leading-6 text-gray-300 sm:text-sm">
          © {new Date().getFullYear()} EasyBook • Crafted with ❤️ by Ankush
          Yadav
        </div>
      </div>
    </footer>
  );
};

export default Footer;
