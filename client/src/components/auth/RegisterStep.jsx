import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterStep = ({ setStep, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (data.success) {
        login(data.user, data.token);

        toast.success("Account created successfully");

        onClose();

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <button
          onClick={() => setStep("login")}
          className="rounded-full p-2 hover:bg-white/10 cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Create Account
          </h2>

          <p className="text-sm text-gray-400">
            Join EasyBook
          </p>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-primary"
        />

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
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-primary"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="h-14 w-full rounded-2xl bg-primary font-semibold text-black hover:scale-[1.02] transition disabled:opacity-40 cursor-pointer"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </div>
    </>
  );
};

export default RegisterStep;