import { useState } from "react";
import LoginStep from "./LoginStep";
import RegisterStep from "./RegisterStep";

const AuthModal = ({ onClose }) => {
  const [step, setStep] = useState("login");

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f1117] shadow-2xl overflow-hidden">
        {step === "login" ? (
          <LoginStep
            setStep={setStep}
            onClose={onClose}
          />
        ) : (
          <RegisterStep
            setStep={setStep}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;