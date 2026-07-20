import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
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
        <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>

        <p className="text-gray-400 mb-10">Last Updated: July 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              1. Acceptance of Terms
            </h2>

            <p className="text-gray-300 leading-8">
              By using EasyBook, you agree to comply with these Terms &
              Conditions and all applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Booking Policy</h2>

            <p className="text-gray-300 leading-8">
              Users are responsible for selecting the correct movie, date,
              showtime, and seats before confirming a booking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Payments</h2>

            <p className="text-gray-300 leading-8">
              All payments must be completed through supported payment methods.
              Bookings are confirmed only after successful payment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              4. Cancellation & Refund
            </h2>

            <p className="text-gray-300 leading-8">
              Cancellation and refund policies depend on theatre rules and may
              vary between shows.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              5. Account Responsibility
            </h2>

            <p className="text-gray-300 leading-8">
              You are responsible for maintaining the confidentiality of your
              account credentials and all activities under your account.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
