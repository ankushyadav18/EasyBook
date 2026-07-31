import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";

const DateSelect = ({ dateTime = {}, id }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setShowLogin } = useAppContext();

  const [selected, setSelected] = useState(null);

  const onBookHandler = () => {
    if (!selected) {
      return toast.error("Please select a date");
    }

    if (!user) {
      setShowLogin(true);
      return;
    }

    navigate(`/movies/${id}/${selected}`);
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availableDates = Object.keys(dateTime).filter(
    (date) => new Date(date) >= today,
  );

  return (
    <div id="dateSelect" className="pt-16">
      <div className="relative overflow-hidden rounded-3xl border border-gray-600 dark:border-white/10 bg-white dark:bg-primary/10 p-5 sm:p-7 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-12">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-semibold">
            🎟️ Ticket Booking
          </span>

          <h2 className="text-2xl sm:text-3xl text-black dark:text-gray-300 font-bold mt-4">
            Choose Your Show Date
          </h2>

          <p className="text-sm sm:text-base text-gray-900 dark:text-gray-400 mt-2">
            Select an available date to continue with your booking.
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-1 sm:gap-4 lg:gap-6 text-sm mt-2 md:mt-8">
            {availableDates.length === 0 ? (
              <div className="w-full rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-6 text-center">
                <h3 className="text-lg font-semibold text-yellow-400">
                  No Shows Available
                </h3>

                <p className="mt-2 text-sm text-gray-900 dark:text-gray-400">
                  There are currently no shows scheduled for this movie. Please
                  check back later.
                </p>
              </div>
            ) : (
              <>
                <ChevronLeftIcon className="hidden lg:block w-7 h-7 flex-shrink-0" />

                <span className="movie-carousel">
                  {availableDates.map((date) => {
                      return (
                        <button
                          key={date}
                          onClick={() => setSelected(date)}
                          className={`min-w-[60px] h-18 sm:min-w-[75px] sm:h-22 lg:min-w-[80px] lg:h-24 rounded-xl lg:rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center cursor-pointer flex-shrink-0 ${
                            selected === date
                              ? "bg-primary border-primary text-gray-900 dark:text-white shadow-sm shadow-primary/30 scale-105"
                              : "bg-white dark:bg-primary/10 border-gray-600 dark:border-white/10 hover:border-primary hover:bg-primary/10 hover:-translate-y-1 cursor-pointer"
                          }`}
                        >
                          <span
                            className="text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-gray-300 font-bold"
                          >
                            {new Date(date).getDate()}
                          </span>

                          <span
                            className="text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-gray-300 font-bold"
                          >
                            {new Date(date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </span>

                          <span
                            className="text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-gray-300 font-bold"
                          >
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </span>
                        </button>
                      );
                    })}
                </span>

                <ChevronRightIcon className="hidden lg:block w-7 h-7 flex-shrink-0" />
              </>
            )}
          </div>
        </div>

        <button
          onClick={onBookHandler}
          disabled={!selected || availableDates.length === 0}
          className="w-full lg:w-auto mt-2 lg:mt-0 lg:ml-12 px-6 sm:px-8 lg:px-10 py-3 lg:py-4 rounded-2xl bg-primary font-semibold text-gray-900 dark:text-white shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 disabled:bg-gray-700 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
        >
          Continue Booking →
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
