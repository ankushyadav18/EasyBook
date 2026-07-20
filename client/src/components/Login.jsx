import React, { useState } from "react";
import { X } from "lucide-react";
import api from "../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = ({ setShowLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const { data } = await api.post(endpoint, formData);

      if (data.success) {
        login(data.user, data.token);

        toast.success(data.message);

        setShowLogin(false);

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-8 shadow-2xl">
        <button
          onClick={() => setShowLogin(false)}
          className="absolute right-5 top-5 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        <h2 className="text-3xl font-bold text-white text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-gray-400 text-center mt-2">
          {isLogin ? "Login to continue" : "Create your EasyBook account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 outline-none focus:border-primary"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 outline-none focus:border-primary"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 outline-none focus:border-primary"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary py-3 rounded-lg font-semibold hover:bg-primary-dull transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary ml-2 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
