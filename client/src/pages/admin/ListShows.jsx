import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getAllShows = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/show");

      console.log("SHOW DATA:", data.shows);

      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load shows");
    } finally {
      setLoading(false);
    }
  };
  const deleteShow = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this show?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/show/${id}`);

      if (data.success) {
        toast.success(data.message);

        setShows((prev) => prev.filter((show) => show._id !== id));
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to delete show");
    }
  };

  useEffect(() => {
    getAllShows();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="mb-2 md:mb-8">
        <Title text1="List" text2="Shows" />

        <p className="text-gray-600 dark:text-gray-400">
          View, edit and manage all scheduled movie shows.
        </p>
      </div>
      <div className="md:hidden space-y-4 mt-8">
        {shows.map((show) => (
          <div
            key={show._id}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {show.movie?.title || "Movie Deleted"}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              📅 {new Date(show.showDate).toLocaleDateString()}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400">🕒 {show.showTime}</p>

            <div className="flex justify-between mt-4 text-sm">
              <span className="text-blue-400">
                Bookings: {show.bookedSeats?.length || 0}
              </span>

              <span className="text-green-400">
                {currency}
                {(show.bookedSeats?.length || 0) * show.ticketPrice}
              </span>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => navigate(`/admin/edit-show/${show._id}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-xl"
              >
                Edit
              </button>

              <button
                onClick={() => deleteShow(show._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block bg-primary/10 border border-primary/20 rounded-2xl p-6 mt-8 overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="bg-primary/20 text-gray-200">
              <th className="text-left px-6 py-4 font-semibold rounded-l-xl">
                Movie
              </th>

              <th className="text-left px-6 py-4 font-semibold">Show Time</th>

              <th className="text-left px-6 py-4 font-semibold">Bookings</th>

              <th className="text-left px-6 py-4 font-semibold">Revenue</th>

              <th className="text-center px-6 py-4 font-semibold rounded-r-xl">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {shows.map((show) => (
              <tr
                key={show._id}
                className="bg-gray-100 dark:bg-black/20 hover:bg-primary/10 transition-all duration-300"
              >
                <td className="px-6 py-4 rounded-l-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {show.movie?.title || "Movie Deleted"}
                    </p>

                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {show.movie ? "Active Movie" : "Removed"}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{show.showTime}</p>

                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(show.showDate).toLocaleDateString()}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center min-w-10 px-3 py-1 bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-full text-sm font-semibold">
                    {show.bookedSeats?.length || 0}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 bg-green-500/15 text-green-400 border border-green-500/20 rounded-full font-semibold">
                    {currency}{" "}
                    {(show.bookedSeats?.length || 0) * show.ticketPrice}
                  </span>
                </td>

                <td className="px-6 py-4 rounded-r-xl text-center">
                  <button
                    onClick={() => navigate(`/admin/edit-show/${show._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white px-5 py-2 rounded-xl font-medium transition cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteShow(show._id)}
                    className="bg-red-600 hover:bg-red-700 text-gray-900 dark:text-white px-5 py-2 rounded-xl font-medium transition cursor-pointer ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListShows;
