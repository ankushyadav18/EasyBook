import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-40 pt-28 pb-16">
      <div className="sticky top-32 z-22 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 font-medium transition-all duration-300 hover:bg-primary hover:text-white cursor-pointer"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto rounded-3xl bg-primary/10 border border-primary/20 p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>

        <p className="text-gray-400 mb-10">Last Updated: July 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              1. Information We Collect
            </h2>

            <p className="text-gray-300 leading-8">
              EasyBook collects basic information such as your name, email
              address, profile picture, booking history, and account preferences
              to provide movie ticket booking services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              2. How We Use Your Information
            </h2>

            <p className="text-gray-300 leading-8">
              Your information is used to manage bookings, improve user
              experience, personalize recommendations, and communicate important
              updates regarding your account and bookings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>

            <p className="text-gray-300 leading-8">
              We use industry-standard security practices to protect your
              account information. Passwords are encrypted before being stored
              in our database.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              4. Third-Party Services
            </h2>

            <p className="text-gray-300 leading-8">
              EasyBook may use trusted third-party services such as Cloudinary
              for image storage and payment providers for secure transactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Contact</h2>

            <p className="text-gray-300 leading-8">
              If you have any questions regarding this Privacy Policy, please
              contact us at support@easybook.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
