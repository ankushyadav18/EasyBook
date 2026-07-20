import React, { useEffect, useState, useRef } from "react";
import api from "../lib/api";
import Loading from "../components/Loading";
import timeFormat from "../lib/timeFormat";
import isoTimeFormat from "../lib/isoTimeFormat";
import toast from "react-hot-toast";
import Ticket from "../components/Ticket";
import { ticketDateFormat } from "../lib/ticketDateFormat";
// import {
//   Calendar,
//   Clock3,
//   Ticket,
//   MapPin,
//   MonitorPlay,
//   CreditCard,
//   Trash2,
// } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import PageBackground from "../components/PageBackground";

const MyBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewBooking, setPreviewBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const ticketRef = useRef(null);

  const getMyBookings = async () => {
    try {
      const { data } = await api.get("/booking/my");

      if (data.success) {
        setBookings(data.bookings);
        console.log("BOOKINGS:", data.bookings);
        console.log("FIRST BOOKING:", data.bookings[0]);
        console.log("SHOW:", data.bookings[0]?.show);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };
  // Cancel Booking
  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await api.delete(`/booking/${bookingId}`);

      if (data.success) {
        toast.success("Booking cancelled successfully");
        getMyBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel booking");
    }
  };
  const downloadTicket = async (booking) => {
    try {
      if (!ticketRef.current) return;

      const dataUrl = await toPng(ticketRef.current, {
        pixelRatio: 4,
        cacheBust: true,
        backgroundColor: "#111827",
      });

      // Create temporary PDF to read image properties
      const tempPdf = new jsPDF();

      const props = tempPdf.getImageProperties(dataUrl);

      // Create PDF matching the image size
      const pdf = new jsPDF({
        orientation: props.width > props.height ? "landscape" : "portrait",
        unit: "px",
        format: [props.width, props.height],
      });

      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        0,
        props.width,
        props.height,
        undefined,
        "FAST",
      );

      pdf.save(`${booking.movie.title}-Ticket.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download ticket");
    }
  };

  const payNow = async (booking) => {
    try {
      // Create Razorpay Order
      const { data } = await api.post("/payment/create-order", {
        bookingId: booking._id,
      });

      if (!data.success) {
        return toast.error(data.message);
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "EasyBook",
        description: "Movie Ticket Booking",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verifyRes = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });

            if (verifyRes.data.success) {
              toast.success("Payment Successful 🎉");

              // Refresh bookings
              getMyBookings();
            } else {
              toast.error("Payment Verification Failed");
            }
          } catch (error) {
            console.log(error);
            toast.error("Payment Verification Failed");
          }
        },

        theme: {
          color: "#E50914",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function () {
        toast.error("Payment Failed");
      });

      razorpay.open();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const totalBookings = bookings.length;

  const paidBookings = bookings.filter(
    (booking) => booking.paymentStatus === "paid",
  ).length;

  const totalSpent = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  return (
    <div className="relative min-h-[80vh] px-4 pt-24 sm:px-6 md:px-10 lg:px-16 xl:px-28 2xl:px-40 md:pt-32">
      <PageBackground />

      <div className="mb-10">
        <p className="text-primary text-sm uppercase tracking-[0.35em] font-semibold">
          EasyBook
        </p>

        <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold">
          My Bookings
        </h1>

        <p className="mt-4 text-sm sm:text-base max-w-2xl text-gray-400 leading-6 sm:leading-7">
          Manage your booked movies, download tickets, complete pending
          payments, and keep track of your upcoming cinema experience.
        </p>
        <div className="grid grid-cols-3 gap-3 mt-8 mb-10 sm:gap-6">
          <div className="rounded-xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 sm:p-6">
            <p className="text-[10px] sm:text-xs uppercase tracking-wide sm:tracking-[0.25em] text-gray-500">
              Total Bookings
            </p>

            <h2 className="mt-2 text-xl sm:text-4xl font-bold">
              {totalBookings}
            </h2>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6">
            <p className="text-[10px] sm:text-xs uppercase tracking-wide sm:tracking-[0.25em] text-gray-500">
              Paid Tickets
            </p>

            <h2 className="mt-2 text-xl sm:text-4xl font-bold text-green-400">
              {paidBookings}
            </h2>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6">
            <p className="text-[10px] sm:text-xs uppercase tracking-wide sm:tracking-[0.25em] text-gray-500">
              Total Spent
            </p>

            <h2 className="mt-2 text-xl sm:text-4xl font-bold text-primary">
              {currency}
              {totalSpent}
            </h2>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="flex justify-center items-center h-60">
          <h2 className="text-2xl font-semibold text-gray-400">
            No Bookings Found
          </h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full">
              <thead className="sticky top-0 z-10 bg-primary/20 backdrop-blur-xl border-b border-white/10">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider text-gray-300">
                    Movie
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider text-gray-300">
                    Show
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider text-gray-300">
                    Seats
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider text-gray-300">
                    Amount
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider text-gray-300">
                    Payment
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider text-gray-300">
                    Booking
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wider text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((item) => {
                  const showDate = new Date(item.show?.showDate);

                  const [hours = 0, minutes = 0] = (
                    item.show?.showTime || "00:00"
                  )
                    .split(":")
                    .map(Number);

                  showDate.setHours(hours);
                  showDate.setMinutes(minutes);

                  const isExpired = showDate < new Date();

                  return (
                    <tr
                      key={item._id}
                      className={`border-t border-white/10 transition ${
                        item.bookingStatus === "cancelled"
                          ? "opacity-50 grayscale"
                          : isExpired
                            ? "opacity-70"
                            : "hover:bg-white/5"
                      }`}
                    >
                      {/* Movie */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              item.movie?.poster_path ||
                              item.movie?.backdrop_path
                            }
                            className="h-24 w-16 rounded-xl border border-white/10 object-cover shadow-lg"
                          />

                          <div>
                            <h2 className="text-lg font-bold tracking-wide">
                              {item.movie?.title || "Movie Deleted"}
                            </h2>

                            <p className="text-sm text-gray-400 mt-1">
                              ⭐{" "}
                              {Number(item.movie?.vote_average || 0).toFixed(1)}
                              {" • "}
                              {timeFormat(item.movie?.runtime || 0)}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {item.movie?.genres
                                ?.map((g) => g.name)
                                .join(" • ")}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Show */}
                      <td className="px-5 py-5">
                        <div className="space-y-1">
                          <p className="font-medium">
                            🎭 {item.show?.theatreName}
                          </p>

                          <p className="text-gray-400">
                            🖥 {item.show?.screen}
                          </p>

                          <p className="text-sm">
                            📅 {ticketDateFormat(item.show?.showDate)}
                          </p>

                          <p className="text-primary">
                            🕒 {isoTimeFormat(item.show?.showTime)}
                          </p>
                        </div>
                      </td>

                      {/* Seats */}
                      <td className="px-5 py-5">
                        <div className="flex flex-wrap gap-2">
                          {item.seats?.map((seat) => (
                            <span
                              key={seat}
                              className="rounded-lg border border-primary/30 bg-primary/15 px-2 py-1 text-xs font-semibold text-primary"
                            >
                              {seat}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="text-lg md:text-xl font-semibold md:font-extrabold text-primary">
                        {currency}
                        {item.totalAmount}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.bookingStatus === "cancelled"
                              ? "bg-red-500/20 text-red-400"
                              : item.paymentStatus === "paid"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {item.bookingStatus === "cancelled"
                            ? "Cancelled"
                            : item.paymentStatus === "paid"
                              ? "Paid"
                              : "Pending"}
                        </span>
                      </td>

                      {/* Booking */}
                      <td className="px-5 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            item.bookingStatus === "cancelled"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {item.bookingStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-5">
                        {item.bookingStatus === "cancelled" ? (
                          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center">
                            <p className="font-semibold text-red-400">
                              ❌ Booking Cancelled
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              Your seats have been released.
                            </p>
                          </div>
                        ) : isExpired ? (
                          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-center">
                            <p className="font-semibold text-yellow-400">
                              🎬 Show Expired
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              This show has already ended.
                            </p>
                          </div>
                        ) : item.paymentStatus === "paid" ? (
                          <button
                            onClick={() => {
                              console.log(item);
                              setPreviewBooking(item);
                            }}
                            className="w-full rounded-xl bg-primary px-4 py-2 font-semibold transition hover:scale-105 hover:shadow-lg hover:shadow-primary/30 cursor-pointer"
                          >
                            🎟 View Ticket
                          </button>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => payNow(item)}
                              className="rounded-xl bg-green-600 px-4 py-2 font-semibold transition hover:bg-green-500 cursor-pointer"
                            >
                              💳 Pay Now
                            </button>

                            <button
                              onClick={() => {
                                setSelectedBooking(item);
                                setShowCancelModal(true);
                              }}
                              className="rounded-xl bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-500 cursor-pointer"
                            >
                              ❌ Cancel Booking
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {previewBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-4">
          <div className="flex min-h-screen flex-col items-center py-6 sm:py-10">
            <div className="sticky top-4 z-50 mb-6 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <button
                onClick={() => downloadTicket(previewBooking)}
                className="flex-1 rounded-xl bg-green-600 px-4 py-3 font-semibold hover:bg-green-700 cursor-pointer"
              >
                📥 Download PDF
              </button>

              <button
                onClick={() => setPreviewBooking(null)}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold hover:bg-red-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="w-full max-w-[900px] px-4">
              <Ticket ref={ticketRef} booking={previewBooking} />
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[420px] rounded-2xl sm:rounded-3xl border border-red-500/30 bg-[#111827] p-5 sm:p-8 shadow-2xl">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 text-5xl">
                ⚠️
              </div>
            </div>

            <h2 className="mt-6 text-center text-3xl font-bold text-white">
              Cancel Booking?
            </h2>

            <p className="mt-4 text-center text-gray-400">
              Are you sure you want to cancel this booking?
            </p>

            <p className="mt-2 text-center text-sm text-red-400">
              This action cannot be undone.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 rounded-xl border border-gray-600 py-3 font-semibold text-white transition hover:bg-gray-700 cursor-pointer"
              >
                No
              </button>

              <button
                onClick={async () => {
                  await cancelBooking(selectedBooking._id);
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooking;
