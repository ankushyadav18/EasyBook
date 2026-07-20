import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../lib/api";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const { updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const { data } = await api.get("/auth/me");

      if (data.success) {
        setProfile(data.user);
        setName(data.user.name);
        setStats(data.stats);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await api.put("/auth/update", formData);
      console.log(image);

      if (data.success) {
        setProfile(data.user);

        updateUser({
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
          role: data.user.role,
        });

        toast.success("Profile updated");

        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-40 pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="max-w-6xl mx-auto overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
        <div className="relative h-28 md:h-44 overflow-hidden rounded-t-3xl bg-gradient-to-r from-[#7f1d1d] via-primary to-[#4c1d95]">
          {/* Left Glow */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

          {/* Right Glow */}
          <div className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-red-500/20 blur-3xl" />

          {/* Decorative Lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-12 left-12 w-40 h-[1px] bg-white rotate-12"></div>
            <div className="absolute top-28 right-20 w-56 h-[1px] bg-white -rotate-12"></div>
            <div className="absolute bottom-16 left-1/2 w-72 h-[1px] bg-white rotate-6"></div>
          </div>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative px-5 md:px-12 pb-8 md:pb-12">
          <div className="flex justify-center -mt-12 md:-mt-20">
            <div className="relative">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-[6px] border-[#111827] shadow-2xl"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary flex items-center justify-center text-6xl font-bold text-white border-[6px] border-[#111827] shadow-2xl">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              {isEditing && (
                <>
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-primary border-4 border-[#111827] flex items-center justify-center cursor-pointer hover:scale-110 transition"
                  >
                    📷
                  </label>

                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            {/* Name */}

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              {profile?.name}
            </h1>

            {/* Email */}

            <p className="mt-3 text-sm md:text-lg text-gray-400">{profile?.email}</p>

            {/* Premium Role Badge */}

            <div className="flex justify-center mt-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 md:px-6 md:py-2 backdrop-blur-xl">
                <span className="text-xl">🛡</span>

                <span className="font-semibold tracking-wide text-primary capitalize">
                  {profile?.role === "admin" ? "Administrator" : "Member"}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-xl md:text-2xl font-semibold">
                Welcome back, {profile?.name.split(" ")[0]} 👋
              </h2>

              <p className="mt-2 text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-6 md:leading-7">
                Manage your bookings, update your profile, and keep track of
                your favorite movies—all from one place.
              </p>
            </div>

            {/* Buttons */}

            
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-5 mt-6 md:mt-8">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl bg-primary px-4 py-2 text-sm md:text-base md:px-8 md:py-3"
                >
                  ✏️ Edit Profile
                </button>

                {profile?.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="rounded-2xl border border-primary/30 bg-white/5 px-5 py-2.5 md:px-8 md:py-3 font-semibold hover:bg-primary/10 transition"
                  >
                    🚀 Admin Panel
                  </button>
                )}
              </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mt-16">
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 text-center">
                <p className="text-2xl md:text-4xl">❤️</p>
                <h3 className="text-lg md:text-2xl font-bold mt-4">
                  {profile?.favorites?.length || 0}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 mt-2">Favorites</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 md:p-6 text-center">
                <p className="text-2xl md:text-4xl">🎟</p>
                <h3 className="text-lg md:text-2xl font-bold mt-4">
                  {stats.totalBookings}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 mt-2">Bookings</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 text-center">
                <p className="text-2xl md:text-4xl">💰</p>
                <h3 className="text-lg md:text-2xl font-bold mt-4 text-primary">
                  ₹{stats.totalSpent}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 mt-2">Total Spent</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 text-center">
                <p className="text-2xl md:text-4xl">🎬</p>
                <h3 className="text-lg md:text-2xl font-bold mt-4">
                  {profile?.role === "admin" ? "∞" : stats.totalBookings}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 mt-2">Experience</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 text-center">
                <p className="text-2xl md:text-4xl">⭐</p>
                <h3 className="text-xl md:text-2xl font-bold mt-4">
                  {profile?.role === "admin" ? "PRO" : "USER"}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 mt-2">Membership</p>
              </div>
            </div>
            <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-8">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Full Name</p>

                  <p className="text-lg font-semibold">{profile?.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Email Address</p>

                  <p className="text-lg font-semibold break-all">
                    {profile?.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Joined</p>

                  <p className="text-lg font-semibold">
                    {new Date(profile?.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Account Type</p>

                  <p className="text-lg font-semibold capitalize">
                    {profile?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
              <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-center">Edit Profile</h2>

                <div className="flex justify-center mt-8">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                    />
                  ) : profile?.image ? (
                    <img
                      src={profile.image}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-5xl font-bold">
                      {profile?.name.charAt(0)}
                    </div>
                  )}
                </div>

                <label className="block mt-6">
                  <span className="text-sm text-gray-400">Full Name</span>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <div className="flex justify-center mt-8">
                  <div className="relative">
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        className="w-36 h-36 rounded-full object-cover border-4 border-primary shadow-xl"
                      />
                    ) : profile?.image ? (
                      <img
                        src={profile.image}
                        className="w-36 h-36 rounded-full object-cover border-4 border-primary shadow-xl"
                      />
                    ) : (
                      <div className="w-36 h-36 rounded-full bg-primary flex items-center justify-center text-5xl font-bold border-4 border-primary shadow-xl">
                        {profile?.name.charAt(0)}
                      </div>
                    )}

                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-1 right-1 w-11 h-11 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition"
                    >
                      📷
                    </label>

                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 rounded-xl bg-primary py-3 font-semibold"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setName(profile.name);
                      setImage(null);
                    }}
                    className="flex-1 rounded-xl bg-gray-700 py-3 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
