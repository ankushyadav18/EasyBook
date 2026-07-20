import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const DateSelect = ({ dateTime = {}, id }) => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);

  const onBookHandler = () => {
    if (!selected) {
      return toast.error("Please select a date");
    }

    navigate(`/movies/${id}/${selected}`);
  };

  return (
    <div id="dateSelect" className="pt-16">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-5 sm:p-7 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-12">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-semibold">
            🎟️ Ticket Booking
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold mt-4">
            Choose Your Show Date
          </h2>

          <p className="text-sm sm:text-base text-gray-400 mt-2">
            Select an available date to continue with your booking.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-1 sm:gap-4 lg:gap-6 text-sm mt-2 md:mt-8">
            <ChevronLeftIcon className="hidden lg:block w-7 h-7 flex-shrink-0" />

            <span className="movie-carousel">
              {Object.keys(dateTime).map((date) => {
                const isExpired =
                  new Date(date) < new Date().setHours(0, 0, 0, 0);

                return (
                  <button
                    key={date}
                    disabled={isExpired}
                    onClick={() => !isExpired && setSelected(date)}
                    className={`min-w-[60px] h-18 sm:min-w-[75px] sm:h-22 lg:min-w-[80px] lg:h-24 rounded-xl lg:rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center flex-shrink-0 ${
                      isExpired
                        ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                        : selected === date
                          ? "bg-primary border-primary text-white shadow-sm shadow-primary/30 scale-105"
                          : "bg-white/5 border-white/10 hover:border-primary hover:bg-primary/10 hover:-translate-y-1 cursor-pointer"
                    }`}
                  >
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold">
                      {new Date(date).getDate()}
                    </span>

                    <span className="text-[10px] sm:text-xs uppercase tracking-wider mt-1">
                      {new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>

                    <span className="text-[8px] sm:text-[10px] text-gray-300 mt-1">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </span>
                    {isExpired && (
                      <span className="mt-1 text-[9px] uppercase text-red-400">
                        Expired
                      </span>
                    )}
                  </button>
                );
              })}
            </span>

            <ChevronRightIcon className="hidden lg:block w-7 h-7 flex-shrink-0" />
          </div>
        </div>

        <button
          onClick={onBookHandler}
          disabled={!selected}
          className="w-full lg:w-auto mt-2 lg:mt-0 lg:ml-12 px-6 sm:px-8 lg:px-10 py-3 lg:py-4 rounded-2xl bg-primary font-semibold text-white shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 disabled:bg-gray-700 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100"
        >
          Continue Booking →
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
