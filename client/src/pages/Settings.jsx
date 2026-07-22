import { Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import profile from "../assets/profile.png";
import logo from "../assets/logo.png";
import react, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageBackground from "../components/PageBackground";

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [preferredSeat, setPreferredSeat] = useState("Middle");
  const [language, setLanguage] = useState("English");
  const [ticketReminder, setTicketReminder] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || profile);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");

    // First time user -> dark mode
    if (savedTheme === null) {
      return true;
    }

    return savedTheme === "true";
  });
  const navigate = useNavigate();

  const [emailNotification, setEmailNotification] = useState(
    localStorage.getItem("emailNotification") !== "false",
  );

  const [movieNotification, setMovieNotification] = useState(
    localStorage.getItem("movieNotification") !== "false",
  );

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await api.put("/auth/update", formData);

      if (data.success) {
        updateUser({
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
          role: data.user.role,
        });

        toast.success("Profile updated successfully");

        setShowEditProfile(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  const getPasswordStrength = () => {
    if (!newPassword) return null;

    if (newPassword.length < 6)
      return {
        text: "Weak",
        color: "text-red-400",
        bg: "bg-red-500",
        width: "w-1/3",
      };

    if (newPassword.length < 10)
      return {
        text: "Medium",
        color: "text-yellow-400",
        bg: "bg-yellow-500",
        width: "w-2/3",
      };

    return {
      text: "Strong",
      color: "text-green-400",
      bg: "bg-green-500",
      width: "w-full",
    };
  };

  const strength = getPasswordStrength();

  const handlePasswordChange = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return toast.error("Please fill all fields");
      }

      if (newPassword.length < 8) {
        return toast.error("Password must be at least 8 characters");
      }

      if (newPassword !== confirmPassword) {
        return toast.error("Passwords do not match");
      }

      const { data } = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (data.success) {
        toast.success("Password updated successfully 🔒");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setShowPasswordModal(false);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };
  const handleDeleteAccount = async () => {
    try {
      const { data } = await api.delete("/auth/delete-account", {
        data: {
          password: deletePassword,
        },
      });

      if (data.success) {
        setDeletePassword("");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.success("Account deleted successfully");

        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };
  const saveBookingPreferences = async (seat, lang, reminder) => {
    try {
      const { data } = await api.put("/auth/booking-preferences", {
        preferredSeat: seat,
        preferredLanguage: lang,
        ticketReminder: reminder,
      });

      if (data.success) {
        updateUser({
          bookingPreferences: data.bookingPreferences,
        });

        toast.success("Booking preferences is coming in a future update. 🎟");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save preferences");
    }
  };

  const handleClearCache = () => {
    // Clear only app cache, not authentication
    localStorage.removeItem("searchHistory");
    localStorage.removeItem("recentMovies");
    localStorage.removeItem("theme");

    sessionStorage.clear();

    toast.success("Cache cleared successfully 🧹");
  };
  const handleLogoutAllDevices = () => {
    toast("🚧 Logout from all devices is coming in a future update.", {
      icon: "⚙️",
    });
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");

    if (savedTheme === "false") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("emailNotification", emailNotification);
  }, [emailNotification]);

  useEffect(() => {
    localStorage.setItem("movieNotification", movieNotification);
  }, [movieNotification]);

  useEffect(() => {
    if (!user?.bookingPreferences) return;

    setPreferredSeat(user.bookingPreferences.preferredSeat || "Middle");

    setLanguage(user.bookingPreferences.preferredLanguage || "English");

    setTicketReminder(user.bookingPreferences.ticketReminder ?? true);
  }, [user]);

  useEffect(() => {
    if (!user?.bookingPreferences) return;

    setPreferredSeat(user.bookingPreferences.preferredSeat);
    setLanguage(user.bookingPreferences.preferredLanguage);
    setTicketReminder(user.bookingPreferences.ticketReminder);
  }, [user]);

  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-40 pt-24 md:pt-32 pb-12 md:pb-20">
      <PageBackground />
      {/* Header */}
      <div className="mb-10">
        <h1 className="flex items-center gap-2 text-xl md:text-2xl font-bold">
          <Settings className="w-5 h-5 md:w-7 md:h-7 text-primary" />
          Account Settings
        </h1>

        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Manage your profile, preferences, notifications and account security.
        </p>
      </div>

      {/* Profile */}
      <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl transition-all duration-300 hover:bg-primary/15 hover:border-primary hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-primary/10">
          <h2 className="text-xl sm:text-2xl font-bold">👤 My Profile</h2>

          <button
            onClick={() => setShowEditProfile(true)}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={user?.image || profile}
              alt={user?.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary"
            />

            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0f172a]" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold">{user?.name}</h2>

            <p className="text-gray-400 mt-2">{user?.email}</p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-5">
              <span className="px-4 py-1 rounded-full bg-primary/20 text-primary text-sm">
                Verified User
              </span>

              <span className="px-4 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:bg-primary/15 hover:border-primary hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/10">
          <h2 className="text-lg sm:text-2xl font-bold">🔒 Security</h2>

          <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] sm:text-xs font-medium whitespace-nowrap">
            Protected
          </span>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <div className="flex-1">
              <h3 className="font-semibold">Change Password</h3>

              <p className="text-sm text-gray-400">
                Update your account password.
              </p>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
            >
              Change
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <div className="flex-1">
              <h3 className="font-semibold">Two-Factor Authentication</h3>

              <p className="text-sm text-gray-400">
                Add an extra layer of protection.
              </p>
            </div>

            <span className="w-full sm:w-auto text-center px-3 py-2 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
              Coming Soon
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <div className="flex-1">
              <h3 className="font-semibold">Login Devices</h3>

              <p className="text-sm text-gray-400">
                Manage your active sessions.
              </p>
            </div>

            <span className="w-full sm:w-auto text-center px-3 py-2 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:bg-primary/15 hover:border-primary hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 mb-8">
        <div className="mb-6 pb-4 border-b border-primary/10">
          <h2 className="text-xl sm:text-2xl font-bold">🎨 Preferences</h2>

          <p className="text-sm text-gray-400 mt-1">
            Customize your EasyBook experience.
          </p>
        </div>

        <div className="space-y-5">
          {/* Dark Mode */}

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <div>
              <h3 className="font-semibold">Dark Theme</h3>

              <p className="text-sm text-gray-400">Premium dark interface.</p>
            </div>

            <button
              onClick={() => {
                setDarkMode(!darkMode);

                toast.success(
                  !darkMode ? "Dark mode enabled 🌙" : "Light mode is coming in a future update. ☀️",
                );
              }}
              className={`relative w-14 h-8 rounded-full transition-all duration-300 cursor-pointer ${
                darkMode
                  ? "bg-primary shadow-lg shadow-primary/30"
                  : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${
                  darkMode ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Email */}

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <div>
              <h3 className="font-semibold">Email Notifications</h3>

              <p className="text-sm text-gray-400">
                Booking confirmations and reminders.
              </p>
            </div>

            <button
              onClick={() => {
                const value = !emailNotification;

                setEmailNotification(value);

                toast.success(
                  value
                    ? "Email notifications is coming in a future update. 📧"
                    : "Email notifications is coming in a future update.",
                );
              }}
              className={`relative w-14 h-8 rounded-full transition ${
                emailNotification ? "bg-primary" : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition ${
                  emailNotification ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Movie Alerts */}

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <div>
              <h3 className="font-semibold">Movie Release Alerts</h3>

              <p className="text-sm text-gray-400">
                Get notified about upcoming movies.
              </p>
            </div>

            <button
              onClick={() => {
                const value = !movieNotification;

                setMovieNotification(value);

                toast.success(
                  value ? "Movie alerts is coming in a future update. 🎬" : "Movie alerts is coming in a future update.",
                );
              }}
              className={`relative w-14 h-8 rounded-full transition ${
                movieNotification ? "bg-primary" : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition ${
                  movieNotification ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Preferences */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:bg-primary/15 hover:border-primary hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 mb-8">
        <div className="mb-6 pb-4 border-b border-primary/10">
          <h2 className="text-xl sm:text-2xl font-bold">
            🎟 Booking Preferences
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Customize your movie booking experience.
          </p>
        </div>

        <div className="space-y-5">
          {/* Preferred Seat */}

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <div>
              <h3 className="font-semibold">Preferred Seat</h3>

              <p className="text-sm text-gray-400">
                Default seat position during booking.
              </p>
            </div>

            <select
              value={preferredSeat}
              onChange={(e) => {
                const value = e.target.value;

                setPreferredSeat(value);

                saveBookingPreferences(value, language, ticketReminder);
              }}
              className="bg-[#1f2937] border border-primary/20 rounded-xl px-3 py-2 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/40"
            >
              <option>Front</option>
              <option>Middle</option>
              <option>Back</option>
            </select>
          </div>

          {/* Language */}

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <div>
              <h3 className="font-semibold">Preferred Language</h3>

              <p className="text-sm text-gray-400">
                Default language while browsing.
              </p>
            </div>

            <select
              value={language}
              onChange={(e) => {
                const value = e.target.value;

                setLanguage(value);

                saveBookingPreferences(preferredSeat, value, ticketReminder);
              }}
              className="bg-[#1f2937] border border-primary/20 rounded-xl px-3 py-2 outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/40"
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>

          {/* Ticket Reminder */}

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <div>
              <h3 className="font-semibold">Ticket Reminder</h3>

              <p className="text-sm text-gray-400">
                Notify before your movie starts.
              </p>
            </div>

            <button
              onClick={() => {
                const value = !ticketReminder;

                setTicketReminder(value);

                saveBookingPreferences(preferredSeat, language, value);
              }}
              className={`relative w-14 h-8 rounded-full transition ${
                ticketReminder ? "bg-primary" : "bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white transition ${
                  ticketReminder ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:bg-primary/15 hover:border-primary hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={logo}
            alt="EasyBook"
            className="w-16 h-16 rounded-2xl bg-white p-3 shadow-lg"
          />

          <div>
            <h2 className="text-2xl font-bold">EasyBook</h2>

            <p className="text-gray-400">Movie Ticket Booking Platform</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <p className="text-gray-400 text-sm">Version</p>

            <h3 className="font-semibold mt-1">v1.0.0</h3>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <p className="text-gray-400 text-sm">App Status</p>

            <h3 className="text-green-400 font-semibold mt-1">Online</h3>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <p className="text-gray-400 text-sm">Privacy Policy</p>

            <button
              onClick={() => navigate("/privacy-policy")}
              className="font-semibold hover:text-primary transition cursor-pointer"
            >
              View →
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <p className="text-gray-400 text-sm">Terms & Conditions</p>

            <button
              onClick={() => navigate("/terms")}
              className="font-semibold hover:text-primary transition cursor-pointer"
            >
              View →
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-transparent transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:scale-[1.02]">
            <p className="text-gray-400 text-sm">Contact Support</p>

            <a
              href="mailto:support@easybook.com"
              className="font-semibold text-primary hover:underline"
            >
              support@easybook.com
            </a>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:bg-primary/15 hover:border-primary hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
        <h2 className="text-2xl font-bold text-red-400 mb-3">⚠️ Danger Zone</h2>

        <p className="text-gray-400 mb-6">These actions affect your account.</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleLogoutAllDevices}
            className="px-5 py-3 rounded-xl bg-red-700 text-white transition-all duration-300 hover:bg-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 cursor-pointer"
          >
            Logout From All Devices
          </button>

          <button
            disabled={user?.role === "admin"}
            onClick={() => setShowDeleteModal(true)}
            className={`px-5 py-3 rounded-xl text-white transition-all duration-300 cursor-pointer ${
              user?.role === "admin"
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-700 hover:bg-red-600 hover:scale-105"
            }`}
          >
            {user?.role === "admin"
              ? "Admin Account Protected"
              : "Delete My Account"}
          </button>
          <button
            onClick={handleClearCache}
            className="px-5 py-3 rounded-xl bg-red-600 text-white transition-all duration-300 hover:bg-red-500 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 cursor-pointer"
          >
            Clear Cache
          </button>
        </div>
      </div>

      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-[92%] max-w-lg rounded-3xl bg-[#111827] border border-primary/20 p-8">
            <button
              onClick={() => setShowEditProfile(false)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 hover:bg-red-500 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <img
                  src={selectedImage || image}
                  alt={user?.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-xl"
                />
                <input
                  type="file"
                  accept="image/*"
                  id="profileImage"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      setImageFile(file);
                      setSelectedImage(URL.createObjectURL(file));
                    }
                  }}
                />

                <label
                  htmlFor="profileImage"
                  className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 transition flex items-center justify-center text-white cursor-pointer"
                >
                  📷
                </label>
              </div>

              <div className="w-full space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-black/20 border border-primary/20 px-4 py-3 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    defaultValue={user?.email}
                    disabled
                    className="w-full rounded-xl bg-black/10 border border-primary/10 px-4 py-3 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 w-full mt-8">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-300 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-semibold transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md rounded-3xl border border-primary/20 bg-[#111827] p-8 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">🔒 Change Password</h2>

                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-2xl text-gray-400 hover:text-white transition cursor-pointer"
                >
                  ×
                </button>
              </div>

              {/* Current Password */}
              <div className="mb-5">
                <label className="block text-sm text-gray-400 mb-2">
                  Current Password
                </label>

                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-primary/20 bg-black/20 px-4 py-3 pr-12 outline-none focus:border-primary"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white transition"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-5">
                <label className="block text-sm text-gray-400 mb-2">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-primary/20 bg-black/20 px-4 py-3 pr-12 outline-none focus:border-primary"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {strength && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Password Strength</span>
                      <span className={strength.color}>{strength.text}</span>
                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${strength.bg} ${strength.width}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-8">
                <label className="block text-sm text-gray-400 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full rounded-xl border border-primary/20 bg-black/20 px-4 py-3 pr-12 outline-none focus:border-primary"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <p
                    className={`mt-3 text-sm font-medium ${
                      newPassword === confirmPassword
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {newPassword === confirmPassword
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 hover:bg-white/10 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handlePasswordChange}
                  disabled={
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                  }
                  className={`flex-1 rounded-xl border border-primary/10 bg-primary/5 py-3 hover:bg-primary/10 transition cursor-pointer ${
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30"
                  }`}
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#111827] border border-red-500/30 p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Delete Account
            </h2>

            <p className="text-gray-400 mb-5 leading-7">
              This action is permanent.
              <br />
              Please enter your current password to confirm account deletion.
            </p>
            <div className="relative mb-8">
              <input
                type={showDeletePassword ? "text" : "password"}
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Current Password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 outline-none focus:border-red-500"
              />

              <button
                type="button"
                onClick={() => setShowDeletePassword(!showDeletePassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                {showDeletePassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setDeletePassword("");
                  setShowDeleteModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
