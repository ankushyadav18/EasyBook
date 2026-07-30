import { X } from "lucide-react";
import { useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginStep = ({ setStep, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please enter your email and password");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      if (data.success) {
        login(data.user, data.token);

        toast.success("Login successful");

        onClose();

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome to EasyBook</h2>
          <p className="mt-1 text-sm text-gray-400">
            Sign in to continue booking your favorite movies.
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-2 transition hover:bg-white/10 cursor-pointer"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-primary"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-primary"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="h-14 w-full rounded-2xl bg-primary font-semibold text-black transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 cursor-pointer"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="mt-5 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={() => setStep("register")}
            className="text-primary hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </p>

        <p className="text-center text-xs leading-6 text-gray-500">
          By continuing, you agree to EasyBook's Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </>
  );
};

export default LoginStep;
