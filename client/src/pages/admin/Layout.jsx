import React, { useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Outlet } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Layout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
const { logout } = useAuth();
const handleLogout = () => {
  logout();
  navigate("/");
};
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <AdminNavbar onLogoutClick={() => setShowLogoutModal(true)} />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 py-6 px-6 md:px-10 h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </main>
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
              className="w-[90%] max-w-md rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-5xl mb-5">🚪</div>

                <h2 className="text-2xl font-bold">Logout Account?</h2>

                <p className="mt-4 text-gray-400 leading-7">
                  Are you sure you want to logout?
                  <br />
                  You'll need to login again.
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 hover:bg-white/10 transition"
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
    </div>
  );
};

export default Layout;