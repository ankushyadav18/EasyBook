import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import screenImage from "../assets/screenImage.svg";
import api from "../lib/api";
import Loading from "../components/Loading";
import {
  ArrowRightIcon,
  ClockIcon,
  ArrowLeft,
  Building2,
  MonitorPlay,
} from "lucide-react";
import toast from "react-hot-toast";
import PageBackground from "../components/PageBackground";
import isoTimeFormat from "../lib/isoTimeFormat";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { id, date } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast.error("Please select time first");
    }

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast.error("You can only select 5 seats");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId],
    );
  };

  const bookTickets = async () => {
    if (!selectedTime) {
      return toast.error("Please select a time");
    }

    if (selectedSeats.length === 0) {
      return toast.error("Please select at least one seat");
    }

    const price = selectedTime.ticketPrice || 100;

    try {
      // Step 1: Create Booking
      const bookingRes = await api.post("/booking/book", {
        showId: selectedTime._id,
        seats: selectedSeats,
        totalAmount: selectedSeats.length * price,
      });

      if (!bookingRes.data.success) {
        return toast.error("Booking failed");
      }

      const booking = bookingRes.data.booking;

      // Step 2: Create Razorpay Order
      const orderRes = await api.post("/payment/create-order", {
        bookingId: booking._id,
      });

      const order = orderRes.data.order;

      // Step 3: Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "EasyBook",
        description: "Movie Ticket Booking",
        order_id: order.id,

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
              navigate("/my-bookings");
            } else {
              toast.error("Payment Verification Failed");
            }
          } catch (err) {
            console.log(err);
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

  const renderSeats = (row, count = 9) => {
    return (
      <div key={row} className="mt-2 flex justify-center gap-1.5 sm:gap-2">
        <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
          {Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            const isBooked = selectedTime?.bookedSeats?.includes(seatId);

            return (
              <button
                key={seatId}
                onClick={() => !isBooked && handleSeatClick(seatId)}
                className={`h-7 w-7 rounded-md border text-[9px] font-semibold transition-all duration-300 sm:h-9 sm:w-9 sm:rounded-lg sm:text-[10px] ${
                  isBooked
                    ? "bg-red-500 border-red-500 text-gray-900 dark:text-white cursor-not-allowed"
                    : selectedSeats.includes(seatId)
                      ? "bg-primary border-primary text-gray-900 dark:text-white scale-110 shadow-lg shadow-primary/40"
                      : "bg-white dark:bg-primary/10 border-gray-500 hover:border-primary hover:bg-primary/20 hover:scale-105"
                }`}
              >
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await api.get(`/movie/${id}`);
        const showRes = await api.get(`/show/${id}`);

        setShow({
          movie: movieRes.data.movie,
          dateTime: showRes.data.shows,
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to load show");
      }
    };

    fetchData();
  }, [id]);

  if (!show) {
    return <Loading />;
  }

  return (
    <>
      <PageBackground />

      <div className="flex flex-col gap-6 px-3 pt-16 pb-12 sm:px-6 md:px-10 md:pt-20 lg:flex-row lg:gap-8 lg:px-24 xl:px-40 xl:pt-24">
        <div className="fixed top-5 left-4 sm:left-6 z-50">
          <button
            onClick={() => navigate(`/movies/${id}#dateSelect`)}
            className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        {/* Available Timings */}
        <div className="h-max w-full overflow-hidden rounded-2xl border border-gray-600 dark:border-white/10 bg-white dark:bg-primary/10 shadow-2xl sm:rounded-3xl lg:sticky lg:top-28 lg:w-80 lg:shrink-0">
          <div className="border-b border-gray-600 dark:border-white/10 px-4 pb-5 sm:px-6 sm:pb-6">
            <p className="text-primary mt-4 text-xs font-semibold uppercase tracking-[0.3em]">
              Show Schedule
            </p>

            <h2 className="mt-2 text-2xl text-black dark:text-white font-bold">Available Timings</h2>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-6">
              Choose your preferred theatre and show time.
            </p>
          </div>

          <div className="space-y-3 p-4 text-gray-600 dark:text-gray-400 sm:space-y-4 sm:p-5">
            {show?.dateTime?.[date]?.length ? (
              show.dateTime[date].map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setSelectedTime(item);

                    if (window.innerWidth < 1024) {
                      setTimeout(() => {
                        document
                          .getElementById("seatSelection")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }, 150);
                    }
                  }}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 ${
                    selectedTime?._id === item._id
                      ? "border-primary bg-primary/20 shadow-lg shadow-primary/20"
                      : "border-gray-600 dark:border-white/10 bg-white dark:bg-primary/10 hover:border-primary/50 hover:bg-primary/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-primary" />
                      <span className="font-semibold">
                        {isoTimeFormat(item.time)}
                      </span>
                    </div>

                    <span className="text-primary font-bold">
                      ₹{item.ticketPrice}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <h2 className="text-sm font-bold flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-primary" />{" "}
                      {item.theatreName}
                    </h2>

                    <h2 className="text-sm font-bold flex items-center gap-2">
                      <MonitorPlay className="w-6 h-6 text-primary" />{" "}
                      {item.screen}
                    </h2>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-900 dark:text-gray-400">No shows available.</p>
            )}
          </div>
        </div>

        {/* Seat Layout */}
        <div className="relative flex-1 flex flex-col items-center mt-2 lg:mt-0">
          <div className="w-full max-w-4xl mb-8">
            <div className="rounded-2xl border border-gray-600 dark:border-white/10 bg-white dark:bg-primary/10 p-4 sm:rounded-3xl sm:p-6">
              <h2 className="text-2xl text-black dark:text-white font-bold">{show.movie.title}</h2>

              <div className="mt-4 grid grid-cols-1 gap-4 text-gray-900 dark:text-gray-300 xs:grid-cols-2 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Theatre</p>
                  <p className="font-semibold">
                    {selectedTime?.theatreName || "Select a show"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">Screen</p>
                  <p className="font-semibold">
                    {selectedTime?.screen || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">Date</p>
                  <p className="font-semibold">{date}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase">Time</p>
                  <p className="font-semibold">
                    {selectedTime ? isoTimeFormat(selectedTime.time) : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Price</p>
                  <p className="font-semibold">
                    ₹{selectedTime?.ticketPrice || "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            id="seatSelection"
            className="relative mt-6 mb-8 flex w-full max-w-3xl flex-col items-center sm:mt-8 sm:mb-12"
          >
            <img
              src={screenImage}
              alt="screen"
              className="w-full max-w-md sm:max-w-xl lg:max-w-3xl opacity-95 drop-shadow-[0_0_40px_rgba(255,255,255,0.25)]"
            />

            <p className="mt-2 tracking-[0.5em] text-xs uppercase text-gray-500">
              Screen
            </p>

            <div className="mt-3 h-px w-2/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
          </div>

          <div className="mb-4 grid w-full max-w-3xl grid-cols-1 gap-3 rounded-2xl border border-gray-600 dark:border-white/10 bg-white dark:bg-primary/10 px-4 py-4 text-center min-[420px]:grid-cols-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-8 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded border border-primary/50"></div>
              <span className="text-sm text-gray-900 dark:text-gray-300">Available</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-primary"></div>
              <span className="text-sm text-gray-900 dark:text-gray-300">Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-red-500"></div>
              <span className="text-sm text-gray-900 dark:text-gray-300">Booked</span>
            </div>
          </div>

         <div className="mt-8 w-full overflow-x-auto sm:mt-10">
  <div className="flex flex-col items-center min-w-fit px-4 md:px-0 text-xs text-gray-900 dark:text-gray-300">
            <div className="mb-5 grid w-max grid-cols-2 gap-3 sm:gap-8 md:mb-6 md:grid-cols-1 md:gap-2">
              {groupRows[0].map((row) => renderSeats(row))}
            </div>

            <div className="grid w-max grid-cols-2 gap-3 sm:gap-11">
              {groupRows.slice(1).map((group, index) => (
                <div key={index}>{group.map((row) => renderSeats(row))}</div>
              ))}
            </div>
            </div>
          </div>

          <div className="w-full max-w-3xl mt-10 space-y-6">
            {/* Legend */}

            {/* Booking Summary */}
            <div className="rounded-2xl border border-gray-600 dark:border-white/10 bg-white dark:bg-primary/10 p-4 shadow-2xl sm:rounded-3xl sm:p-6">
              <div className="grid grid-cols-1 gap-5 text-center lg:grid-cols-[1fr_auto_auto] lg:items-center">
                {/* Left */}
                <div className="grid grid-cols-3 gap-2 sm:gap-6 text-center">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-black dark:text-gray-500">
                      Seats
                    </p>

                    <h3 className="mt-2 font-bold text-gray-500 dark:text-white text-xs md:text-lg">
                      {selectedSeats.length ? selectedSeats.join(", ") : "--"}
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-black dark:text-gray-500">
                      Tickets
                    </p>

                    <h3 className="mt-2 font-bold text-gray-500 dark:text-white text-sm md:text-lg">
                      {selectedSeats.length}
                    </h3>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-black dark:text-gray-500">
                      Total
                    </p>

                    <h3 className="mt-1 md:mt-2 break-words text-lg font-bold text-primary md:text-3xl">
                      ₹{(selectedTime?.ticketPrice || 0) * selectedSeats.length}
                    </h3>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px self-stretch bg-white/10"></div>

                {/* Right */}
                <button
                  onClick={bookTickets}
                  disabled={!selectedTime || selectedSeats.length === 0}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 py-4 text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg lg:w-auto lg:min-w-[260px] lg:hover:scale-105"
                >
                  Proceed to Payment
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatLayout;
