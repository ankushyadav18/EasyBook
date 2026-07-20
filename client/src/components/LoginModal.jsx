import React, { useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/user/login", {
        email,
        password,
      });

      if (data.success) {
        toast.success("Login successful");
        localStorage.setItem("token", data.token);
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]">

      <div className="bg-gray-900 p-6 rounded-xl w-96 relative">

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white text-xl"
        >
          ×
        </button>

        <h1 className="text-xl font-bold text-center mb-4">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">

          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded bg-gray-800 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="p-2 rounded bg-gray-800 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="bg-primary py-2 rounded hover:bg-primary/80">
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default LoginModal;