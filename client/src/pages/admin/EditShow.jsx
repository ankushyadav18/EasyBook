import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/api";
import toast from "react-hot-toast";
import Title from "../../components/admin/Title";

const EditShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    theatreName: "",
    screen: "",
    showDate: "",
    showTime: "",
    ticketPrice: "",
    totalSeats: "",
    isActive: true,
  });

  const getShow = async () => {
    try {
      const { data } = await api.get(`/show/single/${id}`);

      if (data.success) {
        const show = data.show;

        setFormData({
          theatreName: show.theatreName || "",
          screen: show.screen || "",
          showDate: show.showDate?.split("T")[0] || "",
          showTime: show.showTime || "",
          ticketPrice: show.ticketPrice || "",
          totalSeats: show.totalSeats || "",
          isActive: show.isActive,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load show");
    }
  };

  useEffect(() => {
    getShow();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.put(`/show/${id}`, formData);

      if (data.success) {
        toast.success("Show updated successfully");
        navigate("/admin/list-shows");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <Title text1="Edit" text2="Show" />

        <p className="text-gray-400 mt-2">
          Update show details and manage theatre schedules.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mt-8">
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Show Information</h2>

            <p className="text-sm text-gray-400 mt-1">
              Update theatre, schedule and ticket information.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Theatre Name
              </label>

              <input
                type="text"
                name="theatreName"
                value={formData.theatreName}
                onChange={handleChange}
                className="w-full bg-black/20 border border-primary/20 rounded-xl p-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Screen</label>

              <input
                type="text"
                name="screen"
                value={formData.screen}
                onChange={handleChange}
                className="w-full bg-black/20 border border-primary/20 rounded-xl p-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Show Date
              </label>

              <input
                type="date"
                name="showDate"
                value={formData.showDate}
                onChange={handleChange}
                className="w-full bg-black/20 border border-primary/20 rounded-xl p-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Show Time
              </label>

              <input
                type="text"
                name="showTime"
                value={formData.showTime}
                onChange={handleChange}
                placeholder="06:30 PM"
                className="w-full bg-black/20 border border-primary/20 rounded-xl p-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Ticket Price
              </label>

              <input
                type="number"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleChange}
                className="w-full bg-black/20 border border-primary/20 rounded-xl p-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Total Seats
              </label>

              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                className="w-full bg-black/20 border border-primary/20 rounded-xl p-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-black/20 border border-primary/20 rounded-xl p-4">
            <div>
              <h3 className="font-semibold">Active Show</h3>
              <p className="text-sm text-gray-400">
                Enable or disable this show for bookings.
              </p>
            </div>

            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition cursor-pointer disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Show"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/list-shows")}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default EditShow;
