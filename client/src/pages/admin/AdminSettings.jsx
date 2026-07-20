import React from "react";
import { Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { assets } from "../../assets/assets";

const AdminSettings = () => {
  const { user } = useAuth();
  return (
    <div>
    
        {/* Header */}

        <div className="mb-10">
          <h1 className="flex items-center gap-2 text-xl md:text-2xl font-bold">
            <Settings className="w-5 h-5 md:w-7 md:h-7 text-primary" />
            Admin Settings
          </h1>

          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Manage your account, security and dashboard preferences.
          </p>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {/* Profile */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:bg-primary/15 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-primary/10">
              <h2 className="text-xl sm:text-2xl font-bold">👤 Profile</h2>

              <button className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
                Edit Profile
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user?.image || assets.profile}
                  alt={user?.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary shadow-2xl shadow-primary/30 transition-all duration-500 hover:scale-105"
                />

                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0f172a]" />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-wide">
                    {user?.name}
                  </h3>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <h3 className="font-medium text-gray-300 break-all">
                    {user?.email}
                  </h3>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <span className="px-4 py-1 rounded-full border border-primary/20 bg-primary/15 text-primary text-sm font-semibold">
                    Administrator
                  </span>

                  <span className="px-4 py-1 rounded-full border border-green-500/20 bg-green-500/15 text-green-400 text-sm font-semibold">
                    ● Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:bg-primary/15 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/10">
              <h2 className="text-xl sm:text-2xl font-bold">🔒 Security</h2>

              <span className="px-3 py-1 rounded-full border border-green-500/20 bg-green-500/15 text-green-400 text-xs font-medium">
                Protected
              </span>
            </div>

            <div className="space-y-5">
              {/* Change Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl bg-black/20 border border-white/5 p-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/20">
                <div>
                  <h3 className="font-semibold">Change Password</h3>
                  <p className="text-sm text-gray-400">
                    Update your admin account password.
                  </p>
                </div>

                <button className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
                  Change
                </button>
              </div>

              {/* Two Factor */}
              <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/20">
                <div>
                  <h3 className="font-semibold">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-400">
                    Add an extra layer of security.
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/15 text-yellow-400 text-xs font-medium">
                  Coming Soon
                </span>
              </div>

              {/* Active Sessions */}
              <div className="flex items-center justify-between rounded-xl bg-black/20 border border-white/5 p-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/20">
                <div>
                  <h3 className="font-semibold">Active Sessions</h3>
                  <p className="text-sm text-gray-400">
                    View devices currently logged in.
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full border border-green-500/20 bg-green-500/15 text-green-400 text-xs font-medium">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:bg-primary/15 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/10">
              <h2 className="text-xl sm:text-2xl font-bold">🎛 Dashboard Preferences</h2>

              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs">
                Preferences
              </span>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-black/20">
                <div>
                  <h3 className="font-semibold">Compact Dashboard</h3>
                  <p className="text-sm text-gray-400">
                    Display smaller dashboard cards.
                  </p>
                </div>

                <button className="w-12 h-7 rounded-full bg-gray-700 relative">
                  <div className="absolute left-1 top-1 w-5 h-5 rounded-full bg-white"></div>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-black/20">
                <div>
                  <h3 className="font-semibold">Auto Refresh</h3>
                  <p className="text-sm text-gray-400">
                    Refresh analytics automatically.
                  </p>
                </div>

                <button className="w-12 h-7 rounded-full bg-primary relative">
                  <div className="absolute right-1 top-1 w-5 h-5 rounded-full bg-white"></div>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-black/20">
                <div>
                  <h3 className="font-semibold">Default Analytics</h3>
                  <p className="text-sm text-gray-400">
                    Current default period.
                  </p>
                </div>

                <select className="bg-[#1f2937] border border-primary/20 rounded-xl px-3 py-2 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <option>7 Days</option>
                  <option>30 Days</option>
                  <option>1 Year</option>
                </select>
              </div>
            </div>
          </div>
          {/* Appearance */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:bg-primary/15 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">🎨 Appearance</h2>

            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-black/20">
                <div>
                  <h3 className="font-semibold">Theme</h3>
                  <p className="text-sm text-gray-400">
                    Choose your dashboard theme.
                  </p>
                </div>

                <select className="bg-[#1f2937] border border-primary/20 rounded-lg px-3 py-2">
                  <option>Dark</option>
                  <option disabled>Light (Coming Soon)</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-black/20">
                <div>
                  <h3 className="font-semibold">Accent Color</h3>
                  <p className="text-sm text-gray-400">
                    Primary color used across the dashboard.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-blue-500 opacity-40"></div>
                  <div className="w-6 h-6 rounded-full bg-green-500 opacity-40"></div>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:bg-primary/15 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 text-center sm:text-left">
              <img
                src={assets.logo}
                alt="EasyBook"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-3 shadow-xl"
              />

              <div>
                <h2 className="text-xl sm:text-2xl font-bold">EasyBook</h2>
                <p className="text-gray-400">Movie Ticket Booking Platform</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <div className="bg-black/20 border border-white/5 rounded-xl p-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/20">
                <p className="text-gray-400 text-sm">Version</p>
                <h3 className="font-semibold mt-1">v1.0.0</h3>
              </div>

              <div className="bg-black/20 border border-white/5 rounded-xl p-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/20">
                <p className="text-gray-400 text-sm">Environment</p>
                <h3 className="text-green-400 font-semibold mt-1">
                  Production
                </h3>
              </div>

              <div className="bg-black/20 border border-white/5 rounded-xl p-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/20">
                <p className="text-gray-400 text-sm">Database</p>
                <h3 className="font-semibold mt-1">MongoDB Atlas</h3>
              </div>

              <div className="bg-black/20 border border-white/5 rounded-xl p-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/20">
                <p className="text-gray-400 text-sm">Backend</p>
                <h3 className="text-green-400 font-semibold mt-1">Connected</h3>
              </div>

              <div className="bg-black/20 border border-white/5 rounded-xl p-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/20">
                <p className="text-gray-400 text-sm">Developer</p>
                <h3 className="font-semibold mt-1">Ankush Yadav</h3>
              </div>

              <div className="bg-black/20 border border-white/5 rounded-xl p-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/20">
                <p className="text-gray-400 text-sm">Last Updated</p>
                <h3 className="font-semibold mt-1">July 2026</h3>
              </div>
            </div>

            <div className="mt-6 border-t border-primary/10 pt-5">
              <p className="text-gray-400 text-sm">
                EasyBook is built using React, Node.js, Express, MongoDB and
                Tailwind CSS to provide a modern movie ticket booking
                experience.
              </p>
            </div>
          </div>

          {/* danger zone */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 transition-all duration-300 hover:border-primary/40 hover:bg-primary/15 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
            <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-3">
              ⚠ Danger Zone
            </h2>

            <p className="text-gray-400 mb-6">
              These actions are irreversible. Please proceed carefully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 text-white transition-all duration-300 hover:bg-red-500 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30">
                Clear Cache
              </button>
              <button className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 text-white transition-all duration-300 hover:bg-red-500 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30">
                Reset Dashboard
              </button>
            </div>
          </div>
        </div>
      
    </div>
  );
};

export default AdminSettings;
