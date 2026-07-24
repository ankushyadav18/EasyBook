import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import { Home, User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ onLogoutClick }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { user } = useAuth();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="sticky top-0 z-50 bg-[#111827]/80 backdrop-blur-2xl border-b border-primary/20 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="h-14 md:h-20 px-4 md:px-8 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3 md:gap-5">
          <img
            src={logo}
            alt="EasyBook"
            className="w-18 sm:w-24 md:w-30 h-auto"
          />

          <div className="hidden md:block">
            <h2 className="text-lg font-bold">Admin Dashboard</h2>

            <p className="text-xs text-gray-600 dark:text-gray-400">EasyBook Management Panel</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Mobile Profile */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="md:hidden w-10 h-10 rounded-full bg-primary text-gray-900 dark:text-white font-semibold flex items-center justify-center shadow-lg"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-primary/20 bg-[#111827] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-4 border-b border-primary/10">
                  <h3 className="font-semibold">{user?.name}</h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>

                <button
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-primary/10 transition"
                  onClick={() => navigate("/profile")}
                >
                  <User size={18} />
                  Profile
                </button>

                <button
                  onClick={() => {
                    setOpenMenu(false);
                    navigate("/admin/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition cursor-pointer"
                >
                  <Settings size={18} />
                  Settings
                </button>

                <button
                  onClick={() => {
                    setOpenMenu(false);
                    onLogoutClick();
                  }}
                  className="w-full flex items-center gap-3 px-5 py-3 text-red-400 cursor-pointer hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Desktop Profile */}
          <div className="relative">
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className="hidden md:flex items-center gap-3 rounded-full border border-primary/20 bg-white/5 backdrop-blur-xl px-2 py-2 pr-5 cursor-pointer hover:bg-primary/10 transition"
            >
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center font-bold text-gray-900 dark:text-white shadow-lg">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>

              <div className="text-left">
                <p className="font-semibold leading-none">{user?.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {user?.role === "admin" ? "Administrator" : "Member"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
