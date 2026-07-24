import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { dateFormat } from "../../lib/dateFormat";
import Title from "../../components/admin/Title";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/booking/all");

      if (data.success) {
        setBookings(data.bookings);
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

  useEffect(() => {
    getAllBookings();
  }, []);
  return !isLoading ? (
    <>
      <div className="mb-8">
        <Title text1="List" text2="Bookings" />

        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and monitor all customer movie bookings.
        </p>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Booking History</h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            View all customer bookings, payment amounts and booking status.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2 text-nowrap">
            <thead>
              <tr className="bg-primary/20">
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white rounded-l-xl">
                  User Name
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Movie Name
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Show Time
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Seats
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Amount
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white rounded-r-xl">
                  Booked On
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.length > 0 ? (
                bookings.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-primary/5 hover:bg-primary/10 transition rounded-xl"
                  >
                    <td className="px-5 py-4 font-medium">
                      {item.user?.name || "Unknown User"}
                    </td>

                    <td className="px-5 py-4">
                      {item.movie?.title || "Movie Deleted"}
                    </td>

                    <td className="px-5 py-4">
                      {item.show
                        ? `${dateFormat(item.show.showDate)} ${item.show.showTime}`
                        : "N/A"}
                    </td>

                    <td className="px-5 py-4">{item.seats?.join(", ")}</td>

                    <td className="px-5 py-4 font-semibold text-primary">
                      {currency} {item.totalAmount}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                          item.bookingStatus === "booked"
                            ? "bg-green-500/15 text-green-400 border-green-500/30"
                            : "bg-red-500/15 text-red-400 border-red-500/30"
                        }`}
                      >
                        {item.bookingStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-900 dark:text-gray-300">
                      {dateFormat(item.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-600 dark:text-gray-400">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ListBookings;
