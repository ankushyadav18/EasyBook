import React, { useState } from "react";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  MenuIcon,
  SearchIcon,
  TicketPlus,
  XIcon,
  User,
  LogOut,
  Heart,
  Shield,
  Settings,
} from "lucide-react";
import Login from "./Login";
import { useAuth } from "../context/AuthContext";
import SearchModal from "./SearchModal";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();
  const { showLogin, setShowLogin } = useAppContext();

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/");
  };

  const isHomePage = location.pathname === "/";

  return (
    <>
      {showLogin && <Login setShowLogin={setShowLogin} />}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}

      <div className="fixed top-0 left-0 z-50 w-full h-30 flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
        {/* <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-4 border-b border-gray-600 dark:border-white/10 bg-black/40 backdrop-blur-2xl"> */}
        {/* <div
        className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 transition-all duration-300 ${
          isHomePage
            ? "bg-transparent"
            : "bg-black/50 backdrop-blur-2xl border-b border-gray-600 dark:border-white/10"
        }`}
      > */}
        {/* Logo */}
        <Link
          to="/"
          className="max-md:flex-1"
          onClick={() => {
            setIsOpen(false);
            scrollTo(0, 0);
          }}
        >
          <img
            src={logo}
            alt="logo"
            className="w-28 sm:w-32 md:w-40 transition duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop + Mobile Menu */}
        <div
          className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-5 md:px-6 py-3 max-md:h-screen md:rounded-full text-black dark:text-white backdrop-blur-xl bg-black/70 md:bg-white/5 md:border md:border-gray-600 dark:border-white/10 shadow-lg shadow-black/30 overflow-hidden transition-all duration-300 ${
            isOpen ? "max-md:w-full text-white" : "max-md:w-0"
          }`}
        >
          <XIcon
            className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold bg-primary/10 px-4 py-2 rounded-full"
                : "px-3 py-2 rounded-full hover:bg-white/10 hover:text-primary transition-all duration-300"
            }
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
          >
            Home
          </NavLink>

          <NavLink
            to="/movies"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold bg-primary/10 px-4 py-2 rounded-full"
                : "px-3 py-2 rounded-full hover:bg-white/10 hover:text-primary transition-all duration-300"
            }
            onClick={() => {
              scrollTo(0, 0);
              setIsOpen(false);
            }}
          >
            Movies
          </NavLink>

          <NavLink
            to="/my-bookings"
            onClick={(e) => {
              setIsOpen(false);

              if (!user) {
                e.preventDefault(); // Stop navigation
                setShowLogin(true);
              }
            }}
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold bg-primary/10 px-4 py-2 rounded-full"
                : "px-3 py-2 rounded-full hover:bg-white/10 hover:text-primary transition-all duration-300"
            }
          >
            My Bookings
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={(e) => {
              setIsOpen(false);

              if (!user) {
                e.preventDefault(); // Stop navigation
                setShowLogin(true);
              }
            }}
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold bg-primary/10 px-4 py-2 rounded-full"
                : "px-3 py-2 rounded-full hover:bg-white/10 hover:text-primary transition-all duration-300"
            }
          >
            Favorites
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6 relative">
          <SearchIcon
            onClick={() => setShowSearch(true)}
            className="hidden md:block w-5 h-5 cursor-pointer hover:text-primary hover:scale-110 transition-all duration-300"
          />

          {!user ? (
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2.5 bg-primary rounded-full font-semibold hover:scale-105 hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 cursor-pointer"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 bg-white/5 border border-gray-600 dark:border-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10 hover:border-primary/40 transition"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="hidden md:block">{user.name}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl bg-black/80 backdrop-blur-xl border border-gray-600 dark:border-white/10 shadow-xl overflow-hidden">
                  <div className="px-4 py-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-gray-900 dark:text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                  >
                    <User size={18} />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/favorites");
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                  >
                    <Heart size={18} />
                    Favorites
                  </button>
                  <button
                    onClick={() => {
                      navigate("/my-bookings");
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                  >
                    <TicketPlus size={18} />
                    My Bookings
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                  >
                    <Settings size={18} />
                    Settings
                  </button>

                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition"
                    >
                      <Shield size={18} />
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-600 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <MenuIcon
          className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ duration: 0.25 }}
              className="w-[90%] max-w-md rounded-3xl border border-gray-600 dark:border-white/10 bg-[#111827] p-8 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-5xl mb-5">🚪</div>

                <h2 className="text-2xl font-bold">Logout Account?</h2>

                <p className="mt-4 text-gray-600 dark:text-gray-400 leading-7">
                  Are you sure you want to logout?
                  <br />
                  You'll need to login again.
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-xl border border-gray-600 dark:border-white/10 bg-white/5 py-3 hover:bg-white/10 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setShowLogoutModal(false);
                  }}
                  className="flex-1 rounded-xl bg-red-600 py-3 hover:bg-red-500 transition"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
